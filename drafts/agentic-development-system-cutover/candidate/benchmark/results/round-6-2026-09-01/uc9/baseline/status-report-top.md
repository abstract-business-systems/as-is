## Status: completed

Implemented and committed the bounded `wordstats` filter change.

### Setup performed

Adopted the as-is workflow inside the project before implementation:

- Added canonical architecture guidance in `AGENTS.md`.
- Added root architecture record: `as-is.md`.
- Added the `wordstats` component record: `src/wordstats/as-is.md`.
- Added local workflow configuration and task authority: `as-is.json`.
- Added parent task narrative: `tasks.md`.
- Added separate child records and task pairs:
  - `records/components/rarewords/`
  - `records/components/topwords/`
- Added design decision documentation to `docs/design-notes.md`.

The child records use `records/components/...` because the required implementation artifacts are Python files, specifically `src/wordstats/rarewords.py` and `src/wordstats/topwords.py`.

### Implementation

Changed files:

- `src/wordstats/rarewords.py`
- `src/wordstats/topwords.py`
- `src/wordstats/cli.py`
- `tests/test_counter.py`
- `docs/design-notes.md`
- `CHANGELOG.md`
- `as-is.json`
- `tasks.md`
- `records/components/rarewords/as-is.json`
- `records/components/rarewords/tasks.md`
- `records/components/topwords/as-is.json`
- `records/components/topwords/tasks.md`

Behavior:

- `--rare N` retains words with counts `<= N`.
- `--top N` retains the N most frequent words, breaking ties alphabetically.
- Both options require positive integers.
- Invalid values produce argparse diagnostics and exit code 2.
- When both options are supplied, rare filtering is applied before top selection.

### Delegation

Two separate `component-builder` children were launched concurrently with disjoint write sets:

- Rarewords launch: `22:13:35.970Z`
- Topwords launch: `22:13:35.982Z`

Both overlapped in liveness. Both child tasks are terminal `completed`. Because they ran in the retained parent worktree, the parent recorded explicit `no-separate-integration` dispositions and integrated both modules into the final parent commit.

The children initially recorded blocked expert gates because the seed had no local `agents/` directory. This was recorded rather than silently skipped; the parent then obtained fresh attributable final-diff validation and reconciled both child tasks.

### Checks

Final required command:

```text
compile: OK
test_both_options_apply_rare_then_top (test_counter.CliFilterTests.test_both_options_apply_rare_then_top) ... ok
test_invalid_filter_values_exit_two_with_clear_message (test_counter.CliFilterTests.test_invalid_filter_values_exit_two_with_clear_message) ... ok
test_rare_option (test_counter.CliFilterTests.test_rare_option) ... ok
test_top_option_with_alphabetical_tie_break (test_counter.CliFilterTests.test_top_option_with_alphabetical_tie_break) ... ok
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok
test_filters_return_new_mappings (test_counter.FilterTests.test_filters_return_new_mappings) ... ok
test_rare_filter_is_inclusive (test_counter.FilterTests.test_rare_filter_is_inclusive) ... ok
test_top_filter_sorts_by_count_then_alphabetically (test_counter.FilterTests.test_top_filter_sorts_by_count_then_alphabetically) ... ok

----------------------------------------------------------------------
Ran 11 tests in 0.008s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
exit code: 0
```

Additional validation:

- Task-record validator: `VALID`, exit code 0.
- Parent `can-complete`: eligible, with no non-terminal descendants, exit code 0.
- `git diff --check`: exit code 0.
- Direct invalid CLI checks confirmed exit code 2 with `must be a positive integer` for both options.

### Scope resolution and stop-for-direction

The expert plan review identified a required stop concerning:

1. Python module files versus directory-based child task boundaries.
2. Existing ownership records for CLI and design notes.
3. Combined-option semantics and child budgets.

The bounded resolution was recorded in `tasks.md`:

- Child records live under `records/components/`.
- Existing ownership records remain authoritative; no ownership map change was made.
- Each child was admitted at 180 seconds and `$0.75`.
- Combined options apply rare filtering first, then top selection.
- No third child or broader architectural change was introduced.

No unresolved implementation questions remain.

### Commits

- `8e1e3a5` — workflow setup
- `d52acf4` — parent task scope record
- `ce4252f` — completed rare/top filter implementation

Runtime session/tracing files, `.pi` host files, and generated `__pycache__` files remain untracked and were intentionally excluded from the commits. The optional orientation script also encountered the seed’s existing uppercase `CHANGELOG.md` versus its hardcoded lowercase `changelog.md`; no source change was made for that unrelated tooling issue.