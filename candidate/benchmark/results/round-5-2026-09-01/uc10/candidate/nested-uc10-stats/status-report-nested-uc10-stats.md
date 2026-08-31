**Finding:** Leaf task completed within budget. `src/wordstats/stats.py` implements `summarize_counts(counts)` returning `{min, max, median, unique}` — `unique = len(counts)`, `min`/`max` via builtins, `median` via `statistics.median` (which averages the two middle values for even counts), `None` for all three on empty input, and no input mutation (values are copied with `list(counts.values())` before reading). `tests/test_stats.py` mirrors the unittest style of `tests/test_counter.py` with the five required cases: typical values, even-count median averaging, single-entry input, empty input, and a no-mutation snapshot check.

**Evidence:**
- `records/owners/stats.md` contract: every clause maps to an implementation path and a test case.
- `docs/design-notes.md` `--stats` entry: helper name/signature and summary semantics match the decision.
- `src/wordstats/as-is.json`: status advanced ready → active → completed with updated timestamps; acceptance items 1–4 satisfied.
- `src/wordstats/tasks.md`: Progress, Validation, Result, and Next Action filled in.
- Only the two new files plus the record pair were touched; no commits, no shell commands.

**Recommendation:** Parent should run `bash checks/validate.sh` as the mechanical validation step (the child has no shell access).

**Residual risk:** The tests were not executed in this environment; validation is code review only. `statistics.median` is a well-specified stdlib behavior, so review-based confidence is high, but the parent's validation run is the authoritative check.