## Status report

**Setup performed (workflow adoption)**
- Followed the as-is workflow's `as-is-setup` skill in **whole-project mode**, target = the arm working directory, boundary = that directory and descendants only.
- Produced the reviewable setup plan first, then wrote only the planned files: root `as-is.md` record (`# wordstats - as-is`, root-only with a `count` command flow Mermaid view), root `AGENTS.md` containing the canonical as-is architecture instruction exactly once, and the working plan artifact.
- Setup records live at: `as-is.md`, `AGENTS.md`, `docs/as-is-setup-plan.md`.
- Decomposition decision: root-only record, no child components. Splitting out `src/wordstats` as a child was evaluated and **deferred** (a fixture with one library has no meaningful second component boundary; the skill's stop-and-escalate rule forbids silently choosing a multi-component boundary, and no human confirmation channel exists mid-arm). This is recorded in the setup plan and reported as a residual item.

**Scope resolution of the request**
- README.md is owned by `records/owners/design-notes.md`; the owner record requires a design note only for changes altering user-visible behavior — a documentation correction alters none, so no note was added.
- Classification: non-component wording/correction change; no component task record created, per the verbatim request.
- Files changed:
  - `README.md` (modified): usage example `python -m wordstats sample-data/words.txt` → `PYTHONPATH=src python3 -m wordstats.cli count sample-data/words.txt`. The old command cannot work: the package has no `__main__.py`, and the CLI is `wordstats.cli` with a required `count` subcommand (confirmed from `src/wordstats/cli.py`).
  - `as-is.md`, `AGENTS.md`, `docs/as-is-setup-plan.md` (new, setup).
- No delegation was used (single-file doc fix; delegating would only add cost). No stop-for-direction was needed for the fix itself.

**Check results (verbatim, exit codes)**
`bash checks/validate.sh` — **exit 0**:
```
compile: OK
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.000s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
EXIT=0
```
Additional verification: the exact corrected README command was run standalone and produced the expected JSON (`EXIT=0`); `git diff --check` exit 0; `grep -c` confirms the canonical instruction appears exactly once in `AGENTS.md`; all record links resolve; `git status` shows changed/new paths only inside the working directory (boundary proof). Budget: well under caps (no subagent spend, ~minutes of wall clock).

**Unresolved questions / residual risks**
1. Child-component decomposition (e.g., a `wordstats` component record under `src/wordstats/`) was deferred pending human approval of a multi-component boundary; current record is root-only.
2. The Mermaid diagram in `as-is.md` was validated at source level only — no local Mermaid renderer exists in the seed (noted in the setup plan; non-critical supplementary view).
3. No commit was made: the repo has no initial commit and the arm instructions don't authorize commits; all changes remain in the working tree.