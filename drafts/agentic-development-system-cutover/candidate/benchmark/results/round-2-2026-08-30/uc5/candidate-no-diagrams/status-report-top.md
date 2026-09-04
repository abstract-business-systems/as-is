All validation passes. Final status report:

---

## Status report

### 1. Setup performed

Used the canonical **`as-is-setup`** skill (`/home/vc/dev/as-is/skills/as-is-setup/SKILL.md`) in **whole-project mode**, with the record contract from `managing-as-is-document`. No agent-workflow configuration existed in the seed by design, so setup created it:

- **Reviewable setup plan** (working artifact, kept out of the project and out of the records): `/tmp/uc5-as-is-setup-plan.md` — records mode, target, effective boundary, instruction-path disposition, root record, candidate evidence, planned writes, and excluded paths.
- **Candidate decomposition**: one component, `wordstats` (library + CLI in `src/wordstats/`), on semantic evidence (distinct responsibility, stable public contract already documented in `records/owners/core-utility.md`, own tests/smoke check). Rejected: `sample-data/`, `docs/`, `records/`, `tests/`, `checks/` (no independent responsibility/authority boundary).
- **Authorization assumption recorded**: the benchmark arm's explicit instruction to "perform the setup your workflow prescribes" was treated as the human-approved request; the skill's per-candidate human-confirmation step was satisfied by that explicit instruction rather than a separate interactive approval. No stop-and-escalate trigger applied (single unambiguous decomposition).

Setup records live in the working directory:
- `as-is.md` — root record (`# as-is - as-is`, root lineage, structural-container view, one linked child)
- `src/wordstats/as-is.md` — component record (`# wordstats - as-is`, lineage line, count-flow view, contract facts, link to the normative owner record)
- `AGENTS.md` — target-local instruction file created with the canonical as-is instruction (exactly once; enclosing repo `AGENTS.md` untouched)

### 2. Files changed
- `as-is.md` (new — setup)
- `src/wordstats/as-is.md` (new — setup)
- `AGENTS.md` (new — setup)
- `records/backlog.md` (request 1: three one-line proposals appended, newest last, matching the modeled format; no work started)
- `/tmp/uc5-as-is-setup-plan.md` (setup working artifact, outside the project)

### 3. Bounded-scope resolution
- **Request 1 (backlog proposals): done.** Added to `records/backlog.md` as proposals only — `--format` output option, stdin input, rename `count` to `tally`. No implementation started, per the request and the file's "proposals only" rule.
- **Request 2 (unassigned.md update): stopped for direction.** The records do not authorize this change: `records/ownership-map.md` has no row for `sample-data/` and explicitly instructs that a consumer who cannot resolve an owner or scope from these records "should stop for direction rather than guess"; `records/owners/unassigned.md` states it "does not authorize changes; it only records that no owning record exists in the ownership map"; and no record covers editing `records/` at all, nor names the new maintainer. Editing `unassigned.md` to assert a maintainer would require (a) the maintainer's identity/record and (b) direction that the ownership map may gain a `sample-data/` row — both left to you.

### 4. Check results (verbatim)
`bash checks/validate.sh` — **exit code 0**:
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
Setup validation: `git diff --check` clean (exit 0); record headings correct (`# as-is - as-is`, `# wordstats - as-is`); canonical instruction present exactly once; all record links resolve relative to their owning file; before/after `git status --porcelain` confirms writes only inside the boundary (`AGENTS.md`, `as-is.md`, `src/`, `records/`). No local Mermaid renderer is configured, so diagrams received a source-level syntax check only (residual risk: unrendered).

### 5. Unresolved questions
1. **Request 2 needs direction**: who is the sample-data maintainer (name/record), and confirmation that a `sample-data/` row may be added to `records/ownership-map.md` and `unassigned.md` updated accordingly.
2. No commit was made (no commit requested; working tree remains untracked-by-design on the seed's initial state).
3. Minor assumption stands: the skill's human-confirmation step for setup candidates was satisfied by your explicit setup instruction rather than an interactive approval — flag if you want the candidate decomposition (`wordstats` as the single component) revisited.