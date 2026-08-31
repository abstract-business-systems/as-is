# Validation

This page explains how the project's deterministic validation works for a new reader.

## What the gate is

`checks/validate.sh` is the single deterministic validation gate for the project. One command runs every check, no network access is required, and the script exits nonzero on the first failed check. Every change to the project is expected to pass it:

```sh
bash checks/validate.sh
```

The script starts by changing to the project root relative to its own location (`cd "$(dirname "$0")/.."`), so once invoked by its path the checks run against the project regardless of the caller's directory; the documented invocation below assumes the project root.

## The three checks

The script runs the checks in a fixed order and stops at the first failure (`set -eu`), so a later check never runs after an earlier one has failed:

1. **Compile check** — `python3 -m compileall -q src` byte-compiles every module under `src/` and fails on any syntax error.
2. **Unit tests** — `PYTHONPATH=src python3 -m unittest discover -s tests -v` runs the focused unit tests for the library.
3. **CLI smoke check** — runs `wordstats count` on the fixed input `sample-data/words.txt` and compares the JSON output byte-for-byte against `checks/expected-count.json` with `diff -u`. This pins the CLI's exact output contract: keys sorted alphabetically, 2-space indent.

On success the script prints `compile: OK`, `unit tests: OK`, `cli smoke check: OK`, and finally `All checks passed.` On failure it exits nonzero at the failing step.

## Validation flow

```mermaid
sequenceDiagram
    autonumber
    actor Author
    participant Script as checks/validate.sh
    participant Compile as Compile check
    participant Tests as Unit tests
    participant Smoke as CLI smoke check

    Author->>Script: bash checks/validate.sh
    Script->>Compile: python3 -m compileall -q src
    Compile-->>Script: exit 0
    Script-->>Author: echo "compile: OK"
    Script->>Tests: PYTHONPATH=src python3 -m unittest<br/>discover -s tests -v
    Tests-->>Script: all tests pass
    Script-->>Author: echo "unit tests: OK"
    Script->>Smoke: PYTHONPATH=src python3 -m wordstats.cli<br/>count sample-data/words.txt
    Smoke-->>Script: JSON output written to a temp file
    Script->>Smoke: diff -u checks/expected-count.json "$smoke"
    Smoke-->>Script: identical
    Script-->>Author: echo "cli smoke check: OK"
    Script-->>Author: echo "All checks passed." (exit 0)
    Note over Script,Smoke: On the first failed check the script aborts with a nonzero exit; later checks do not run.
```

## Where the expected output lives

`checks/expected-count.json` is the byte-for-byte expectation for the smoke check. It records the word frequencies of `sample-data/words.txt` ("the quick brown fox / the lazy dog / the fox"): `the` appears 3 times, `fox` twice, and `brown`, `dog`, `lazy`, `quick` once each. If the CLI output format or the sample data changes intentionally, this file and the design note in `docs/design-notes.md` must be updated in the same change.
