## Status: completed

### Setup performed

Adopted the as-is workflow in whole-project mode for this consumer:

- Added target-local `AGENTS.md` with the canonical `as-is.md` architecture instruction.
- Added the root architecture record: `as-is.md`.
- Added the `wordstats core` component record: `src/wordstats/as-is.md`.
- Added the reviewable setup plan: `docs/as-is-setup-plan.md`.
- Resolved `src/wordstats` as the only component; tests, checks, documentation, and records remain support artifacts.
- Added the stats owner record and ownership mapping.
- Created the required parent and child task records before implementation. They were completed and then removed as transient task artifacts per the task-record lifecycle; durable results are summarized in `CHANGELOG.md`.

### Implementation

A single delegated child attempt was launched through the governed launcher with:

- Model: `@preset/abs-medium`
- Thinking: `high`
- Worker: `component-builder`
- Budget: `$0.05`, 180 seconds
- Execution: caller worktree, no worktree isolation

The child completed on its first attempt in 115.453 seconds. It added:

- `src/wordstats/stats.py`
- `tests/test_stats.py`

The parent then integrated the caller-worktree result without a separate cherry-pick and added:

- `--stats` parsing and output handling in `src/wordstats/cli.py`
- `tests/test_cli.py`
- Component architecture alignment in `src/wordstats/as-is.md`
- Design decision in `docs/design-notes.md`
- Ownership updates in `records/ownership-map.md` and `records/owners/stats.md`
- Changelog entry in `CHANGELOG.md`

The option preserves the existing output when omitted and appends:

```json
"stats": {
  "max": 3,
  "median": 1.0,
  "min": 1,
  "unique": 6
}
```

### Validation

Final command: `bash checks/validate.sh`

Verbatim output:

```text
compile: OK
test_stats_option_appends_summary_object (test_cli.CountCliTests.test_stats_option_appends_summary_object) ... ok
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok
test_does_not_mutate_input (test_stats.SummarizeCountsTests.test_does_not_mutate_input) ... ok
test_empty_input (test_stats.SummarizeCountsTests.test_empty_input) ... ok
test_even_count_median_is_average (test_stats.SummarizeCountsTests.test_even_count_median_is_average) ... ok
test_odd_count_median (test_stats.SummarizeCountsTests.test_odd_count_median) ... ok
test_summary_values (test_stats.SummarizeCountsTests.test_summary_values) ... ok

----------------------------------------------------------------------
Ran 10 tests in 0.002s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
EXIT_CODE=0
```

Exit code: `0`.

Additional record-link and whitespace checks passed with exit code `0`. The implementation was committed as:

```text
8cbb964 Add count statistics option
```

### Scope resolution and escalations

- Scope resolved to the existing `src/wordstats` component through `records/ownership-map.md`.
- No stop-for-direction was required.
- The child did not stop on budget, so no recovery retry or re-roll occurred.
- The child reported that attributable expert review was unavailable because the consumer has no local `agents` directory. This remains a workflow-evidence limitation, not a code blocker.
- The launcher’s mechanical registry still reports the caller-worktree child handoff as incomplete because there was no separate child commit and the transient task records were cleaned up. Parent-side source inspection and the final deterministic checks independently validate the delivered behavior.

No unresolved functional questions remain.