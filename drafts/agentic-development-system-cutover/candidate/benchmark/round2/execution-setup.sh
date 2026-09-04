#!/usr/bin/env bash
# Round-2 execution setup (registered procedure; idempotent, deterministic).
# Usage: bash candidate/benchmark/round2/execution-setup.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="$PWD"
RUN="candidate/benchmark/run/round-2"
RES="candidate/benchmark/results/round-2-2026-08-30"
TPL="/tmp/bench-r2/pi-templates"
ARMS=(baseline candidate candidate-no-diagrams)
UCS=(uc2 uc3 uc4 uc5)

rm -rf /tmp/bench-r2 "$RUN" "$RES"
mkdir -p /tmp/bench-r2 "$RUN" "$RES"

# 1. Baseline workflow materialization (live catalog @ 9a77e37, read-only)
git archive 9a77e37 | tar -x -C /tmp/bench-r2
mkdir -p /tmp/bench-r2/baseline-workflow
mv /tmp/bench-r2/skills /tmp/bench-r2/baseline-workflow/skills
git archive 9a77e37 agents | tar -x -C /tmp/bench-r2/baseline-workflow

# 2. Candidate-no-diagrams variant: deterministic strip of "## Design view" sections from SKILL.md
mkdir -p /tmp/bench-r2/candidate-no-diagrams/skills/reusable /tmp/bench-r2/candidate-no-diagrams/skills/master
for sub in reusable master; do
  for d in "candidate/skills/$sub"/*/; do
    name=$(basename "$d")
    mkdir -p "/tmp/bench-r2/candidate-no-diagrams/skills/$sub/$name"
    python3 - "$d/SKILL.md" "/tmp/bench-r2/candidate-no-diagrams/skills/$sub/$name/SKILL.md" <<'PYEOF'
import sys, re
src, dst = sys.argv[1], sys.argv[2]
t = open(src).read()
t = re.sub(r'\n#{2,4} Design view\n(?:(?!\n##).|\n)*', '\n', t, flags=re.S)
open(dst, 'w').write(t)
PYEOF
  done
done
printf 'variant sha256 (reusable+master SKILL.md contents): ' > "$RES/variant-checksum.txt"
cat /tmp/bench-r2/candidate-no-diagrams/skills/{reusable,master}/*/SKILL.md | sha256sum >> "$RES/variant-checksum.txt"
echo "variant sha256: $(sed -n '$s/^\([0-9a-f]\{64\}\).*/\1/p' "$RES/variant-checksum.txt")"

# 3. Twelve consumers: seed copy + uc overlays + git init + identical .pi plumbing
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
    if [ -d "candidate/benchmark/round2/seed-ext/$uc" ]; then
      cp -r "candidate/benchmark/round2/seed-ext/$uc/." "$c/"
    fi
    mkdir -p "$c/.pi/extensions"
    cp "$TPL/settings.json" "$c/.pi/settings.json"
    cp "$TPL/extensions/worker-tools.ts" "$c/.pi/extensions/worker-tools.ts"
    ( cd "$c" && git init -q )
    ( cd "$c" && bash checks/validate.sh ) > "$RES/check-setup-pristine-$uc-$arm.log" 2>&1 \
      || { echo "PRISTINE CHECK FAILED: $uc/$arm"; exit 1; }
  done
done
echo "consumers: $(find "$RUN" -mindepth 2 -maxdepth 2 -type d | wc -l) of 12; pristine checks all exit 0"