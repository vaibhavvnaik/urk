#!/usr/bin/env bash
set -euo pipefail

INFRA_EMAIL="${INFRA_EMAIL:-vaibhav.ideator@gmail.com}"
MONGO_EMAIL="${MONGO_EMAIL:-ncgcompany2023@gmail.com}"
STATE_FILE_DEFAULT="${HOME}/agent-access-auth-state.tgz"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK_SCRIPT="${SCRIPT_DIR}/check-auth.sh"

log() { printf '[agent-access] %s\n' "$*"; }
warn() { printf '[agent-access][warn] %s\n' "$*" >&2; }

usage() {
  cat <<USAGE
Usage:
  bash onboarding/agent-access-bootstrap.sh <command> [args]

Commands:
  install                  Install/update required CLIs and persistent PATH
  login                    Run one-time interactive logins for all providers
  verify                   Check install/auth status
  all                      install + login + verify
  backup [output.tgz]      Backup auth state for restore on fresh WSL
  restore <input.tgz>      Restore auth state from backup

Env overrides:
  INFRA_EMAIL, MONGO_EMAIL
USAGE
}

ensure_path() {
  local marker='# access-agent-path'
  local line='export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:/mnt/c/Users/lifen/AppData/Roaming/npm:$PATH"'

  if [ ! -f "$HOME/.bashrc" ]; then
    touch "$HOME/.bashrc"
  fi

  if grep -Fq "$marker" "$HOME/.bashrc" 2>/dev/null; then
    sed -i "s|^export PATH=\"\$HOME/.npm-global/bin:/mnt/c/Users/lifen/AppData/Roaming/npm:\$PATH\"$|$line|" "$HOME/.bashrc" || true
    sed -i "s|^export PATH=\"\$HOME/.local/bin:\$HOME/.npm-global/bin:/mnt/c/Users/lifen/AppData/Roaming/npm:\$PATH\"$|$line|" "$HOME/.bashrc" || true
  else
    {
      printf '\n%s\n' "$marker"
      printf '%s\n' "$line"
    } >> "$HOME/.bashrc"
    log "Added persistent PATH to ~/.bashrc"
  fi
}

require_sudo_apt() {
  if ! sudo -n apt-get -v >/dev/null 2>&1; then
    warn "Non-interactive sudo for apt-get is required."
    warn "Configure /etc/sudoers.d/codex-install first, then retry."
    exit 1
  fi
}

install_tools() {
  ensure_path
  require_sudo_apt

  log "Installing base packages"
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg apt-transport-https lsb-release python3-pip pipx

  log "Ensuring Google Cloud apt repo"
  if [ ! -f /etc/apt/keyrings/google-cloud.gpg ]; then
    curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/google-cloud.gpg
  fi
  if [ ! -f /etc/apt/sources.list.d/google-cloud-sdk.list ]; then
    echo 'deb [signed-by=/etc/apt/keyrings/google-cloud.gpg] https://packages.cloud.google.com/apt cloud-sdk main' | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list >/dev/null
  fi

  log "Ensuring MongoDB apt repo"
  if [ ! -f /etc/apt/keyrings/mongodb-server-8.0.gpg ]; then
    curl -fsSL https://pgp.mongodb.com/server-8.0.asc | sudo gpg --dearmor -o /etc/apt/keyrings/mongodb-server-8.0.gpg
  fi
  if [ ! -f /etc/apt/sources.list.d/mongodb-org-8.0.list ]; then
    echo 'deb [ signed-by=/etc/apt/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list >/dev/null
  fi

  log "Installing gcloud/mongosh/atlas"
  sudo apt-get update
  sudo apt-get install -y google-cloud-cli mongodb-mongosh mongodb-atlas-cli

  log "Installing/upgrading npm CLIs"
  npm install -g vercel@latest @railway/cli

  log "Installing/upgrading b2"
  pipx install b2 >/dev/null 2>&1 || pipx upgrade b2

  log "Install complete"
}

login_tools() {
  ensure_path

  log "Vercel"
  command -v vercel >/dev/null 2>&1 || { warn "vercel not installed"; exit 1; }
  vercel whoami >/dev/null 2>&1 || vercel login

  log "Railway"
  command -v railway >/dev/null 2>&1 || { warn "railway not installed"; exit 1; }
  railway whoami >/dev/null 2>&1 || railway login

  log "Google Cloud"
  command -v gcloud >/dev/null 2>&1 || { warn "gcloud not installed"; exit 1; }
  if ! gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q .; then
    gcloud auth login "$INFRA_EMAIL" --no-launch-browser
  fi

  log "Backblaze"
  if ! ((command -v b2 >/dev/null 2>&1 && b2 account get >/dev/null 2>&1) || ([ -x "$HOME/.local/bin/b2" ] && "$HOME/.local/bin/b2" account get >/dev/null 2>&1)); then
    if command -v b2 >/dev/null 2>&1; then
      b2 account authorize
    else
      "$HOME/.local/bin/b2" account authorize
    fi
  fi

  log "MongoDB Atlas"
  command -v atlas >/dev/null 2>&1 || { warn "atlas not installed"; exit 1; }
  atlas auth whoami >/dev/null 2>&1 || atlas auth login --noBrowser

  log "Login flow complete"
}

verify_tools() {
  if [ ! -x "$CHECK_SCRIPT" ]; then
    warn "Missing check script: $CHECK_SCRIPT"
    exit 1
  fi
  bash "$CHECK_SCRIPT"
}

backup_state() {
  local outfile="${1:-$STATE_FILE_DEFAULT}"
  local paths=()

  [ -d "$HOME/.local/share/com.vercel.cli" ] && paths+=(".local/share/com.vercel.cli")
  [ -d "$HOME/.railway" ] && paths+=(".railway")
  [ -d "$HOME/.config/gcloud" ] && paths+=(".config/gcloud")
  [ -d "$HOME/.config/b2" ] && paths+=(".config/b2")
  [ -f "$HOME/.b2_account_info" ] && paths+=(".b2_account_info")
  [ -d "$HOME/.config/atlascli" ] && paths+=(".config/atlascli")

  if [ ${#paths[@]} -eq 0 ]; then
    warn "No auth state paths found to backup"
    exit 1
  fi

  tar -czf "$outfile" -C "$HOME" "${paths[@]}"
  chmod 600 "$outfile" || true
  log "Wrote auth state backup: $outfile"
  warn "Backup contains credentials. Store securely."
}

restore_state() {
  local infile="${1:-}"
  if [ -z "$infile" ]; then
    warn "restore requires input .tgz path"
    exit 1
  fi
  if [ ! -f "$infile" ]; then
    warn "file not found: $infile"
    exit 1
  fi

  tar -xzf "$infile" -C "$HOME"
  log "Restored auth state from: $infile"
}

cmd="${1:-help}"
case "$cmd" in
  install)
    install_tools
    ;;
  login)
    login_tools
    ;;
  verify)
    verify_tools
    ;;
  all)
    install_tools
    login_tools
    verify_tools
    ;;
  backup)
    backup_state "${2:-}"
    ;;
  restore)
    restore_state "${2:-}"
    verify_tools
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    warn "Unknown command: $cmd"
    usage
    exit 1
    ;;
esac
