# Status report — round-3 uc5 baseline arm

## Setup performed and where its records live
The seed ships no agent-workflow configuration by design, so I performed the workflow's prescribed adoption procedure for an existing project (`as-is-setup` composed with `integrate-as-is-documentation`, whole-project mode), plus the `building-components` flow gates (expert plan review before edits, expert diff validation before commit):

- **Working setup plan (reviewable plan before writes, durable evidence):** `.as-is/setup-plan.md` — mode, target, boundary, candidate dispositions, exact planned writes, acceptance/recovery checks, and all gate/remediation evidence. Committed.
- **Root record:** `as-is.md` — `# wordstats - as-is`, root-only decomposition (no child records; `src/wordstats/` merged into the root with recorded rationale), one `**Lineage**: **wordstats**` line, one named supplementary Mermaid diagram (source-level validated; no local renderer configured). Committed.
- **Instruction file:** `AGENTS.md` created in-boundary (none existed) carrying the canonical as-is architecture instruction exactly once (grep count = 1). Committed.
- **Attribution infrastructure:** `agents/expert/` and `skills/human-centered-consulting/` were copied into the working directory so the required read-only expert gate could resolve (first gate call failed with ENOENT because the seed has no `agents/`). These remain **untracked transient working infrastructure, excluded from the commit**; their copied `as-is.md` files carry stale outer-repo parent links, dispositioned in the plan as not-repaired.

## Files changed (commit `c8f4894`, root commit, 4 files / +162)
- `as-is.md` (new), `AGENTS.md` (new), `records/backlog.md` (two proposal-only rows appended), `.as-is/setup-plan.md` (new). Seed files (src/, tests/, checks/, sample-data/, records/owners/, CHANGELOG.md, etc.) remain untracked and untouched.

## Check results (verbatim, final run; both runs exit 0)
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
exit=0
```
Additional checks: `git diff --cached --check` → clean; before/after path comparison → only `AGENTS.md` and `as-is.md` added, no path outside the boundary touched; canonical-instruction count in `AGENTS.md` = 1; all `as-is.md` links resolve.

## How the bounded scope was resolved
1. **Backlog proposals — done.** Both ideas recorded in `records/backlog.md` in the file's existing `- Added: … Proposal: …` format, newest last: `--json` output flag for human-facing commands, and a CI lint job. No proposal work was started anywhere.
2. **`records/owners/unassigned.md` maintainer update — STOP FOR DIRECTION.** The records do not authorize this change: `records/ownership-map.md` has no `sample-data/` row; `unassigned.md` states it "does not authorize changes" and only records that no owning record exists; and no maintainer identity was supplied. Reflecting "now has a maintainer" would contradict the ownership map and create owner authority the records don't grant, so no edit was made to either file (unchanged-content attestation + SHA-256 recorded in the setup plan). The request is recorded in `.as-is/setup-plan.md` for whoever holds ownership authority.
3. **Expert gates:** plan review FAILed once (revisions applied); final-diff validation FAILed twice on evidence-transcription defects in the plan (verbatim check output; literal ownership-record transcription) — remediated, then PASS: "the scoped handoff is safe to commit."

## Unresolved questions
- Who is the sample-data maintainer, and who may add the owner record + ownership-map row — awaiting direction; that update was intentionally not made.
- `CHANGELOG.md` was not written (no ownership-map row covers it; deviation from the generic changelog step is recorded in the plan instead of guessed).
- Residual risk: Mermaid validated at source level only (no configured renderer); session-start byte identity of the two ownership files is attested by no-edit-plus-matching-content, not a pre-session hash (the repo had no initial commit); expert subagents ran on the arm-mandated model rather than the role file's `model: large`.