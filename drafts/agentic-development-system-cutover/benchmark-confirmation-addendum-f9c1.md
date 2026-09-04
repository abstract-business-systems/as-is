# Benchmark confirmation run addendum (pre-registration F9-C1)

Status: registered addendum to `candidate/benchmark/pre-registration-f9.md` (same directory, moved). Scope, use cases, rubric, scorer, and safety gates are inherited unchanged from the F9 registration. Recorded 2026-09-04; execution is human-scheduled.

## Purpose

The F9 acceptance (candidate 23/27 vs baseline 22/27, all gates PASS) was measured before three post-benchmark harness deltas landed on the branch: the runtime re-home (`1f9c25e`), the bun-preferred pi runtime (`778d64b`), and the skills-tree flattening (this addendum's sibling work item). This confirmation run re-measures the **candidate arm only** on the final pre-merge tip so the merge gate binds to the artifact actually being merged.

## Design

- **Baseline arm: not re-run.** Master `9a77e37` is frozen; the recorded F9 baseline result (22/27, job `j-mtljav6l-b4ar7x`) remains the comparison target.
- **Candidate arm: one fresh run** on the flattened, post-re-home tip, using the same use cases (uc10), the same dedicated read-only scorer, the same scoring rubric, and the same six safety-gate items.
- **Script variant required at execution time**: the registered `f9-cutover/launch-arm.sh` predates the re-home and flatten (it references `skills/spawning-pi-subagents/...` and seeds via `find skills/reusable skills/master`). Execution uses a small `f9-confirm` variant of that script with updated paths; no other procedure element changes. The variant is committed before the run so the executed procedure is exactly what is recorded.
- **No-retry rule unchanged**: an upstream provider rate limit or budget stop is recorded as an environment observation, not retried or re-rolled.

## Acceptance

- Candidate ≥ 22/27 (the recorded baseline) AND all six safety-gate items PASS → F9 result confirmed on the merge tip; merge request proceeds.
- Candidate < 22/27 or any gate FAIL → merge is blocked; the regression is diagnosed before any merge request.

## Evidence disposition

Results land in `drafts/agentic-development-system-cutover/candidate/benchmark/results/` alongside the F9 round. Because the whole cutover folder drops at merge, a fresh evidence tag (superset of `adoption-evidence-full`) must be cut at the final pre-merge tip before the drop, so every dropped evidence artifact stays recoverable by tag + SHA.
