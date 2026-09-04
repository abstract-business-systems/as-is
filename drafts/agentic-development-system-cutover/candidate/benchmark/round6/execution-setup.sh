#!/usr/bin/env bash
# Round-6 execution setup (registered procedure per pre-registration-v6.md; idempotent, deterministic).
# Usage: bash candidate/benchmark/round6/execution-setup.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="$PWD"
RUN="candidate/benchmark/run/round-6"
RES="candidate/benchmark/results/round-6-2026-09-01"
TPL="/tmp/bench-r6/pi-templates"
ARMS=(baseline candidate)
UCS=(uc9 uc10)
# Registered candidate digest (pre-registration-v6.md section 2): the live post-drop catalog IS the variant; no strip transform.
EXPECT_SHA="9f8dbdcb1096edb03b8aea3c1811a0de3b0038467616c273516b70af1f5ec267"

rm -rf /tmp/bench-r6 "$RUN" "$RES"
mkdir -p /tmp/bench-r6 "$RUN" "$RES" "$RES/consumer-git-bundles"

# 1. Baseline workflow materialization (live catalog @ 9a77e37, read-only)
git archive 9a77e37 | tar -x -C /tmp/bench-r6
mkdir -p /tmp/bench-r6/baseline-workflow
mv /tmp/bench-r6/skills /tmp/bench-r6/baseline-workflow/skills
git archive 9a77e37 agents | tar -x -C /tmp/bench-r6/baseline-workflow

# 2. Candidate variant: copy the live post-drop catalog; verify registered digest
mkdir -p /tmp/bench-r6/candidate/skills/reusable /tmp/bench-r6/candidate/skills/master
cp -r candidate/skills/reusable/. /tmp/bench-r6/candidate/skills/reusable/
cp -r candidate/skills/master/. /tmp/bench-r6/candidate/skills/master/
got=$(cat /tmp/bench-r6/candidate/skills/reusable/*/SKILL.md /tmp/bench-r6/candidate/skills/master/*/SKILL.md | sha256sum | cut -d' ' -f1)
printf 'variant sha256 (reusable+master SKILL.md contents): %s\n' "$got" > "$RES/variant-checksum.txt"
if [ "$got" != "$EXPECT_SHA" ]; then
  echo "CHECKSUM MISMATCH: got $got, registered $EXPECT_SHA — aborting per registration"
  exit 1
fi
echo "variant checksum verified: $got"

# 3. Four consumers: seed copy + git init + identical .pi plumbing
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
    mkdir -p "$c/.pi/extensions"
    cp "$TPL/settings.json" "$c/.pi/settings.json"
    cp "$TPL/extensions/worker-tools.ts" "$c/.pi/extensions/worker-tools.ts"
    ( cd "$c" && git init -q )
    ( cd "$c" && bash checks/validate.sh ) > "$RES/check-setup-pristine-$uc-$arm.log" 2>&1 \
      || { echo "PRISTINE CHECK FAILED: $uc/$arm"; exit 1; }
  done
done
echo "consumers: $(find "$RUN" -mindepth 2 -maxdepth 2 -type d | wc -l) of 4; pristine checks all exit 0"