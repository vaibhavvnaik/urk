---
name: wsl-agent-access
description: Use this skill when setting up or restoring developer-tool authentication in WSL for Vercel, Railway, Google Cloud, Backblaze B2, and MongoDB Atlas. Covers install, login, verify, backup, and restore via a single bootstrap script.
---

# WSL Agent Access

## When to use

Use this skill when:
- a new WSL environment is created
- auth is broken/missing after reinstall
- you need to onboard Codex/Claude/other coding agents to same third-party accounts

## Canonical workflow

From repo root, run:

```bash
bash onboarding/agent-access-bootstrap.sh all
```

If auth state was previously backed up, restore first:

```bash
bash onboarding/agent-access-bootstrap.sh restore ~/agent-access-auth-state.tgz
```

## Fine-grained commands

```bash
bash onboarding/agent-access-bootstrap.sh install
bash onboarding/agent-access-bootstrap.sh login
bash onboarding/agent-access-bootstrap.sh verify
bash onboarding/agent-access-bootstrap.sh backup ~/agent-access-auth-state.tgz
```

## Account mapping

- `vaibhav.ideator@gmail.com`: Vercel, Railway, Backblaze, Google Cloud
- `ncgcompany2023@gmail.com`: MongoDB Atlas

## Notes

- Login is interactive and may require browser/device-code confirmation.
- Backup archives contain credentials; treat as sensitive.
