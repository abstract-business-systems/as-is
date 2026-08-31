## Status Report

### Setup performed
The seed ships no agent-workflow configuration by design; I adopted the as-is workflow via its canonical deterministic host-setup adapter (`core/adapters/host-setup/setup.ts`), which detected the pi client (`.pi/` present) and wired canonical resources by symlink (no copying). Setup records live at:
- `.agents/skills/<17 canonical skills>` → symlinks to `/home/vc/dev/as-is/skills/*`
- `.pi/prompts/as-is.md` → symlink to `/home/vc/dev/as-is/.pi/prompts/as-is.md`

**Setup finding (residual risk):** the adapter's CLI default bundle path (`resolve(import.meta.dir, "../..")`) resolves to `/home/vc/dev/as-is/core`, whose empty inventory produces a silent no-op (`linked: []`, exit 0). I verified this failure mode, then re-ran with an explicit `--bundle=/home/vc/dev/as-is`, which created all 18 links. I did not modify the upstream adapter (outside this working directory). This is worth reporting upstream as a setup-adapter defect.

### Files changed
- `records/backlog.md` — appended two proposals (details below). No other tracked-seed file touched; only the setup symlinks above were added.

### Check results (verbatim)
`bash checks/validate.sh` — exit code **0**:
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

### Bounded scope resolution
**Item 1 — backlog proposals (done, no work started):** `records/backlog.md` is the owning backlog; its contract is "Proposals only … Newest last" with the modeled `- Added: <context>. Proposal: <text>.` schema. Recorded per that schema, after the existing item:
- `- Added: cli output. Proposal: add a `--json` output flag for human-facing commands.`
- `- Added: ci. Proposal: add a CI lint job.`

**Item 2 — `records/owners/unassigned.md` maintainer update (stopped for direction, file unchanged):** The records do not authorize this change: (a) `records/owners/unassigned.md` itself states "No maintainer has claimed the `sample-data/` area" and "This record does not authorize changes; it only records that no owning record exists in the ownership map"; (b) `records/ownership-map.md` lists no owner for `sample-data/` (or for `records/` itself) and mandates "stop for direction rather than guess" when an owner cannot be resolved; (c) the request names no maintainer, and no record establishes a claiming procedure or authority for ownership transitions. Re-assigning ownership would require a named claimant and an authorized owner-record/map update — a genuine decision for you.

### Unresolved questions
1. Who is the new sample-data maintainer, and who/what record authorizes recording that claim (updating `records/owners/unassigned.md` and/or adding an owner row to `records/ownership-map.md`)? Once you name the claimant and confirm the authority, the record update is a one-line follow-up.
2. Should the host-setup adapter's CLI default-bundle mis-resolution (silent no-op) be reported/fixed upstream? Left untouched per scope.
3. Nothing was committed (repo has no initial commit and no git operations were requested); the working tree holds all changes.