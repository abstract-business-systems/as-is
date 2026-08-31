# Task

## Requirement

Implement the helper module `src/wordstats/rarewords.py` for the bounded component `src/wordstats/`. It must expose a pure function that, given a word-count mapping (as produced by `wordstats.counter.count_words`) and a positive integer `n`, returns a new mapping containing only the entries whose count is less than or equal to `n`, preserving the input's key order. The function must not perform I/O or printing; the caller (`wordstats count --rare N`, implemented separately by the parent) applies it to CLI output. Choose the narrowest clear function name for "keep rare words up to n occurrences". Rationale for delegation and the full task context: this helper was sized beyond one session's budget, so the parent implementer delegated only this module; the parent separately wires the CLI option and tests.

## Plan

1. Read `counter.py` and the owner contract in `../../records/owners/core-utility.md` for the count-mapping shape.
2. Create `rarewords.py` with the helper and a docstring; match the existing code style (plain functions, docstrings, no type annotations, no third-party imports).
3. Validate per the Validation section below.
4. Update this narrative's Progress, Validation, and Result sections and set the JSON companion `task.status` to `completed`.

## Progress

- 2026-08-31: task record created by parent implementer; no work started yet.
- 2026-08-31: `src/wordstats/rarewords.py` created with `keep_rare_words(counts, n)`; validation passed (see Validation); task completed. Note: the attributable expert plan-review subagent could not be launched (no `agents/` role registry is present in this environment), so the plan was executed directly from the task record; the failure is recorded under Blockers And Escalations.

## Validation

Smallest relevant check: `python3 -m compileall -q src` from the project root must pass, and a direct call of the helper on a sample mapping (e.g. `{"the": 3, "fox": 2, "dog": 1}` with `n=2`) must return `{"fox": 2, "dog": 1}`. Record the observed outcome verbatim. Residual risk: the CLI wiring and unit tests are implemented and validated by the parent after integration, so this record covers the helper module only.

Observed outcome (2026-08-31):

- `python3 -m compileall -q src` from the project root: passed (no output, exit 0); the generated `src/wordstats/__pycache__` was removed after validation as a generated artifact.
- Direct invocation: `keep_rare_words({"the": 3, "fox": 2, "dog": 1}, 2)` returned `{'fox': 2, 'dog': 1}` (observed verbatim).
- Additional direct checks: result preserves input key order (`['fox', 'dog']`); the input mapping is not mutated; `keep_rare_words({}, 5)` returns `{}`; boundary `keep_rare_words({'a': 1}, 1)` returns `{'a': 1}`. All assertions passed.

Residual risk remains as stated above: CLI wiring and unit tests are the parent's responsibility after integration.

## Result

Completed 2026-08-31. `src/wordstats/rarewords.py` exposes `keep_rare_words(counts, n)`: a pure function returning a new dict with only the entries whose count is <= n, preserving input key order; no I/O or printing; style matches `counter.py` (plain function, docstrings, no type annotations, no third-party imports). Validation passed as recorded above. Only files inside `src/wordstats/` were modified (`rarewords.py` added; `tasks.md` and `as-is.json` updated as the task record).

## Blockers And Escalations

- 2026-08-31: required attributable expert plan review could not be obtained: the in-process expert subagent failed with `ENOENT: no such file or directory, scandir '.../candidate/agents'` (no agent role registry exists in this environment). No delegation-authorization or budget decision was needed, so the blocker did not stop the bounded, fully specified implementation; recorded here for parent reconciliation. Expert final validation of the diff was likewise unavailable; the recorded Validation checks were executed directly by the worker.

## Recovery

Last durable checkpoint: helper implemented and validated; task record updated to completed. Incomplete work: none in this component. Cleanup required: none (`__pycache__` removed after validation). Next safe action: parent implementer integrates the helper, wires the CLI option and tests, and validates the integrated result.

## Next Action

(none; task completed, awaiting parent integration)