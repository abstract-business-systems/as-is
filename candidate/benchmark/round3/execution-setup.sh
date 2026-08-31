#!/usr/bin/env bash
# Round-3 execution setup (registered procedure per pre-registration-v3.md; idempotent, deterministic).
# Usage: bash candidate/benchmark/round3/execution-setup.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="$PWD"
RUN="candidate/benchmark/run/round-3"
RES="candidate/benchmark/results/round-3-2026-09-01"
TPL="/tmp/bench-r3/pi-templates"
ARMS=(baseline candidate)
UCS=(uc2 uc3 uc4 uc5)
# Registered variant checksum (pre-registration-v3.md section 2)
EXPECT_SHA="e4cd9366530976fa2f6e086e1447eec967088aa1ef8c476e7eb08afe6472c860"

rm -rf /tmp/bench-r3 "$RUN" "$RES"
mkdir -p /tmp/bench-r3 "$RUN" "$RES"

# 1. Baseline workflow materialization (live catalog @ 9a77e37, read-only)
git archive 9a77e37 | tar -x -C /tmp/bench-r3
mkdir -p /tmp/bench-r3/baseline-workflow
mv /tmp/bench-r3/skills /tmp/bench-r3/baseline-workflow/skills
git archive 9a77e37 agents | tar -x -C /tmp/bench-r3/baseline-workflow

# 2. Candidate (post-drop) variant: deterministic strip of Design-view sections; verify registered checksum
mkdir -p /tmp/bench-r3/candidate/skills/reusable /tmp/bench-r3/candidate/skills/master
for sub in reusable master; do
  for d in "candidate/skills/$sub"/*/; do
    name=$(basename "$d")
    mkdir -p "/tmp/bench-r3/candidate/skills/$sub/$name"
    python3 - "$d/SKILL.md" "/tmp/bench-r3/candidate/skills/$sub/$name/SKILL.md" <<'PYEOF'
import sys, re
src, dst = sys.argv[1], sys.argv[2]
t = open(src).read()
t = re.sub(r'\n#{2,4} Design view\n(?:(?!\n##).|\n)*', '\n', t, flags=re.S)
open(dst, 'w').write(t)
PYEOF
  done
done
got=$(cat /tmp/bench-r3/candidate/skills/{reusable,master}/*/SKILL.md | sha256sum | cut -d' ' -f1)
printf 'variant sha256 (reusable+master SKILL.md contents): %s\n' "$got" > "$RES/variant-checksum.txt"
if [ "$got" != "$EXPECT_SHA" ]; then
  echo "CHECKSUM MISMATCH: got $got, registered $EXPECT_SHA — aborting per registration"
  exit 1
fi
echo "variant checksum verified: $got"

# 3. Eight consumers: seed copy + uc overlays + git init + identical .pi plumbing
mkdir -p "$TPL/extensions"
cat > "$TPL/settings.json" <<'SETTINGS'
{
  "extensions": ["./extensions/worker-tools.ts"]
}
SETTINGS
cat > "$TPL/extensions/worker-tools.ts" <<SHIM
import wt from "$HOST/.pi/extensions/worker-tools.ts";
export * from "$HOST/.pi/extensions/worker-tools.ts";
export default wt;
SHIM

for uc in "${UCS[@]}"; do
  for arm in "${ARMS[@]}"; do
    c="$RUN/$uc/$arm"
    mkdir -p "$c"
    cp -r candidate/benchmark/seed/. "$c/"
    if [ -d "candidate/benchmark/round3/seed-ext/$uc" ]; then
      cp -r "candidate/benchmark/round3/seed-ext/$uc/." "$c/"
    fi
    mkdir -p "$c/.pi/extensions"
    cp "$TPL/settings.json" "$c/.pi/settings.json"
    cp "$TPL/extensions/worker-tools.ts" "$c/.pi/extensions/worker-tools.ts"
    ( cd "$c" && git init -q )
    ( cd "$c" && bash checks/validate.sh ) > "$RES/check-setup-pristine-$uc-$arm.log" 2>&1 \
      || { echo "PRISTINE CHECK FAILED: $uc/$arm"; exit 1; }
  done
done
echo "consumers: $(find "$RUN" -mindepth 2 -maxdepth 2 -type d | wc -l) of 8; pristine checks all exit 0"