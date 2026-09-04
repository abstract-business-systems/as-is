# Status Report — round-4 uc6 baseline arm

## Setup performed (as-is documentation adoption)

The seed ships no agent-workflow configuration, so I ran my workflow's prescribed adoption procedure: `integrate-as-is-documentation` (composing `as-is-setup` + `managing-as-is-document`), **whole-project mode** over the working directory. The reviewable dry-run plan was written **before any write** and lives at `docs/as-is-setup-plan.md` (mode, target, boundary, instruction/root-record dispositions, candidate evidence table, planned writes, excluded paths, validation steps). Setup records created:

- `as-is.md` — root record (`# as-is - as-is`), sole child `wordstats` via Components table, structural-container Mermaid view, `**Lineage**: **as-is**`.
- `src/wordstats/as-is.md` — leaf component record (`# wordstats - as-is`), contract facts, count-command flow view, lineage `as-is / **wordstats**`, design-note link.
- `AGENTS.md` — created containing the canonical as-is.md architecture instruction exactly once.

Attributable expert plan review was obtained via the governed launcher (`--agent /home/vc/dev/as-is/agents/expert/agent.md`, model `z-ai/glm-5.3-flash`, read-only expert profile): **"sound to proceed"**, with two flags I incorporated (`"total"` must sort last in `expected-count.json` for the byte-diff; name `bash checks/validate.sh` as the acceptance check). Setup writes were proven inside the boundary via before/after `git status --porcelain` comparison; `git diff --check` passed; commits `7b36e05` (seed baseline) and `90a8f42` (setup).

## Files changed (feature, commit `2e5f638`)

- `src/wordstats/cli.py` — added `counts["total"] = sum(counts.values())` before `json.dumps` (library `counter.py` untouched)
- `docs/design-notes.md` — design note appended newest-last **before implementing** (request, decision, options considered, bounded change authorized, known limitation: a literal input word `total` is overwritten by the sum)
- `checks/expected-count.json` — `"total": 9` added, sorted last
- `CHANGELOG.md` — new `1.1.0 — total key in count output` entry
- `src/wordstats/as-is.md` — contract text aligned to the new output (created during setup describing the target contract; final state consistent)

## Check results (verbatim)

`bash checks/validate.sh`, run after the feature and again on the committed state — exit code **0** both times:

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

Expert validation of the actual diff (fresh launcher call, ~$0.0015): **"Safe to commit"**; scope containment verified by repo-wide grep — change surface is exactly the five claimed files.

## Bounded-scope resolution

- Ownership records consulted: `src/wordstats/` → `core-utility.md` (component scope) ✔; `docs/design-notes.md` → `design-notes.md` owner (artifact scope; note recorded there first) ✔.
- `checks/` and `CHANGELOG.md` have **no owner record**; the ownership map says to stop for direction on unresolvable scope — the request itself named these artifacts verbatim, so explicit direction existed and no stop was needed. No other stop-for-direction condition triggered.
- Expert-flagged residual risks recorded: no dedicated unit test covers the CLI `total` (smoke check is the only automated evidence for it); the `total`-word collision limitation is accepted and documented.

## Unresolved questions / notes

1. In-process `call_subagent` failed twice (role resolution requires `agents/` under the working directory, which the seed lacks by design); I recorded the blocker and used the governed launcher with the absolute expert agent path instead — the only deviation from the default in-process expert route.
2. Setup-commit ordering note: the wordstats/root records describe the `total` contract from the setup commit onward (setup anticipated the approved feature); the design note still precedes implementation in the working tree, and the final committed state is fully consistent.
3. Pre-existing seed gap (unchanged): `records/ownership-map.md` has no row for `checks/` or `CHANGELOG.md`.
4. Working-tree residue: `src/wordstats/__pycache__/*.pyc` regenerates on every `validate.sh` run (generated artifact, left uncommitted-dirty); `.as-is/` and `.pi/` are harness runtime state, left untracked.
5. Budget: total agent spend ≈ $0.005 (two expert launcher calls) plus this session — far under the $2.00 cap; wall clock well under 3600 s.