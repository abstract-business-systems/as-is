## Status

Implemented and validated in the working tree. No commit was created.

### Setup performed

Adopted the as-is workflow in whole-project mode.

Created:

- `AGENTS.md` with the canonical as-is architecture instruction.
- `as-is.md` as the project architecture map.
- `records/setup-plan.md` with the reviewable setup plan, candidate dispositions, layout plans, planned writes, and exclusions.
- `records/components/wordstats/as-is.md`.
- `records/components/rarewords/as-is.md`.
- `records/components/topwords/as-is.md`.
- Root and child task records:
  - `as-is.json`, `tasks.md`
  - `records/components/rarewords/as-is.json`
  - `records/components/rarewords/tasks.md`
  - `records/components/topwords/as-is.json`
  - `records/components/topwords/tasks.md`

Also updated `docs/design-notes.md` before implementing the user-visible behavior.

### Delegated work

The two children were launched concurrently with `@preset/abs-medium`, high thinking, shared caller worktree, and separate bounded task records:

- `rarewords-child`: job `j-mthsl8rl-owtaeq`, launched at `22:10:43.233Z`, exited 0 after 136.320 seconds.
- `topwords-child`: job `j-mthsl8re-lyfuuw`, launched at `22:10:43.226Z`, exited 0 after 114.357 seconds.

Both child task records reached `completed`. The launcher reported generic `incomplete` handoff metadata because shared-worktree children did not create commits and did not run the parent validation suite; no separate integration was required. Parent validation was performed afterward.

### Files changed

Created:

- `AGENTS.md`
- `as-is.json`
- `as-is.md`
- `tasks.md`
- `records/setup-plan.md`
- `records/components/wordstats/as-is.md`
- `records/components/rarewords/as-is.md`
- `records/components/rarewords/as-is.json`
- `records/components/rarewords/tasks.md`
- `records/components/topwords/as-is.md`
- `records/components/topwords/as-is.json`
- `records/components/topwords/tasks.md`
- `src/wordstats/rarewords.py`
- `src/wordstats/topwords.py`
- `tests/test_cli.py`

Modified:

- `src/wordstats/cli.py`
- `docs/design-notes.md`
- `CHANGELOG.md`

The launcher also produced runtime state under `.as-is/`; it is not part of the authored implementation.

### Behavior

- `--rare N` keeps words with counts `<= N`.
- `--top N` keeps the N most frequent words, sorting ties alphabetically.
- Both options reject non-positive and non-integer values with argparse status 2 and the message `N must be a positive integer`.
- Both options can be composed; `--rare` is applied before `--top`.

### Validation

Required command:

```text
compile: OK
test_filters_can_be_composed (test_cli.CountCliFilterTests.test_filters_can_be_composed) ... ok
test_non_positive_or_non_integer_values_are_rejected (test_cli.CountCliFilterTests.test_non_positive_or_non_integer_values_are_rejected) ... ok
test_rare_option_keeps_counts_at_or_below_threshold (test_cli.CountCliFilterTests.test_rare_option_keeps_counts_at_or_below_threshold) ... ok
test_top_option_orders_ties_alphabetically (test_cli.CountCliFilterTests.test_top_option_orders_ties_alphabetically) ... ok
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok

----------------------------------------------------------------------
Ran 8 tests in 0.006s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
```

Exit code: `0`

Additional checks:

- `git diff --check`: no output, exit code `0`.
- Task JSON parsing: `task-json-parse: OK`, exit code `0`.
- Record headings, links, lineage, diagrams, and canonical instruction: `record links/headings/canonical-instruction: OK`, exit code `0`.

Invalid CLI evidence included:

```text
usage: wordstats count [-h] [--rare N] [--top N] path
wordstats count: error: argument --top: N must be a positive integer
invalid-exit=2
```

### Scope resolution and stops

The existing ownership map resolved `src/wordstats/` to the core utility component and `docs/design-notes.md` to the project documentation owner. The exact user request provided the required disposition for independent `rarewords` and `topwords` child components. Centralized component records under `records/components/` follow the existing `records/` convention.

No stop-for-direction was required. One initial record-link check found an incorrect relative path to `docs/design-notes.md`; it was corrected before final validation.

### Unresolved questions

No functional questions remain. The work is validated but remains uncommitted, and the launcher’s handoff status is not commit-eligible because the fixed workflow required shared caller worktrees for these children.