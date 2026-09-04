# Status Report

## Setup performed and where its records live

Performed the workflow-prescribed adoption (`as-is-setup` skill, whole-project mode) inside the working directory only:

- **Setup plan** (dry-run, recorded in-session before writes): mode, target, effective boundary, candidate evidence, planned writes, and excluded paths (`checks/`, `sample-data/`, `docs/` deliberately not componentized).
- **`AGENTS.md`** — created; contains the canonical as-is architecture instruction exactly once (verified: count = 1).
- **`as-is.md`** (root) — project map with one component link (`src/wordstats/as-is.md#design`) and a small Mermaid overview.
- **`src/wordstats/as-is.md`** — component record `# wordstats - as-is` (purpose, boundary, design, relationships), updated during the task to reflect `--top N`.
- Setup validation: `git diff --check` exit 0; all writes stayed inside the working directory (path comparison via `git status --porcelain`); Mermaid syntax is a simple `graph TD` with no critical-view constraint.

## Design note location

`docs/design-notes.md`, appended **before implementation** in the existing note format (request / decision / options considered / bounded change), covering output format and tie-breaking.

## Files changed (all in commit `cbc2c66`, 9 files)

- `AGENTS.md`, `as-is.md`, `changelog.md`, `src/wordstats/as-is.md` (setup records + durable handoff)
- `docs/design-notes.md` (design note)
- `src/wordstats/cli.py` (`--top N`, `positive_int` argparse type), `src/wordstats/counter.py` (`most_frequent`)
- `tests/test_counter.py` (MostFrequentTests: 5 tests incl. tie-breaking), `tests/test_cli.py` (6 tests: top output, tie-breaking at cutoff, unchanged default output, zero/negative/non-integer rejection)

Pre-existing seed files (README, checks/, records/, sample-data/, `__init__.py`, CHANGELOG.md) were left untracked/untouched; `.as-is/` tracing and `.pi/` harness state were not committed. Transient `tasks.md` was removed at completion per the task lifecycle; its durable evidence lives in `changelog.md`.

## Check results (verbatim, final run)

```
compile: OK
test_default_output_unchanged (test_cli.CountTopOptionTests.test_default_output_unchanged) ... ok
test_top_negative_rejected_with_nonzero_exit (test_cli.CountTopOptionTests.test_top_negative_rejected_with_nonzero_exit) ... ok
test_top_non_integer_rejected_with_nonzero_exit (test_cli.CountTopOptionTests.test_top_non_integer_rejected_with_nonzero_exit) ... ok
test_top_prints_only_n_most_frequent_as_sorted_json (test_cli.CountTopOptionTests.test_top_prints_only_n_most_frequent_as_sorted_json) ... ok
test_top_ties_broken_alphabetically_at_cutoff (test_cli.CountTopOptionTests.test_top_ties_broken_alphabetically_at_cutoff) ... ok
test_top_zero_rejected_with_nonzero_exit (test_cli.CountTopOptionTests.test_top_zero_rejected_with_nonzero_exit) ... ok
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok
test_all_tied_counts_fill_alphabetically (test_counter.MostFrequentTests.test_all_tied_counts_fill_alphabetically) ... ok
test_limit_larger_than_vocabulary_returns_all (test_counter.MostFrequentTests.test_limit_larger_than_vocabulary_returns_all) ... ok
test_limit_one_returns_single_highest (test_counter.MostFrequentTests.test_limit_one_returns_single_highest) ... ok
test_returns_top_n_by_count (test_counter.MostFrequentTests.test_returns_top_n_by_count) ... ok
test_ties_broken_alphabetically_at_cutoff (test_counter.MostFrequentTests.test_ties_broken_alphabetically_at_cutoff) ... ok

----------------------------------------------------------------------
Ran 15 tests in 0.140s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
```

Exit code: `0`. (One intermediate failure — a test bug double-counting a trailing newline against `expected-count.json` — was fixed and is visible in the recorded first run above with exit 1.)

Direct CLI evidence: `--top 2` → exit 0, `{"fox": 2, "the": 3}`; `--top 0` → exit 2, `wordstats count: error: argument --top: --top must be a positive integer, got 0`; `--top -3` → exit 2 with the same clear message.

## How the bounded scope was resolved

- Feature scope followed `records/ownership-map.md`: component scope = `src/wordstats/` (owner `records/owners/core-utility.md`); design-note artifact per `records/owners/design-notes.md`.
- `CHANGELOG.md` has no owner in the map; per the map's stop-for-direction clause for unowned areas I did **not** edit it and instead wrote the workflow handoff to a new `changelog.md`.
- No stop-for-direction was required: scope, boundary, and acceptance conditions were fully resolvable from the ownership map and the verbatim request.
- One gate failed and was **not retried** (per the no-retry rule): attributable expert plan review and expert diff validation — the in-process subagent failed with `ENOENT: scandir '.../baseline/agents'` (no agents registry exists in this isolated seed copy). Recorded as a blocker in the task record and `changelog.md`; mitigated with deterministic validation, direct CLI evidence, and recorded self-review.

## Unresolved questions / residual risk

- Expert second-perspective review of the plan and final diff was unavailable (infrastructure, not workflow, failure); behavior is nonetheless covered by deterministic tests and manual CLI checks.
- Material assumptions recorded: the benchmark task's explicit setup order served as candidate-approval authorization for the one-component decomposition; new feature tests belong to the component's test surface.
- Cost: no subagent spend (subagent call failed); total arm spend is this session only — well under the $2.00 cap; wall clock well under 3600 s.