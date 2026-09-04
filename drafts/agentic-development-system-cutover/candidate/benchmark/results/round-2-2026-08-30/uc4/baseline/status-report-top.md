# Status report

## 1. Setup performed and where its records live

Performed the `as-is-setup` skill (whole-project mode) to adopt the as-is workflow in the seed, which ships no agent-workflow configuration by design:

- **Reviewable setup plan (recorded before any writes):** `records/as-is-setup-plan.md` — mode (whole-project), target, effective boundary, instruction/root-record dispositions, candidate evidence table, planned writes, diagram layout plans, excluded paths, plus the three expert-review amendments.
- **Root record:** `as-is.md` (`# as-is - as-is`, structural-container diagram, Components table).
- **Component record:** `src/wordstats/as-is.md` (`# wordstats - as-is`, count-pipeline flow view, Links to the owner contract).
- **Instruction file:** `AGENTS.md` created (none existed); contains the canonical as-is architecture instruction exactly once.
- **Workflow plumbing:** an untracked `agents` symlink to the canonical role directory was added because `call_subagent` resolves roles relative to the working directory (first expert call failed with `ENOENT .../baseline/agents`; the role directory was then wired in). Not part of the commit.
- **Decomposition:** one candidate component, `wordstats` (library + CLI, own owner record, own tests); `tests/`, `checks/`, `docs/`, `records/`, `sample-data/` excluded as non-components. Expert review confirmed this as defensible.

## 2. Files changed

New: `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md`, `records/as-is-setup-plan.md`, `docs/pipeline.md`. Modified: `README.md` (one contents bullet), `CHANGELOG.md` (Unreleased section). No code or test changes. All in the scoped commit `d87165a` (root commit, 7 files, 192 insertions — insertions count whole files because no prior commit existed). Seed files outside the handoff remain untracked by design.

## 3. Check results (verbatim, exit codes)

`bash checks/validate.sh` — **EXIT=0**:
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
As-is source-level validator — **EXIT=0**: `{"records": 2, "diagrams": 2, "linkedDiagrams": 1, "issues": []}`. `git diff --check` — **EXIT=0**. Post-commit re-run of `checks/validate.sh` — EXIT=0. Path-snapshot before/after diff proves only in-boundary paths changed.

## 4. Bounded scope resolution

- **Ownership gap:** `docs/pipeline.md` and `CHANGELOG.md` had no owner record; `records/ownership-map.md` says unresolvable scope should stop for direction. Resolved without stopping because the verbatim human request named the exact path and content — the expert review concurred this resolves the gap (no silent guessing involved).
- **No design-notes entry:** the change alters no user-visible runtime behavior, so the project-docs owner's "record before bounded behavior changes" rule was not triggered.
- **Required expert gates:** plan review returned **FAIL** (runnable validator command missing; punctuation wording overstated; link/heading targets unspecified) — all three amendments were applied to the plan before edits. Final-diff validation returned **PASS**, "Safe to commit: Yes". Only after PASS was the single scoped commit created.
- **No delegation:** no descendant component with its own `as-is.md` existed, so all work was same-component (in-process); the governed launcher was not needed, and no child integration was owed.

## 5. Unresolved questions / residual risk

- The `agents` symlink and `.as-is/`, `.pi/` harness state are untracked runtime/plumbing; if the benchmark harness snapshots git state only, the symlink is not preserved (workflow role resolution would need re-wiring in a fresh clone).
- Diagram validation is source-level only; no local Mermaid renderer exists in this host, so rendered-output correctness is residual risk (syntax validated source-level, zero issues).
- Because the repo had no initial commit, seed files remain untracked; I committed only the declared handoff per the scoped-commit rule rather than committing the seed wholesale.