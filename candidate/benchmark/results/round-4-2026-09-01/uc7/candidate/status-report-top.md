## Status report

**Setup performed (workflow adoption, per `as-is-setup` skill, whole-project mode)**

- Read the workflow's governing skills (`as-is-setup` → `managing-as-is-document`), produced a reviewable dry-run plan before any setup write, then created the minimal approved decomposition. The only component candidate with semantic evidence was **wordstats** (`src/wordstats/`: distinct responsibility, its own tests, and its own owner record in the seed's ownership map); `checks/`, `docs/`, `records/`, `sample-data/` were rejected as candidates and remain ordinary root content.
- Setup records live in: `as-is.md` (root record, structural container view + Components fallback), `src/wordstats/as-is.md` (component record, count-pipeline flow view, link to owner record), `AGENTS.md` (target instruction file with the canonical as-is instruction, exactly once), and `records/as-is-setup-plan.md` (the working setup plan: mode, boundary, candidate evidence, dispositions, planned writes, excluded paths, residual risk).
- Work was done directly (no delegation needed; nothing context-heavy), keeping arm spend minimal. A baseline commit of the untouched seed was made first so each requested change is a reviewable diff; then the setup commit. Only `.as-is/`, `.pi/`, and `__pycache__/` runtime artifacts remain untracked.

**Files changed**

- Setup: `as-is.md`, `src/wordstats/as-is.md`, `AGENTS.md`, `records/as-is-setup-plan.md` (commit `18f7dfd`)
- Change 1: `README.md` (Usage → `PYTHONPATH=src python -m wordstats.cli count sample-data/words.txt`), plus a design note in `docs/design-notes.md` (required by the README's owner record) and a changelog entry (commit `3aa407a`)
- Change 2: `tests/test_counter.py` (`test_internal_hyphens_are_kept_and_counted_as_one_word`) + changelog entry (commit `e2a63e2`)
- Change 3: `CHANGELOG.md` 1.0.0 entry corrected from "insertion-ordered JSON" to "alphabetically sorted JSON" (evidence: `sort_keys=True` in `src/wordstats/cli.py`, owner record, smoke fixture) + its own Unreleased entry (commit `6fe1d83`). The second 1.0.0 claim (validate.sh contents) was verified correct and left unchanged.

**Check results (verbatim, final tree)** — `bash checks/validate.sh`, exit `0`:

```
compile: OK
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_internal_hyphens_are_kept_and_counted_as_one_word (test_counter.CountWordsTests.test_internal_hyphens_are_kept_and_counted_as_one_word) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok

----------------------------------------------------------------------
Ran 5 tests in 0.000s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
```

`git diff --check` exit `0`. The old documented command was reproduced failing first (exit 1, "No module named wordstats.__main__") and the replacement verified working before the fix was committed.

**Bounded-scope resolution** — No stop-for-direction was needed. Material assumptions recorded: (1) the arm request was treated as the human-approved request authorizing the minimal single-component setup decomposition, with dispositions presented here for review; (2) the seed baseline was committed first so each requested change is a clean, isolated diff; (3) the changelog correction's "own changelog entry" is the corrected 1.0.0 line plus a new Unreleased entry recording the correction; (4) `docs/design-notes.md` got a note for change 1 because the README's owner record requires notes before user-visible documentation changes.

**Unresolved questions** — None blocking. Residual risks: Mermaid diagrams were validated at source level only (no renderer configured in this seed); the setup decomposition and the treated-as-approved assumption above are open for human review as follow-up bounded changes. No git push/branch/remote actions were taken; all commits are local on `master`.