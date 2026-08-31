## Status report

**Setup performed (workflow-prescribed adoption, per `as-is-setup`, whole-project mode).** The seed ships no agent-workflow configuration, so I adopted the as-is convention into the working directory before handling the request. A reviewable setup plan was written **before** any setup writes; its durable location is `docs/as-is-setup-plan.md` (mode, target, boundary, dispositions, candidate evidence, planned/excluded paths). Writes: created `as-is.md` (root record, `# wordstats - as-is`, single-component decomposition, one supplementary flow view) and `AGENTS.md` (contains the canonical as-is architecture instruction exactly once — verified by grep). A before/after `git status --porcelain` snapshot proves writes stayed inside the working directory (only `AGENTS.md` and `as-is.md` added; no parent or sibling path touched). No delegation was used (one-line edit; delegation would spend arm budget unnecessarily).

**Files changed (all inside the working directory):**
- `README.md` — `## Installation` section replaced: removed the false `pip install wordstats-tools` instruction; now states the actual way to run the tool (not published to PyPI, no packaging metadata; run from a checkout via `PYTHONPATH=src python3 -m wordstats.cli count <path-to-text-file>`, matching how `checks/validate.sh` invokes the CLI). Evidence for "actual way": no `pyproject.toml`/`setup.py` exists and validation exercises the module directly.
- `AGENTS.md`, `as-is.md`, `docs/as-is-setup-plan.md` — new, setup artifacts only.

**Check results (verbatim, exit codes):**
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
`bash checks/validate.sh` → exit 0. `git diff --check` → exit 0. Canonical instruction occurs exactly once in `AGENTS.md`. Mermaid view is source-checked only (no local renderer configured in the seed) — residual render risk recorded in the plan.

**Bounded scope resolution.** Non-component request; no component task was created. The request maps to a surgical docs edit; `README.md`'s owner per `records/ownership-map.md` is `records/owners/design-notes.md` (artifact scope), which owns no approval gate blocking this correction. No stop-for-direction was needed for the edit itself; the README change was the only change made for the request.

**Unresolved questions / recorded deviations:**
- `as-is-setup` normally asks for human confirmation of the component decomposition. Because the request authorized setup but disclaimed component work, I executed only the minimal null decomposition (single root record, no child records); finer decomposition (e.g., library vs CLI) is deferred and recorded in the plan for human review.
- The root record title uses the project's actual name (`wordstats - as-is`) rather than the generic `as-is` filler, per naming guidance; lineage is `**Lineage**: **wordstats**` (root record, no self-link).
- No commit was made (guard clause: no git history changes unless requested); all changes are uncommitted working-tree additions/modifications.
- No changelog entry was added — the request said "Nothing else."