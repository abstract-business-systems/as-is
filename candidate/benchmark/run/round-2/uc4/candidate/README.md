# wordstats (benchmark seed project)

A tiny mock Python project used as the fixed seed for the candidate/baseline workflow benchmark (target-design section 13, line 661; full-flow plan section 8). It exists only as benchmark fixture material — not as a live or promoted artifact.

## Contents

- `src/wordstats/` — a word-count library and `count` CLI (JSON output, sorted keys).
- `tests/` — focused unit tests for the library.
- `checks/validate.sh` — deterministic validation: compile check, unit tests, and a CLI smoke check against `checks/expected-count.json`. No network access; exits nonzero on the first failed check.
- `sample-data/words.txt` — fixed input for the smoke check.
- `records/ownership-map.md` — mock ownership records supporting component/scope resolution.
- `docs/design-notes.md` — where human-facing design notes are recorded.
- `docs/pipeline.md` — how the count pipeline turns a text file into sorted JSON.

## Running the checks

```sh
bash checks/validate.sh
```

## Setup note

This project shipped no agent-workflow configuration (no `.agents/`, no skill or agent links, no prompt files); the as-is workflow was adopted in place during the bounded documentation task. Its setup records are `as-is.md` (durable component record), `as-is.json` (machine configuration and local task metadata), and `tasks.md` (task narrative); setup effort is a measured dimension (target-design line 665).
