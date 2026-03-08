#!/usr/bin/env bash
set -euo pipefail

check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd" >/dev/null 2>&1; then
    echo "[ok] $name"
  else
    echo "[missing] $name"
  fi
}

check "vercel installed" "command -v vercel"
check "vercel auth" "command -v vercel && vercel whoami"
check "railway installed" "command -v railway"
check "railway auth" "command -v railway && railway whoami"
check "gcloud installed" "command -v gcloud"
check "gcloud auth" "command -v gcloud && gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q ."
check "b2 installed" "command -v b2 || [ -x \"$HOME/.local/bin/b2\" ]"
check "backblaze auth" "(command -v b2 && b2 account get >/dev/null) || ([ -x \"$HOME/.local/bin/b2\" ] && \"$HOME/.local/bin/b2\" account get >/dev/null)"
check "mongosh installed" "command -v mongosh"
check "atlas installed" "command -v atlas"
check "atlas auth" "command -v atlas && atlas auth whoami >/dev/null"
