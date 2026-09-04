#!/usr/bin/env bash
# F9-C1 confirmation arm setup (variant of the registered f9-cutover procedure per
# drafts/agentic-development-system-cutover/benchmark-confirmation-addendum-f9c1.md;
# idempotent, deterministic; candidate arm only, baseline result reused from F9).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="$PWD"
BENCH="drafts/agentic-development-system-cutover/candidate/benchmark"
RUN="$BENCH/run/f9-confirm"
RES="$BENCH/results/f9-confirm-2026-09-04"
# Post-flatten canonical catalog recipe: flattened concatenation of all SKILL.md files
# (recorded transition from the F9 order-dependent recipe; digest from the flatten work item).
CANDIDATE_SHA="52f23199c255fc3c016ec59b513d06da814e6d7c01cf06738c3e70c87cc59aae"

rm -rf "$RUN" "$RES"
mkdir -p "$RES" "$RUN/uc10/candidate/.pi/extensions"

# Candidate variant checksum: the live adopted catalog IS the candidate variant; no strip transform.
got=$(cat skills/*/SKILL.md | sha256sum | cut -d' ' -f1)
printf 'candidate variant sha256 (flattened SKILL.md contents): %s\n' "$got" > "$RES/candidate-variant-checksum.txt"
if [ "$got" != "$CANDIDATE_SHA" ]; then
  echo "CANDIDATE CHECKSUM MISMATCH: got $got, registered $CANDIDATE_SHA — aborting per registration"; exit 1
fi
printf 'candidate workflow head: %s\n' "$(git rev-parse HEAD)" > "$RES/candidate-workflow-head.txt"
echo "candidate variant checksum verified: $got"

# Consumer: seed copy + git init + identical .pi plumbing (round-6 pattern; single disjoint root).
c="$RUN/uc10/candidate"
cp -r "$BENCH/seed/." "$c/"
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
( cd "$c" && bash checks/validate.sh ) > "$RES/check-setup-pristine-uc10-candidate.log" 2>&1 \
  || { echo "PRISTINE CHECK FAILED: uc10/candidate"; exit 1; }
grep -q "All checks passed" "$RES/check-setup-pristine-uc10-candidate.log" || { echo "pristine check did not pass for candidate"; exit 1; }
echo "candidate consumer ready: $c (pristine checks exit 0)"