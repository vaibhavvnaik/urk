#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh"

require_cmd gh
require_cmd jq
require_cmd git

ISSUE_NUMBER="${1:-}"
EXTRA_PROMPT="${2:-}"
WORK_DIR=".agent-work"
RUN_TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

ensure_labels

issue_json="$(issue_meta_json "$ISSUE_NUMBER")"
if [[ -z "$issue_json" || "$issue_json" == "null" ]]; then
  echo "No eligible open issues (label with agent-ready)."
  exit 0
fi

repo="$(repo_slug)"
base_branch="$(default_branch)"
issue_number="$(jq -r '.number' <<<"$issue_json")"
issue_title="$(jq -r '.title' <<<"$issue_json")"
branch_name="$(issue_branch_name "$issue_json")"

mkdir -p "$WORK_DIR"
issue_json_file="$WORK_DIR/issue-${issue_number}.json"
comments_json_file="$WORK_DIR/issue-${issue_number}-comments.json"
prompt_file="$WORK_DIR/prompt-${issue_number}.md"

printf '%s\n' "$issue_json" > "$issue_json_file"
gh api "repos/${repo}/issues/${issue_number}/comments?per_page=100" > "$comments_json_file"

thread_prompts="$(jq -r '
  map(select((.body // "") | test("^/agent-prompt\\b"; "i")))
  | map("- [\(.created_at)] @\(.user.login): \((.body | sub("^/agent-prompt\\s*"; ""; "i")) | gsub("\\n"; " "))")
  | join("\n")
' "$comments_json_file")"

cat > "$prompt_file" <<PROMPT
You are working in repository ${repo}.

Primary objective:
Resolve GitHub issue #${issue_number} with a focused, production-safe change set.

Issue metadata:
- Number: #${issue_number}
- Title: ${issue_title}
- Prepared at: ${RUN_TS}
- Branch: ${branch_name}

Hard constraints:
- Use this branch only for this issue.
- Keep scope limited to this issue.
- If unrelated bugs are found, mention them in PR notes but do not fix in this branch.
- Update tests/docs only if behavior or setup changes.

Issue body:
$(jq -r '.body // ""' "$issue_json_file")
PROMPT

if [[ -n "$thread_prompts" ]]; then
  {
    echo
    echo "PM prompt thread from issue comments (/agent-prompt ...):"
    echo "$thread_prompts"
  } >> "$prompt_file"
fi

if [[ -n "$EXTRA_PROMPT" ]]; then
  {
    echo
    echo "Manual extra prompt input:"
    echo "$EXTRA_PROMPT"
  } >> "$prompt_file"
fi

git fetch origin "$base_branch"
git checkout -B "$branch_name" "origin/$base_branch"
git push -u origin "HEAD:refs/heads/${branch_name}"

gh issue edit "$issue_number" --repo "$repo" --add-label agent-working || true
gh issue edit "$issue_number" --repo "$repo" --remove-label agent-review || true
gh issue edit "$issue_number" --repo "$repo" --remove-label agent-nochange || true
gh issue edit "$issue_number" --repo "$repo" --add-label agent-attached || true
gh issue comment "$issue_number" --repo "$repo" --body "Manual attach prepared on branch: \`${branch_name}\`\nPrompt file: \`${prompt_file}\`\n\nNow open Codex in IDE on this branch and continue as a thread."

echo "Prepared issue #${issue_number}: ${issue_title}"
echo "Branch: ${branch_name}"
echo "Prompt: ${prompt_file}"
echo "Next: open Codex/IDE on this branch, then run scripts/agent/finalize-pr.sh ${issue_number}"
