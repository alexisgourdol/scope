#!/usr/bin/env bash
# .devcontainer/post-create.sh
#
# Runs once when the devcontainer is created (or rebuilt).
# Designed to be idempotent — safe to re-run.
# Each step is independent: a failure in one doesn't stop the others.

set +e  # Don't bail on errors — we want every step to attempt to run

echo "→ Installing CLI tools (fzf, jq, tree)..."
sudo apt-get update -qq
sudo apt-get install -y --no-install-recommends fzf jq tree
sudo rm -rf /var/lib/apt/lists/*

echo "→ Fixing permissions on /commandhistory..."
# The named volume mounts as root-owned. Fix ownership so the node user can write history.
sudo chown -R node:node /commandhistory
touch /commandhistory/.zsh_history /commandhistory/.bash_history

echo "→ Fixing permissions on /home/node/.claude..."
# Same problem as /commandhistory — the named volume mounts root-owned.
# Without this, `claude` can't persist OAuth credentials and login appears to hang.
sudo chown -R node:node /home/node/.claude

echo "→ Configuring shell history persistence..."
# Append HISTFILE config to shell rc files only if not already present.
grep -q "HISTFILE=/commandhistory" ~/.zshrc 2>/dev/null || cat >> ~/.zshrc <<'EOF'

# Persist shell history across container rebuilds (devcontainer)
export HISTFILE=/commandhistory/.zsh_history
export PROMPT_COMMAND='history -a'
EOF

grep -q "HISTFILE=/commandhistory" ~/.bashrc 2>/dev/null || cat >> ~/.bashrc <<'EOF'

# Persist shell history across container rebuilds (devcontainer)
export HISTFILE=/commandhistory/.bash_history
export PROMPT_COMMAND='history -a'
EOF

echo "→ Running npm install (if package.json exists)..."
if [ -f "package.json" ]; then
  npm install
else
  echo "  (no package.json yet — skipping. Claude Code will scaffold the project.)"
fi

echo "✓ post-create.sh complete."
