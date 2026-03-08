# Onboarding and Access Agent

This folder now contains a repeatable bootstrap flow you can rerun on a fresh WSL environment.

## One-command setup

From repo root:

```bash
bash onboarding/agent-access-bootstrap.sh all
```

This runs:
- `install`: installs/updates CLIs and persistent PATH
- `login`: interactive auth for Vercel, Railway, GCloud, Backblaze, Atlas
- `verify`: confirms install + auth status

## Individual commands

```bash
bash onboarding/agent-access-bootstrap.sh install
bash onboarding/agent-access-bootstrap.sh login
bash onboarding/agent-access-bootstrap.sh verify
```

## Backup and restore auth state

Create a local backup file:

```bash
bash onboarding/agent-access-bootstrap.sh backup ~/agent-access-auth-state.tgz
```

Restore after WSL reset:

```bash
bash onboarding/agent-access-bootstrap.sh restore ~/agent-access-auth-state.tgz
```

## Accounts mapping

- `vaibhav.ideator@gmail.com`: Vercel, Railway, Backblaze, Google Cloud
- `ncgcompany2023@gmail.com`: MongoDB Atlas

## Security notes

- Backup archives include tokens/credentials. Keep them encrypted and private.
- GitHub Secrets are write-only; rotate keys if exposure is suspected.

## Agent issue automation

- Local scripts (no GitHub Actions): `scripts/agent/README.md`

This lets you queue issues for coding agents using labels (`agent-ready`, `prio:1..3`), auto-create per-issue branches, work interactively in Codex IDE, and then open a draft PR.
