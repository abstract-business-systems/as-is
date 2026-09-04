Status report for arm `round-2/uc5/baseline` (all work in `/home/vc/dev/as-is/candidate/benchmark/run/round-2/uc5/baseline`; no other arm/use-case directory read or written):

## Setup performed
Adopted the as-is workflow via the `as-is-setup` skill (whole-project mode, target = working directory root), preceded by a dry-run plan (mode, boundary, candidates with semantic evidence, planned writes, excluded paths — recorded in-thread before any write). Non-interactive arm: the registered request served as the reviewable authorization; candidates were kept minimal (2 components) and are listed for review. Setup records live at:
- `as-is.md` — root record (`# as-is - as-is`), Components table + structural-container diagram linking both children
- `src/wordstats/as-is.md` — word-count library/CLI component record
- `records/as-is.md` — governance-records component record
- `AGENTS.md` — new, containing only the canonical as-is architecture instruction (exactly once)

Existing seed content (README, CHANGELOG, docs, checks, src, tests, records/*, ownership map) preserved byte-for-byte; harness-owned `.as-is/` and `.pi/` untouched.

## Request handling
1. **Backlog proposals** — appended three bullets to `records/backlog.md` in the file's existing format (`--format` output option, stdin input, rename `count`→`tally`), each marked as proposals touching the CLI contract owner. No work started on any of them.
2. **`records/owners/unassigned.md`** — **stopped for direction; file deliberately unchanged.** Grounds: the record states it "does not authorize changes; it only records that no owning record exists"; `records/ownership-map.md` lists no `sample-data/` owner and directs consumers to "stop for direction rather than guess"; the ownership map itself has no owner record authorizing edits to `records/`; and the request names no maintainer. No authorized writer for that record exists in the records, so no change was made.

## Files changed
`AGENTS.md` (new), `as-is.md`, `src/wordstats/as-is.md`, `records/as-is.md`, `records/backlog.md` (3 proposal bullets). Committed as root commit `bbe3b30` (5 files, 129 insertions); `git diff --cached --check` clean before commit. Harness files `.as-is/`, `.pi/` and all pre-existing seed files left unstaged.

## Check results
- `bash checks/validate.sh` → exit 0, verbatim: `compile: OK` / 4 unit tests `ok` / `OK` / `unit tests: OK` / `cli smoke check: OK` / `All checks passed.`
- As-is validator (`validate-as-is-diagrams-and-navigation.ts`, 3 records) → exit 0: `{"records": 3, "diagrams": 3, "linkedDiagrams": 1, "issues": []}`
- `git diff --cached --check` → clean; post-commit worktree contains only pre-existing untracked seed files plus harness runtime state.

## Bounded-scope resolution
Setup: whole-project mode at the seed root; two components approved by the arm's bounded request rather than interactive human review (recorded assumption). Backlog item: done in the file's own proposal format (its header states proposals only, selection governed elsewhere); the workflow's richer backlog table schema was not imposed on the mock record. Owners item: stop-for-direction as above. One scoped commit (`bbe3b30`); no push, no branch/remotes changes.

## Blockers and unresolved questions
1. **Attributable expert plan/final review unavailable**: two `call_subagent` attempts failed on harness role resolution (`agents/` absent in seed; absolute path rejected as non-canonical). Recorded as a blocker, not retried further per arm rules; the as-is validator and deterministic checks stand in as validation.
2. **Sample-data maintainer**: needs a named maintainer and an authorized owner-record/mapping update path before `records/owners/unassigned.md` (and presumably `records/ownership-map.md`) can change.
3. Residual risk: Mermaid views were source-validated only (no renderer configured in this host); rendered appearance unverified.