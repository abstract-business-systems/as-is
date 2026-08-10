#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
setup_script="$script_dir/setup-git-hooks.sh"
master_setup="$script_dir/../setup.sh"
test_root=$(mktemp -d)
trap 'rm -rf "$test_root"' EXIT

repo="$test_root/repo"
mkdir -p "$repo/.githooks"
git -C "$repo" init --quiet
printf '#!/usr/bin/env bash\n' > "$repo/.githooks/commit-msg"
chmod +x "$repo/.githooks/commit-msg"

output=$(cd "$repo" && bash "$master_setup")
[[ "$output" == *"core.hooksPath=.githooks"* ]]
[[ "$(git -C "$repo" config --local --get core.hooksPath)" == ".githooks" ]]

rm "$repo/.githooks/commit-msg"
if (cd "$repo" && bash "$master_setup" >/dev/null 2>&1); then
  printf 'error: setup unexpectedly succeeded without commit-msg hook\n' >&2
  exit 1
fi

printf 'setup-git-hooks.sh checks passed\n'
