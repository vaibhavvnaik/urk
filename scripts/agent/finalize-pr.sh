#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh"

require_cmd gh
require_cmd jq
require_cmd git

ISSUE_NUMBER="${1:-}"
BRANCH_OVERRIDE="${2:-}"

if [[ -z "$ISSUE_NUMBER" ]]; then
  echo "Usage: scripts/agent/finalize-pr.sh <issue-number> [branch-name]" >&2
  exit 1
fi

ensure_labels

repo="$(repo_slug)"
base_branch="$(default_branch)"
issue_json="$(issue_meta_json "$ISSUE_NUMBER")"

issue_number="$(jq -r '.number' <<<"$issue_json")"
issue_title="$(jq -r '.title' <<<"$issue_json")"
issue_type="feat"
if jq -e '[.labels[].name] | any(. == "bug" or . == "type:bug" or . == "fix")' >/dev/null <<<"$issue_json"; then
  issue_type="fix"
fi

branch_name="$(issue_branch_name "$issue_json")"
if [[ -n "$BRANCH_OVERRIDE" ]]; then
  branch_name="$BRANCH_OVERRIDE"
fi

git fetch origin "$branch_name"
git checkout -B "$branch_name" "origin/$branch_name"
git push -u origin "$branch_name"

pr_title="[${issue_type}] #${issue_number} ${issue_title}"
pr_body_file=".agent-work/pr-body-${issue_number}.md"
mkdir -p .agent-work
cat > "$pr_body_file" <<BODY
## Summary
Manual Codex thread work completed for issue #${issue_number}.

## Traceability
- Branch: ${branch_name}
- Issue: #${issue_number}

## Notes
Please review scope, tests, and risk areas before merge.

Fixes #${issue_number}
BODY

existing_pr="$(gh pr list --repo "$repo" --head "$branch_name" --state open --json number,url --jq '.[0]')"

if [[ -n "$existing_pr" && "$existing_pr" != "null" ]]; then
  pr_number="$(jq -r '.number' <<<"$existing_pr")"
  pr_url="$(jq -r '.url' <<<"$existing_pr")"
  gh pr edit "$pr_number" --repo "$repo" --title "$pr_title" --body-file "$pr_body_file"
else
  pr_url="$(gh pr create --repo "$repo" --draft --base "$base_branch" --head "$branch_name" --title "$pr_title" --body-file "$pr_body_file")"
fi

gh issue edit "$issue_number" --repo "$repo" --remove-label agent-working || true
gh issue edit "$issue_number" --repo "$repo" --remove-label agent-attached || true
gh issue edit "$issue_number" --repo "$repo" --add-label agent-review || true
gh issue comment "$issue_number" --repo "$repo" --body "Draft PR ready for review: ${pr_url}"

echo "PR ready: ${pr_url}"
