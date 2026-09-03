#!/usr/bin/env bash
# F9 cutover benchmark setup (registered procedure per candidate/benchmark/pre-registration-f9.md; idempotent, deterministic).
# Builds the disjoint consumer roots for both arms and verifies the variant checksums.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="$PWD"
RUN="candidate/benchmark/run/f9-cutover"
RES="candidate/benchmark/results/f9-cutover-2026-09-03"
CANDIDATE_SHA="01c9e750702350c2a731eb9a57a432092ed6a548f7459c2bd33dc0c8c7b6c6d7"
BASELINE_WF="/tmp/bench-r9/baseline-workflow"

if [ ! -d "$BASELINE_WF/skills" ]; then
  echo "baseline workflow checkout missing at $BASELINE_WF (clone at 9a77e37 + bun install first)"; exit 1
fi
rm -rf "$RUN" "$RES"
mkdir -p "$RES" "$RUN/uc10/baseline/.pi/extensions" "$RUN/uc10/candidate/.pi/extensions"

# Candidate variant checksum: the live adopted catalog IS the candidate variant; no strip transform.
got=$(cat skills/reusable/*/SKILL.md skills/master/*/SKILL.md | sha256sum | cut -d' ' -f1)
printf 'candidate variant sha256 (reusable+master SKILL.md contents): %s\n' "$got" > "$RES/candidate-variant-checksum.txt"
if [ "$got" != "$CANDIDATE_SHA" ]; then
  echo "CANDIDATE CHECKSUM MISMATCH: got $got, registered $CANDIDATE_SHA — aborting per registration"; exit 1
fi
echo "candidate variant checksum verified: $got"

# Baseline variant checksum: the master-pin baseline skill catalog, read from the arm checkout.
bgot=$(cd "$BASELINE_WF" && find skills -mindepth 2 -maxdepth 2 -name SKILL.md -print0 | sort -z | xargs -0 cat | sha256sum | cut -d' ' -f1)
printf 'baseline variant sha256 (baseline-workflow SKILL.md contents at 9a77e37): %s\n' "$bgot" > "$RES/baseline-variant-checksum.txt"
git -C "$BASELINE_WF" rev-parse HEAD > "$RES/baseline-workflow-head.txt"
printf 'candidate workflow head: %s\n' "$(git rev-parse HEAD)" > "$RES/candidate-workflow-head.txt"
echo "baseline variant checksum: $bgot"

# Consumers: seed copies + git init + identical .pi plumbing (round-6 pattern; disjoint roots).
for arm in baseline candidate; do
  c="$RUN/uc10/$arm"
  cp -r candidate/benchmark/seed/. "$c/"
  cat > "$c/.pi/settings.json" <<SETTINGS
{
  "extensions": ["./extensions/worker-tools.ts"]
}
SETTINGS
  cat > "$c/.pi/extensions/worker-tools.ts" <<SHIM
import wt from "$HOST/.pi/extensions/worker-tools.ts";
export * from "$HOST/.pi/extensions/worker-tools.ts";
export default wt;
SHIM
  ( cd "$c" && git init -q )
  ( cd "$c" && bash checks/validate.sh ) > "$RES/check-setup-pristine-uc10-$arm.log" 2>&1 \
    || { echo "PRISTINE CHECK FAILED: uc10/$arm"; exit 1; }
  grep -q "All checks passed" "$RES/check-setup-pristine-uc10-$arm.log" || { echo "pristine check did not pass for $arm"; exit 1; }
  echo "$arm consumer ready: $c (pristine checks exit 0)"
done