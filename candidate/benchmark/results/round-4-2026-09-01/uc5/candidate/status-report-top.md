## Status report

**Setup performed (as-is-setup skill, whole-project mode).** The seed ships no workflow configuration, so the prescribed adoption procedure (`/home/vc/dev/as-is/skills/as-is-setup/SKILL.md`, routing record structure through `managing-as-is-document`) was executed first. Its reviewable dry-run plan lives at `as-is-setup-plan.md` (working artifact, not part of canonical records). The durable setup records live at:

- `as-is.md` — root record (`# as-is - as-is`, lineage `**as-is**`, structural container view, `Components` table linking the child's `#design` section).
- `src/wordstats/as-is.md` — the only approved component candidate (`# wordstats - as-is`, count-pipeline view, owner-record link).
- `AGENTS.md` — created because no target-local instruction file exists; contains only the single canonical as-is instruction (verified present exactly once).

Candidate evidence: `src/wordstats/` has a distinct responsibility (counting logic + CLI contract) and an existing component-scoped owner record (`records/owners/core-utility.md`). `checks/`, `tests/`, `sample-data/`, `docs/`, `records/` were excluded as artifacts, not components. **Assumption:** the skill requires human confirmation of candidates; operating autonomously, I treated the explicit reviewable task request as the approval and recorded that treatment in the plan. Setup validation passed: headings correct, all record links resolve, Mermaid fences balanced, before/after `git status --porcelain` comparison shows exactly the four planned new paths and nothing else, `git diff --check` exit 0.

**Files changed:**
- Setup: `as-is-setup-plan.md`, `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md` (all new)
- Request item 1: `records/backlog.md` — two proposals appended in the file's modeled format (`--json` output flag for human-facing commands; CI lint job). Newest last; no work started.
- Request item 2: **no file changed** — stop-for-direction (below).

**Bounded-scope resolution:**
1. Backlog proposals — recorded as proposals only, per the file's own governance note ("Proposals only; selection and completion are governed by the project's planning procedure").
2. sample-data maintainer — **stop-for-direction, no write.** `records/owners/unassigned.md` states it "does not authorize changes; it only records that no owning record exists in the ownership map," and `records/ownership-map.md` has no `sample-data/` row. No record owns `records/` or the map, so no authority is resolvable to create an owner record or add a map row; the map itself directs unresolved areas to "stop for direction rather than guess." Designating a maintainer there would contradict the map, so both items were halted at the record boundary.

**Check results (verbatim, `bash checks/validate.sh`, exit code 0):**
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
validate-exit:0
```
Also: `git diff --check` exit 0.

**Unresolved questions:** (a) who owns `records/ownership-map.md` / the owners area and can authorize the sample-data owner record plus map row; (b) whether the benchmark task's standing request counts as the human approval the setup skill expects for the candidate decomposition (treated as yes, recorded as an assumption). Nothing was committed (repo has no initial commit; no commit was requested). No delegated agents were used; spend was kept to this session against the $2.00 / 3600 s arm budget.