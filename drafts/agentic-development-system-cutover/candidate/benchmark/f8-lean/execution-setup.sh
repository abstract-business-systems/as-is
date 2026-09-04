#!/usr/bin/env bash
# F8 lean-arm setup (registered procedure per candidate/benchmark/pre-registration-f8.md; idempotent, deterministic).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="$PWD"
RUN="candidate/benchmark/run/f8-lean"
RES="candidate/benchmark/results/f8-lean-2026-09-03"
EXPECT_SHA="01c9e750702350c2a731eb9a57a432092ed6a548f7459c2bd33dc0c8c7b6c6d7"

rm -rf "$RUN" "$RES"
mkdir -p "$RES" "$RUN/uc10/lean" "$RUN/uc10/lean/.pi/extensions"

# Variant checksum: the live adopted catalog IS the lean variant; no strip transform.
got=$(cat skills/reusable/*/SKILL.md skills/master/*/SKILL.md | sha256sum | cut -d' ' -f1)
printf 'lean variant sha256 (reusable+master SKILL.md contents): %s\n' "$got" > "$RES/variant-checksum.txt"
if [ "$got" != "$EXPECT_SHA" ]; then
  echo "CHECKSUM MISMATCH: got $got, registered $EXPECT_SHA — aborting per registration"
  exit 1
fi
echo "lean variant checksum verified: $got"

# Consumer: seed copy + git init + identical .pi plumbing (round-6 pattern, disjoint root).
c="$RUN/uc10/lean"
cp -r candidate/benchmark/seed/. "$c/"
cat > "$c/.pi/settings.json" <<SETTINGS
{
  "extensions": ["./extensions/worker-tools.ts"]
}
SETTINGS
cat > "$c/.pi/extensions/worker-tools.ts" <<SHIM
import wt from "$PWD/.pi/extensions/worker-tools.ts";
export * from "$PWD/.pi/extensions/worker-tools.ts";
export default wt;
SHIM
( cd "$c" && git init -q )
( cd "$c" && bash checks/validate.sh ) > "$RES/check-setup-pristine-uc10-lean.log" 2>&1 \
  || { echo "PRISTINE CHECK FAILED: uc10/lean"; exit 1; }
grep -q "All checks passed" "$RES/check-setup-pristine-uc10-lean.log" || { echo "pristine check did not pass"; exit 1; }
echo "lean consumer ready: $c (pristine checks exit 0)"