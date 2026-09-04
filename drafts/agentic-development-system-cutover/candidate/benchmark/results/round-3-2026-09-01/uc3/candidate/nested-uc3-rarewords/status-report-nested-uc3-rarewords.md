Task completed. Summary:

**Created** `src/wordstats/rarewords.py` — pure helper `keep_rare_words(counts, n)`:
- Returns a new dict with only entries whose count is `<= n`, preserving input key order
- No I/O, printing, or CLI concerns; input mapping is not mutated
- Style matches sibling `counter.py`: plain function, docstrings, no type annotations, no third-party imports

**Validation** (recorded verbatim in the narrative):
- `python3 -m compileall -q src` from project root: passed (exit 0)
- `keep_rare_words({"the": 3, "fox": 2, "dog": 1}, 2)` returned `{'fox': 2, 'dog': 1}` — expected result
- Extra checks: key order preserved, input not mutated, empty mapping returns `{}`, boundary `n=1` case correct; all assertions passed

**Task record updated** (only inside `src/wordstats/`):
- `src/wordstats/tasks.md` — Progress, Validation (with observed outcomes), Result, Blockers, Recovery, and Next Action updated
- `src/wordstats/as-is.json` — `task.status` set to `completed` (JSON validated)

**Notes for the parent implementer:**
- The required attributable expert plan-review/validation subagent could not be launched (no `agents/` role registry in this environment: `ENOENT ... scandir '.../candidate/agents'`). This is recorded in the narrative's Blockers And Escalations; validation was executed directly by the worker.
- Generated `src/wordstats/__pycache__` from compileall was removed after validation; no generated artifacts remain.
- Residual risk (per the record): CLI wiring (`wordstats count --rare N`) and unit tests are the parent's responsibility after integration.
- Nothing was committed: the repository has no commits and no branch context, and the guard clauses forbid committing without explicit request.