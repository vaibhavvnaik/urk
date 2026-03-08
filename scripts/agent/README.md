# Local Agent Queue (No GitHub Actions)

This flow is fully local and free at your current scale.

## Prerequisites

- `gh` authenticated (`gh auth login`)
- `jq`, `git`
- repo cloned with GitHub remote

## 1) Prepare next prioritized issue

```bash
scripts/agent/prepare-issue.sh
```

Optional:

```bash
scripts/agent/prepare-issue.sh 123 "Prefer minimal DB migration risk"
```

What it does:
- picks open `agent-ready` issue by `prio:1 -> prio:3` then oldest
- creates/pushes branch `feat/<id>-...` or `fix/<id>-...`
- writes prompt context to `.agent-work/prompt-<id>.md`
- updates issue labels/comments to show branch is ready for manual attach

## 2) Work in Codex IDE thread manually

- checkout prepared branch
- open the prompt file in `.agent-work/`
- continue interactive prompting in Codex IDE thread
- commit/push as needed

## 3) Finalize PR

```bash
scripts/agent/finalize-pr.sh <issue-number>
```

Optional branch override:

```bash
scripts/agent/finalize-pr.sh <issue-number> <branch-name>
```

This creates/updates a draft PR and marks issue as `agent-review`.
