# Task

## Requirement

Add a `--min-count N` option to `wordstats count` that omits words with fewer than N occurrences (N must be a positive integer; otherwise exit 2 with a clear message). Implement the option in `src/wordstats/cli.py` and put the filtering logic in a new helper module `src/wordstats/topwords.py`. Add unit tests for the option and its rejection behavior. The helper module is sized beyond one session's budget: implement it through a delegated child worker and record the delegation per the delegation contract (the child's component task record is the record of authority; the launcher registry is mechanical evidence only). Follow the design-note convention, keep the ownership-map discipline, run the checks, and report status.

## Plan

1. Setup (done): as-is adoption per `docs/as-is-setup-plan.md` (root `as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, owner records, map rows, design note recorded before implementation).
2. Prepare the child task pair at `src/wordstats/` and launch the leaf worker through the governed launcher (`--agent .../candidate/agents/worker/agent.md --cwd <this dir> --no-worktree --model z-ai/glm-5.3-flash`), forwarding a bounded budget (cost 0.60 USD, wall-clock 900 s) within this record's remaining allocation.
3. While or after the child works: implement the CLI option in `src/wordstats/cli.py` and CLI tests in `tests/test_cli.py` (parent-owned files).
4. Validate child output against the child record's acceptance; integrate; run `bash checks/validate.sh`.
5. Close the child record, then this record; summarize in `CHANGELOG.md`.

## Progress

- Setup complete: `as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, `records/owners/topwords.md`, `docs/as-is-setup-plan.md`, ownership-map rows, and the `--min-count` design note in `docs/design-notes.md`.
- 2026-08-30T23:20:00Z: task activated; child task pair prepared at `src/wordstats/as-is.json` + `src/wordstats/tasks.md`.
- Child launched through the governed launcher (blocking, `--no-worktree`, `--model z-ai/glm-5.3-flash`, budgets 900 s / 0.60 USD forwarded; launcher-reported child usage ≈ 0.0021 USD, well inside allocation; registry line retained as mechanical evidence only).
- Child terminal: `src/wordstats/as-is.json` status `completed`; its output (`src/wordstats/topwords.py`, `tests/test_topwords.py`) independently validated by the parent against `records/owners/topwords.md` before integration — contract match confirmed.
- Parent implemented `src/wordstats/cli.py` (`--min-count` with `positive_integer` argparse type) and `tests/test_cli.py`; descendant closure verified (single terminal child, no failed or cancelled descendants).

## Validation

`bash checks/validate.sh`: compile OK, 16 unit tests OK, CLI smoke check OK, "All checks passed.", exit 0. Manual CLI evidence: `count --min-count 2` filters correctly (exit 0); `--min-count 0` rejected with "error: argument --min-count: must be a positive integer" and exit 2. `git diff --check` clean. Residual risk: child record's `task.updated` (23:30:00Z) is ahead of the host clock by a few minutes — ordering evidence only, no effect on terminal status.

## Result

Completed 2026-08-30T23:20:45Z. All acceptance conditions evidenced: option implemented in `cli.py`, filtering in delegated child-built `topwords.py` (child record is the record of authority for the delegation), positive-integer rejection exits 2 with a clear message, focused unit tests for option/helper/rejection, design note recorded before implementation, ownership map covers all changed areas, all checks pass. No stop-for-direction was required; recorded assumptions: benchmark task text = human approval for setup decomposition and bounded change; child task-record filenames chosen by this acting task-management consumer. No commit was made (no explicit commit request in this turn; working tree left uncommitted by design of the benchmark arm).

## Blockers And Escalations

None. Assumptions: the benchmark task text is the human approval for setup decomposition and for this bounded change (no mid-run confirmation channel exists in this arm); child task-record filenames are set by this acting task-management consumer (`src/wordstats/as-is.json` + `src/wordstats/tasks.md`) per the protocol's placement rules; no commit was requested, so the validated working tree is left uncommitted.

## Recovery

If interrupted: reread this file and `as-is.json`; do not reset cumulative observations. Child state lives in the child record pair; launcher registry output is mechanical evidence only. Do not retry a failed launcher step more than the protocol allows; a failed step is a recorded result.

## Next Action

None; task terminal. See Result.