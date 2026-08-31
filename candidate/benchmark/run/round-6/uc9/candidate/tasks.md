# Task

## Requirement

Implement the two independent `wordstats count` filtering options from the user request: `--rare N` with `src/wordstats/rarewords.py`, and `--top N` with `src/wordstats/topwords.py`. Each helper is a separately delegated child component with its own task pair and both children must be live concurrently.

## Plan

Adopt the as-is records convention, record the design decision, prepare independent child task pairs, launch both children concurrently, review their returned evidence, integrate the CLI and tests in the parent scope, and run the deterministic validation.

## Progress

Setup records were created first. `rarewords-child` and `topwords-child` were launched concurrently at 2026-08-31T22:10:43Z with separate 900-second and $1.20 child budgets. Both child task records reached `completed`; the launcher observed exit 0 for both, with no separate commit because both used the authorized shared caller worktree. The parent then integrated CLI wiring and focused tests without changing either helper module.

## Validation

`PYTHONPATH=src python3 -m unittest discover -s tests -v` passed with 8 tests. Manual CLI checks passed for `--rare`, `--top`, and invalid `--top 0` (exit 2 with `N must be a positive integer`). Required `bash checks/validate.sh` passed; its exact output and exit code are reported in the final status. `git diff --check` passed. Child automated execution was unavailable, so parent validation is the acceptance evidence.

## Result

Implemented both independent filters, positive-integer CLI validation, composition, focused tests, setup records, and the design-note/changelog updates. Child records remain available as bounded task evidence.

## Blockers And Escalations

None. The launcher reported generic incomplete handoff metadata because shared-worktree children did not create commits and did not run the parent suite; this is explicitly resolved as no separate integration required, with parent-owned validation complete.

## Recovery

Completion checkpoint: both child task pairs are terminal and their helper files are present; parent CLI/tests and records are validated. Preserve the current working tree and all task evidence. No retry or recovery launch is authorized or needed.

## Next Action

Report the scoped result and validation evidence; any later commit or cleanup is outside this request.
