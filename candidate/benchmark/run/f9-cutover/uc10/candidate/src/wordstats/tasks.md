# Task

## Requirement

Implement the new `src/wordstats/stats.py` module for the parent `--stats` feature. Produce a deterministic summary from the word-count mapping containing minimum count, maximum count, median count, and number of unique words. Work only in the assigned `src/wordstats/` component, do not delegate or commit, and stop/report if the child budget is exhausted.

## Plan

| Concern | Decision |
| --- | --- |
| Assigned scope | `src/wordstats/stats.py` only; parent owns CLI integration, tests, design note, and history. |
| Contract | Summary values are computed from mapping counts; median averages the two middle values when the number of words is even. |
| Budget | Maximum $0.05 and 180 seconds, with retained validation/handoff reserve in this record. |
| Worker | Configured `worker`; no substitution is permitted. |

## Progress

Ready for one governed bounded invocation.

## Validation

Pending child implementation and parent-side checks.

## Result

Pending.

## Blockers And Escalations

None at launch.

## Recovery

If budget stops the child, preserve the partial result and terminal status; parent may complete only the remaining in-scope work without re-rolling this child.

## Next Action

Await the configured worker's bounded invocation and terminal evidence.
