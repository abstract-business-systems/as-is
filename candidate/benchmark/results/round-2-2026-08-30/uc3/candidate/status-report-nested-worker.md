Task complete. All work stayed within the changed-artifact boundary.

**Finding**
- `src/wordstats/topwords.py` created implementing `filter_min_count(counts, min_count)` exactly per `records/owners/topwords.md`: dict comprehension over `counts.items()` with `count >= min_count`, no mutation of input, key order preserved (dict insertion order).
- `tests/test_topwords.py` created with six focused unittest-style tests mirroring `tests/test_counter.py`: above-threshold, at-threshold, empty result, empty input, input-not-mutated, key-order-preserved.
- Record pair advanced: `src/wordstats/as-is.json` status ready -> active -> completed (`task.updated` refreshed), `src/wordstats/tasks.md` Progress/Validation/Result/Next Action filled with progress and validation evidence.

**Evidence**
- Contract source: `records/owners/topwords.md` and the `--min-count` decision in `docs/design-notes.md` (count >= N, unmutated input, key order preserved) — both match the implementation verbatim.
- Style conformance reviewed against `src/wordstats/counter.py` and `tests/test_counter.py` (docstrings, unittest layout, `__main__` guard).
- Files written: `src/wordstats/topwords.py` (377 B), `tests/test_topwords.py` (1,124 B); no other artifact edited; no commits, no delegation, no shell invocation.

**Recommendation**
- Parent should run `bash checks/validate.sh` after integration as planned; the helper is ready for the CLI to call it in the `count --min-count N` path.

**Residual risk**
- Unit tests were verified by inspection, not executed (leaf worker has no shell access per the record); a syntax or import error would only surface at the parent's validation run — likelihood low given the small surface and style match.