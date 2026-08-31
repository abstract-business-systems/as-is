# Task

## Requirement

Implement the bounded rare-word mapping helper in `src/wordstats/rarewords.py`.

## Plan

Add `filter_rare(counts, limit)` as one pure function returning a new mapping of entries whose counts are less than or equal to `limit`; keep validation, I/O, and CLI concerns in the parent component.

## Progress

Implemented only `src/wordstats/rarewords.py` within the protected write set. The required attributable expert plan review was attempted before editing but was unavailable because the current repository has no resolvable `agents/` directory (`ENOENT` from `call_subagent`). No descendants are authorized or required.

## Validation

- `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=src python3 -B` inline assertions passed (`rarewords helper checks: OK`, observed elapsed time 0.01 seconds): inclusive threshold boundary, exclusion above the threshold, empty input, zero threshold, fresh result, and input non-mutation.
- The initial `python` command could not run because this environment exposes `python3` only; the equivalent `python3 -B` check passed.
- Residual risk: no dedicated test file was added because tests are explicitly out of scope; parent review should run its integrated checks. The required final expert validation was also unavailable for the same unresolved-agent-path reason.

## Result


Blocked handoff: the helper implementation is complete and locally validated, but task completion cannot be claimed until an attributable expert plan/final-diff review is available. Shared parent worktree remains uncommitted; parent owns review and integration disposition.

Completed rarewords helper. Parent final-diff validation passed the <= threshold pure mapping behavior, and bash checks/validate.sh passed with 11 tests. The initial child expert gates were unavailable because the seed had no local agents directory; parent supplied attributable final validation. No separate integration was required because the child ran in the parent worktree with a disjoint write set; parent reviewed and owns the final scoped commit. No descendants.
## Blockers And Escalations

Required expert gates are unavailable: both `call_subagent` attempts failed with `ENOENT` while resolving `/home/vc/dev/as-is/candidate/benchmark/run/round-6/uc9/baseline/agents`. Per the component-builder contract, this is recorded as a blocker rather than skipped. Cost observation is unavailable; validation elapsed time is self-observed at 0.01 seconds in `as-is.json`.

## Recovery

Preserve `src/wordstats/rarewords.py` and this task pair. Parent should provide or resolve the configured read-only expert role, obtain plan and actual-diff validation, inspect that only the helper and this child evidence changed, then either mark the task completed after the gates pass or retain the blocker. Do not commit this shared-worktree handoff.

## Control Plane

- control-plane: {"checkpoint":"2026-08-31T22:19:55Z","event":"completion-result","result":"Completed rarewords helper. Parent final-diff validation passed the <= threshold pure mapping behavior, and bash checks/validate.sh passed with 11 tests. The initial child expert gates were unavailable because the seed had no local agents directory; parent supplied attributable final validation. No separate integration was required because the child ran in the parent worktree with a disjoint write set; parent reviewed and owns the final scoped commit. No descendants."}

## Next Action

Parent review: resolve the expert-agent path, rerun the required attributable reviews, and validate/integrate the helper without changing CLI, tests, design notes, parent records, or sibling files.
