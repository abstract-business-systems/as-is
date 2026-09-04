All done. Final status report:

## Status: COMPLETE (all acceptance conditions evidenced)

### Setup performed (as-is workflow adoption)
Performed per the `as-is-setup` skill, **whole-project mode**, target = working directory root:
- **`docs/as-is-setup-plan.md`** — reviewable pre-write setup plan: mode, boundary, candidate evidence, dispositions, planned/excluded writes, and the recorded approval basis.
- **`as-is.md`** (root record, `# as-is - as-is`) with structural-container diagram + Components fallback; **`src/wordstats/as-is.md`** (`# word-count-utility - as-is`, the single approved component, corroborated by `records/owners/core-utility.md`) with count-pipeline diagram and lineage line. Both pass the workflow's source-level validator (`managing-as-is-document`): 0 issues (it caught and I fixed a real bad lineage link during setup).
- **`AGENTS.md`** — created with the single canonical as-is instruction.
- **`as-is.json`** + **`tasks.md`** task records; `agents/expert/` role record copied in so the in-process read-only expert gates could resolve (first subagent attempt failed resolving roles from the bare seed).

### Files changed (5 commits, `git log --oneline`)
- `5dbee68` setup (necessarily includes the whole untracked seed tree — repo had no initial commit; recorded scoping note)
- `d090311` **Item 1** — `README.md` Usage now shows the verified working `PYTHONPATH=src python3 -m wordstats.cli count sample-data/words.txt` (old command reproduced broken: no `__main__.py`, missing `count` subcommand, no module path)
- `499fc36` **Item 2** — `tests/test_counter.py`: `test_preserves_internal_hyphens` (behavior verified empirically before writing the test)
- `11cf411` **Item 3** — `CHANGELOG.md`: 1.0.0 claim "insertion-ordered JSON" corrected in place to "key-sorted JSON" (verified `sort_keys=True` in `cli.py:19` **before** any changelog entry was written; the validate.sh claim was verified correct and untouched)
- `8d1dda5` task-record closure

Each item has its own commit and its own `## Unreleased` changelog entry; `git diff --cached --check` passed before every commit.

### Check results (verbatim)
Final `bash checks/validate.sh` — **exit code 0**:
```
compile: OK
test_counts_basic_words ... ok
test_empty_input ... ok
test_ignores_punctuation_only_tokens ... ok
test_preserves_internal_hyphens ... ok
test_strips_punctuation_and_lowercases ... ok
Ran 5 tests in 0.000s
OK
unit tests: OK
cli smoke check: OK
All checks passed.
```
validate.sh also exited 0 at baseline and after each item. Expert gates: plan review (REVISE → resolutions recorded) and final-diff validation (**SAFE TO COMMIT**, limitation: validator couldn't execute commands itself).

### Bounded-scope resolution
- The ownership map's stop-for-direction rule was resolved by the arm request itself: every unowned area touched (`tests/`, `CHANGELOG.md`, root setup records) is explicitly named in the request — recorded as the resolving authorization, not a guess. No stop-for-direction was ultimately needed.
- No child delegation was required; all work in-process. Budget: 3 expert subagent calls total, well under the $2 / 3600 s caps. No commit was forced for incomplete work — nothing is incomplete.

### Deviations / residual risk / unresolved questions
- First expert call timed out at the 60 s worker limit; recorded as infrastructure failure, single retry with extended timeout (per the no-re-roll rule this is documented rather than silently repeated).
- Task-record cleanup (`tasks.md` removal + status flip) rode in a small final record-closure commit rather than the two-commit handoff protocol, forced by the benchmark's per-item commit requirement — recorded as an intentional adaptation.
- Live agent behavioral validation of the new `AGENTS.md` was out of arm scope (residual risk noted in the setup plan).
- `.as-is/tracing.jsonl` is modified by the host harness at runtime and two `__pycache__/` directories remain untracked; both left untouched as out of scope. No unresolved questions.