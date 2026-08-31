# Task

## Requirement

Implement the new helper module `src/wordstats/topwords.py` only: a `filter_min_counts(counts, min_count)` function that returns a new mapping containing only the entries of `counts` whose value is at least `min_count`, raising `ValueError` with a clear message when `min_count` is not a positive integer (zero, negative, or non-int). This is the delegated implementation slice of the parent `--min-count` task recorded at the project root; the parent owns CLI wiring, tests, integration, and validation.

## Plan

1. Child worker reads the bounded requirement and the existing `src/wordstats/` style (docstrings, plain functions, no third-party imports).
2. Child worker creates `src/wordstats/topwords.py` with the function, type checks, and module docstring.
3. Parent validates the returned module against the acceptance conditions and integrates.

### Changed-artifact boundary

| Category | Paths |
| --- | --- |
| Allowed | `src/wordstats/topwords.py` (create only) |
| Forbidden | everything else, including `cli.py`, `counter.py`, `tests/`, records, and checks |

## Progress

- 2026-08-30T23:17:23Z — Task pair created by the parent orchestrator; status `ready`; delegation admission checked against the parent allocation (child 0.5 USD / 900 s fits the parent remaining allocation after parent reserve).
- 2026-08-30T23:19:47Z — Child attempt launched through the governed launcher (`candidate/agents/worker/agent.md`, model `z-ai/glm-5.3-flash`, `--no-worktree`, budget 0.5 USD / 900 s; launcher job registry entry is mechanical evidence only, this record is the delegation authority). Child created `src/wordstats/topwords.py` only, per its changed-artifact boundary, and returned Finding/Evidence/Recommendation/Residual risk.

## Validation

Parent-side validation of the returned module (the worker has no shell tools, so its inspection-only claim was re-verified): `python3 -m compileall -q src` exit 0; behavioral spot checks exit 0 — filtering preserves keys/values and does not mutate input, threshold boundary kept, empty results for above-all and empty input, and `ValueError` with a clear message for 0, -1, 1.5, "3", None, True, False. Residual risk: low; the module is now also covered by `tests/test_topwords.py` added by the parent.

## Result

Completed. All four acceptance conditions observed as satisfied by direct parent-side evidence; child spent 0.0057 USD and 8 s against the 0.5 USD / 900 s allocation.

## Blockers And Escalations

None.

## Recovery

Last durable checkpoint: module created and validated. No incomplete work; no cleanup required.

## Next Action

None; parent integrates the validated module.