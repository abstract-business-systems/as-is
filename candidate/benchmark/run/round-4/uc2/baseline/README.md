# wordstats (benchmark seed project)

A tiny mock Python project used as the fixed seed for the candidate/baseline workflow benchmark (target-design section 13, line 661; full-flow plan section 8). It exists only as benchmark fixture material — not as a live or promoted artifact.

## Contents

- `src/wordstats/` — a word-count library and `count` CLI (JSON output, sorted keys).
- `tests/` — focused unit tests for the library.
- `checks/validate.sh` — deterministic validation: compile check, unit tests, and a CLI smoke check against `checks/expected-count.json`. No network access; exits nonzero on the first failed check.
- `sample-data/words.txt` — fixed input for the smoke check.
- `records/ownership-map.md` — mock ownership records supporting component/scope resolution.
- `docs/design-notes.md` — where human-facing design notes are recorded.

## Installation

This project publishes no package. Run the CLI from a checkout of this repository:

```sh
PYTHONPATH=src python3 -m wordstats.cli count <path-to-text-file>
```

## Running the checks

```sh
bash checks/validate.sh
```

## Setup note

This project intentionally contains no agent-workflow configuration (no `.agents/`, no skill or agent links, no prompt files). Benchmark consumers must perform their own setup inside their consumer directory before implementing any feature; setup effort is a measured dimension (target-design line 665).