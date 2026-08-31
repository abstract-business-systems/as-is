# Task

## Requirement

Adopt the as-is agent workflow in this seed project (no workflow configuration shipped by design), then add a `--min-count N` option to `wordstats count` that omits words with fewer than N occurrences (N must be a positive integer; otherwise exit 2 with a clear message). Implement the option in `src/wordstats/cli.py`, put the filtering logic in a new helper module `src/wordstats/topwords.py`, and add unit tests for the option and its rejection behavior. The helper module is implemented through a delegated child worker recorded per the delegation contract.

## Plan

1. Adopt the workflow: root and component `as-is.md` records, task-record pair per component (`as-is.json` `task` object + `tasks.md` narrative), component changelog, ownership-map rows for newly planned artifacts, and the design note that authorizes the user-visible change.
2. Delegate `src/wordstats/topwords.py` to a child `worker` through the governed launcher with an explicit bounded task record (`src/wordstats/as-is.json` + `src/wordstats/tasks.md`), child budget 0.5 USD / 900 s within the parent allocation.
3. Integrate the child result: wire `--min-count` into `src/wordstats/cli.py` (positive-integer validation, exit 2 with clear message) and add unit tests for the option and its rejection behavior.
4. Run `bash checks/validate.sh`; record verbatim evidence; update task records and changelogs; prepare the completion handoff.

### Changed-artifact set

| Category | Paths |
| --- | --- |
| Workflow adoption records | `as-is.md`, `as-is.json`, `tasks.md`, `records/ownership-map.md`, `docs/design-notes.md` |
| Child component records | `src/wordstats/as-is.md`, `src/wordstats/as-is.json`, `src/wordstats/tasks.md`, `src/wordstats/changelog.md` |
| Child-implemented module | `src/wordstats/topwords.py` |
| Parent-integrated CLI and tests | `src/wordstats/cli.py`, `tests/test_topwords.py`, `tests/test_cli.py` |

## Progress

- 2026-08-30T23:17:23Z — Baseline `bash checks/validate.sh` exit 0 (compile OK, 4 unit tests OK, CLI smoke OK). Workflow adoption records created; ownership-map rows added for `src/wordstats/topwords.py` and `tests/` (resolved from the explicit user request naming those artifacts; owner `records/owners/core-utility.md` because both extend the owned count CLI surface and its unit coverage). Design note recorded in `docs/design-notes.md` before the behavior change, per the owner record convention.
- 2026-08-30T23:18:34Z — Delegated the helper module to a child `worker` through the governed launcher (job registry entry is mechanical evidence; the child component task record `src/wordstats/as-is.json` + `src/wordstats/tasks.md` is the record of authority). Budget forwarded: 0.5 USD / 900 s within the parent allocation.
- 2026-08-30T23:19:47Z — Child returned and was independently validated (compile + behavioral spot checks, exit 0). Parent integration completed: `--min-count` wired into `cli.py` (positive-integer enforcement via the helper's `ValueError` mapped to `parser.error`, exit 2 with a clear message; non-integer input rejected by argparse with exit 2), unit tests added in `tests/test_topwords.py` and `tests/test_cli.py`. One validation iteration: the initial CLI test over-specified the non-integer rejection message; corrected to assert exit 2 plus argparse's clear `invalid int value` message.

## Validation

- Baseline `bash checks/validate.sh`: exit 0 (compile OK, 4 unit tests OK, CLI smoke OK).
- After the change, `bash checks/validate.sh`: exit 0 — compile: OK; 20 unit tests OK (4 existing counter, 10 topwords, 6 CLI); cli smoke check: OK; "All checks passed."
- Direct CLI observation: `count --min-count 2 sample-data/words.txt` exit 0 printing filtered JSON `{"fox": 2, "the": 3}`; `count --min-count 0` exit 2 with `wordstats: error: min_count must be a positive integer, got 0`.
- Acceptance-to-evidence matrix: option filtering — passed (CLI observation + `test_cli` filtering cases); exit-2 rejection with clear message — passed (CLI observation + `test_cli` rejection cases + `test_topwords` rejection cases); helper module via delegated child — passed (child task record + parent-side re-validation); unit tests — passed (20 tests); validate.sh — passed (exit 0).
- Residual risk: low. `--min-count` with a non-integer relies on argparse's standard exit-2 behavior rather than the helper's wording; bool rejection is enforced at the helper level but is unreachable via argparse. No commit has been made; the working tree is the sole evidence location.

## Result

Completed. All five acceptance conditions observed as satisfied. Descendant accounting: the single delegated child task (`src/wordstats`) is terminal at `completed` with spent 0.0057 USD / 8 s; no failed or cancelled descendants.

## Blockers And Escalations

None. Scoped commit handoff intentionally not executed: the repository has no initial commit and the user did not request commits this turn (repository guard clause); changes are left uncommitted for the user.

## Recovery

Last durable checkpoint: all checks green and all task records closed at 2026-08-30T23:19:47Z. No incomplete work; no cleanup required.

## Next Action

None; status reported to the user.