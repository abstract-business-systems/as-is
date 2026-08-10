#!/usr/bin/env bash
set -euo pipefail

# Install repository-managed Git hooks for the current checkout. The setting is
# stored in the repository's local/common config, so linked worktrees use the
# same hook directory as the primary checkout.

repo_root=$(git rev-parse --show-toplevel)
git_dir=$(git rev-parse --git-dir)
hooks_dir="$repo_root/.githooks"
hook="$hooks_dir/commit-msg"

if [[ ! -d "$hooks_dir" ]]; then
  printf 'error: managed hook directory not found: %s\n' "$hooks_dir" >&2
  exit 1
fi

if [[ ! -f "$hook" ]]; then
  printf 'error: commit-msg hook not found: %s\n' "$hook" >&2
  exit 1
fi

if [[ ! -x "$hook" ]]; then
  printf 'error: commit-msg hook is not executable: %s\n' "$hook" >&2
  exit 1
fi

# A repository-local core.hooksPath is shared by linked worktrees through the
# common repository config. Keep the value relative so the checkout is portable.
git config --local core.hooksPath .githooks

configured=$(git config --local --get core.hooksPath)
if [[ "$configured" != ".githooks" ]]; then
  printf 'error: failed to configure core.hooksPath (got %q)\n' "$configured" >&2
  exit 1
fi

printf 'Installed repository hooks for %s\n' "$repo_root"
printf '  core.hooksPath=%s\n' "$configured"
printf '  commit-msg=%s\n' "$hook"
printf '  git-dir=%s\n' "$git_dir"
printf 'Linked worktrees use this repository-managed hook configuration.\n'
