#!/usr/bin/env bash
set -euo pipefail

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

repo_slug() {
  local url
  url="$(git config --get remote.origin.url)"
  if [[ "$url" =~ ^git@github.com:(.+)\.git$ ]]; then
    echo "${BASH_REMATCH[1]}"
  elif [[ "$url" =~ ^https://github.com/(.+)\.git$ ]]; then
    echo "${BASH_REMATCH[1]}"
  elif [[ "$url" =~ ^https://github.com/(.+)$ ]]; then
    echo "${BASH_REMATCH[1]}"
  else
    echo "Could not parse GitHub repo from remote.origin.url: $url" >&2
    exit 1
  fi
}

default_branch() {
  gh repo view "$(repo_slug)" --json defaultBranchRef --jq '.defaultBranchRef.name'
}

ensure_labels() {
  local repo
  repo="$(repo_slug)"

  create_if_missing() {
    local name="$1"
    local color="$2"
    local description="$3"

    if gh label list --repo "$repo" --limit 200 --search "$name" --json name --jq '.[] | select(.name == "'"$name"'") | .name' | grep -q "^${name}$"; then
      return
    fi

    gh label create "$name" --repo "$repo" --color "$color" --description "$description"
  }

  create_if_missing "agent-ready" "0e8a16" "Queued for coding-agent execution"
  create_if_missing "agent-working" "fbca04" "Currently being processed by agent"
  create_if_missing "agent-attached" "bfd4f2" "Branch prepared; waiting for manual Codex IDE thread work"
  create_if_missing "agent-review" "1d76db" "Agent opened PR; waiting for human review"
  create_if_missing "agent-nochange" "5319e7" "Agent run ended with no code changes"
  create_if_missing "prio:1" "b60205" "Highest priority"
  create_if_missing "prio:2" "d93f0b" "Medium priority"
  create_if_missing "prio:3" "fbca04" "Lower priority"
}

issue_meta_json() {
  local issue_number="${1:-}"
  local repo
  repo="$(repo_slug)"

  if [[ -n "$issue_number" ]]; then
    gh api "repos/${repo}/issues/${issue_number}"
    return
  fi

  gh api \
    -X GET \
    "repos/${repo}/issues" \
    -F state=open \
    -F labels=agent-ready \
    -F per_page=100 \
    | jq -c '
      map(select(.pull_request | not))
      | map(. + {
          prio_num: (
            [.labels[].name | select(startswith("prio:")) | sub("^prio:"; "") | tonumber?] | min // 999
          )
        })
      | sort_by(.prio_num, .created_at)
      | .[0]
    '
}

issue_branch_name() {
  local issue_json="$1"
  local issue_number issue_title issue_type slug

  issue_number="$(jq -r '.number' <<<"$issue_json")"
  issue_title="$(jq -r '.title' <<<"$issue_json")"

  issue_type="feat"
  if jq -e '[.labels[].name] | any(. == "bug" or . == "type:bug" or . == "fix")' >/dev/null <<<"$issue_json"; then
    issue_type="fix"
  fi

  slug="$(printf '%s' "$issue_title" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g' \
    | cut -c1-48)"

  if [[ -z "$slug" ]]; then
    slug="issue-${issue_number}"
  fi

  echo "${issue_type}/${issue_number}-${slug}"
}
