#!/bin/sh
# Deterministic validation for the wordstats benchmark seed project.
# No network access; exits nonzero on the first failed check.
set -eu
cd "$(dirname "$0")/.."

python3 -m compileall -q src
echo "compile: OK"

PYTHONPATH=src python3 -m unittest discover -s tests -v
echo "unit tests: OK"

smoke="$(mktemp)"
trap 'rm -f "$smoke"' EXIT
PYTHONPATH=src python3 -m wordstats.cli count sample-data/words.txt > "$smoke"
diff -u checks/expected-count.json "$smoke"
echo "cli smoke check: OK"

echo "All checks passed."
