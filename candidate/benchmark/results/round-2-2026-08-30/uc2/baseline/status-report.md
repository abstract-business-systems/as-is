All checks pass. Final status report:

## Status report — round-2 UC2 baseline arm

**Setup performed** (per `integrate-as-is-documentation`, which composes `as-is-setup` + `managing-as-is-document`; whole-project mode, target = working dir root):
- **Reviewable setup plan**: presented and executed as stated above (mode, boundary, candidates with evidence, planned writes, one host-constrained diagram layout plan, excluded paths). The benchmark task instruction was treated as the standing human approval for setup; no interactive confirmation channel exists in this arm — recorded as an assumption.
- **Records created**:
  - `as-is.md` — root record (`# wordstats - as-is`), setup-root Lineage, container diagram with linked child box, Components table with Markdown fallback, Links to the validation entry point and ownership map.
  - `src/wordstats/as-is.md` — accepted component **word-count** (`# word-count - as-is`), own Lineage, count-pipeline diagram, public contract.
  - `AGENTS.md` — new target-local instruction file with the canonical as-is instruction line exactly once (seed had no target-local instruction file).
- Rejected candidates (no record): `tests/`, `checks/`, `sample-data/`, `records/`, `docs/`, `.pi/` — supporting fixtures without independent reader-facing responsibility evidence. Runtime state (`.as-is/`, `.pi/`) untouched.

**Files changed for the request** (verbatim scope: usage example only, no component task record created):
- `README.md` — usage example changed from `python -m wordstats sample-data/words.txt` to `python -m wordstats.cli count sample-data/words.txt`. Nothing else in the file or repo was modified for the request.

**Bounded-scope resolution**: No stop-for-direction needed. The request explicitly declared this non-component work and forbade a component task record, so the component-task lifecycle (task record, delegation, child integration) was not invoked; all work was same-component in-process with no subagent launches (also keeping arm spend ≈ $0 of the $2 cap and well under the 3600 s wall clock). Correctness of the fix was evidenced both ways: the old command fails (`No module named wordstats.__main__ ... cannot be directly executed`, exit 1) and the new command succeeds with output identical to `checks/expected-count.json` (exit 0).

**Check results** (`bash checks/validate.sh`):
```
compile: OK
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_counts...) — see above: ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.000s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
```
Exit code: **0**. Also `git diff --check` exit 0 (no whitespace/conflict-marker issues).

**Residual risk / unresolved questions**:
- The repo has no initial commit; per the request's "Nothing else — run the checks and report status," I did not commit. If the harness expects a durable git commit, that is one step remaining.
- Mermaid `click` links in the as-is records may be suppressed by some renderers; the Components table is the required Markdown fallback, so navigation is preserved either way.
- The README "Setup note" still says the project contains no agent-workflow configuration; updating it was outside the verbatim request scope and was deliberately not done.