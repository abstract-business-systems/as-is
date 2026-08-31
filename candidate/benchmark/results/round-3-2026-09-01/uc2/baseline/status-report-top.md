# Status report

## Setup performed
Whole-project-mode **as-is-setup** (the setup my workflow prescribes for adopting it in an existing project), per `skills/as-is-setup`:
- Dry-run setup plan written **before** any writes: `.as-is/setup-plan.md` (mode, target, boundary, candidate evidence/confidence/dispositions, planned writes, excluded paths, diagram layout decisions).
- Created `AGENTS.md` (none existed) with the single canonical as-is architecture instruction (verified present exactly once).
- Created root record `as-is.md` (`# as-is - as-is`) with a `Components` table and structural-container Mermaid view.
- Created child record `src/wordstats/as-is.md` (`# wordstats - as-is`) with lineage line and count-flow view.
- Candidate map kept minimal (one component, `wordstats`); `checks/`, `docs/`, `records/`, `sample-data/` were evaluated and rejected as components with recorded reasons. Recorded assumption: the delegating benchmark request serves as the reviewable approval of this decomposition, since no interactive human is available in this arm.

## Files changed
- New: `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md`, `.as-is/setup-plan.md`
- Modified: `README.md` (only the `## Installation` section — `pip install wordstats-tools` replaced with the actual source-tree invocation `PYTHONPATH=src python3 -m wordstats.cli count <path-to-text-file>`), `docs/design-notes.md` (one note appended per the project's owner record `records/owners/design-notes.md`, which mandates a design note before user-visible README changes)
- Before/after path comparison confirms all writes are inside the working directory boundary; no other benchmark/use-case path touched. No commit made (repo has no initial commit and no git operations were requested).

## Check results (verbatim, exit codes)
`bash checks/validate.sh` — exit **0**:
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
```
As-is record validator (`validate-as-is-diagrams-and-navigation.ts`, source-level) — exit **0**: `{"records": 2, "diagrams": 2, "linkedDiagrams": 1, "issues": []}`. `git diff --check` — exit **0**.

## Bounded-scope resolution
- The request explicitly excluded component-task work, so no component task record was created; the fix was resolved directly through the project's own owner records (`README.md` → design-notes owner) rather than component delegation. No stop-for-direction was needed: the owner map resolves README ownership unambiguously, and the correct installation method is evidenced by the seed itself (source tree, no published package).
- Scope kept to the `## Installation` section plus the owner-mandated design note; no changelog entry, no other README sections touched.

## Residual risk / unresolved questions
- The README `## Setup note` paragraph now describes the seed as shipped ("contains no agent-workflow configuration") while the working copy does have setup records; I left it unchanged per "nothing else" — flagging in case the harness wants it updated.
- Diagram validation is source-level only (no local Mermaid renderer configured); the `Components` table provides the required fallback.
- No Mermaid render, no delegated subagents used (arm spend limited to this agent, well under the $2/3600 s caps); no git commit exists for the harness to diff, only the working tree.