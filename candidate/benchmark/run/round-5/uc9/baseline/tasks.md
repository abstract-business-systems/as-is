# Task

## Requirement

Adopt the as-is workflow in the seed project (setup), then deliver two independent bounded component changes via two concurrent delegated child workers: `--rare N` (filter module `src/wordstats/rarewords.py`) and `--top N` (filter module `src/wordstats/topwords.py`) for `wordstats count`, both validating N as a positive integer with exit 2 otherwise; integrate, test, run checks, and report status.

## Plan (includes the as-is setup dry-run plan)

Setup plan (whole-project mode): target `/home/vc/dev/as-is/candidate/benchmark/run/round-5/uc9/baseline`; effective boundary = this project root and its descendants; instruction path = newly created `AGENTS.md` (no instruction file existed); root record = newly created `as-is.md`; planned writes: `as-is.md`, `AGENTS.md`, `src/wordstats/as-is.md`, `records/components/rarewords/{as-is.md,as-is.json,tasks.md}`, `records/components/topwords/{as-is.md,as-is.json,tasks.md}`, `.gitignore`; excluded paths: everything outside the working directory, including parent and sibling benchmark directories. Component candidates from semantic evidence: wordstats-core (library+CLI, existing owner record), rarewords and topwords (distinct responsibilities authorized by the request). Human approval is supplied by the benchmark request itself, which mandates exactly this decomposition.

Execution plan: (1) commit pristine seed baseline; (2) write setup records; (3) expert plan review; (4) launch both children concurrently with `--detach --no-worktree --model z-ai/glm-5.3-flash`, each bounded to its own module + tests + its own task record, no commits, no CLI edits (prevents concurrent writes to shared files); (5) parent integrates both modules into `cli.py`, adds CLI-level validation (positive integer, exit 2) and unit tests, updates design notes, ownership map, changelog; (6) run `bash checks/validate.sh`; (7) expert final validation; (8) record no-separate-integration disposition (children run in the parent-owned worktree), close descendants, commit scoped work.

## Progress

- 2026-09-01: Seed baseline committed (d609f84). Setup records written; parent task active.
- 2026-09-01: Expert plan review attempted via in-process expert role; worker completed without a text report (recorded result, not retried). Plan gaps self-checked instead.
- 2026-09-01T20:40Z: Both children launched concurrently under the governed launcher (j-mthpde8a-t4g0me rarewords, j-mthpde8g-h6b403 topwords; --detach, --no-worktree, model z-ai/glm-5.3-flash, budget 1500s/$0.5 each); both live simultaneously, exited 0 (46.3s / 35.6s), no commits, no integration needed (parent-owned worktree).
- 2026-09-01: Integrated both modules into `src/wordstats/cli.py` (`--rare N`, `--top N`, `positive_int` validation, exit 2); added `tests/test_cli.py`; updated design notes, ownership map, changelog, root as-is.md.
- 2026-09-01: Final expert validation attempted via in-process expert role; again returned no text report (recorded). Substituted deterministic evidence: `bash checks/validate.sh` exit 0 (compile, 24 unit tests, CLI smoke), end-to-end exit-2 checks for `--top 0` and `--rare abc`, tie-break and boundary spot checks, `git diff --check` clean, record link resolution verified.

## Validation

- Baseline: `bash checks/validate.sh` exit 0 (compile OK, 4 tests OK, smoke OK) before any change.
- Final: `bash checks/validate.sh` exit 0 — compile: OK; 24 unit tests OK (counter, rarewords, topwords, CLI incl. rejection tests); cli smoke check: OK; "All checks passed."
- End-to-end: `count sample-data/words.txt --top 0` → exit 2 with "N must be a positive integer, got 0"; `--rare abc` → exit 2; `--rare 2` → exit 0 with filtered JSON.
- Child-run validation recorded in each child record (5 tests each, scope audits, validate.sh exit 0).
- Residual risk: the two in-process expert review/validation calls returned no text report, so no independent expert sign-off exists; deterministic checks and direct review substitute. Cost is self-limited (launcher-unobservable); actual spend not host-observable.

## Result

Completed. Both bounded child components (rarewords, topwords) are terminal `completed` with recorded evidence and zero descendants; both ran concurrently (overlapping liveness between 2026-09-01T20:40:38Z and their exits). Integration performed by the parent in its own worktree: explicit `no-separate-integration` disposition (no isolated child commits existed to cherry-pick; children were instructed not to commit). All acceptance conditions in the root `as-is.json` are satisfied; both features validated end to end; no stop-for-direction was required.

## Blockers And Escalations

(none)

## Recovery

Last durable checkpoint: baseline commit d609f84 plus uncommitted setup records. Next safe action on failure: re-run `bash checks/validate.sh`; child work is recoverable from child records and the working tree.

## Next Action

None. Commit scoped completed work (parent-owned integration commit; no separate child integration commit required).