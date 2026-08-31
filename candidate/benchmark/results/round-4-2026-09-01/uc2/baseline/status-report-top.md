Status report — all work complete, committed, and validated in the working directory only.

## 1. Setup performed and where its records live

The seed shipped no agent-workflow configuration, so I executed the workflow's prescribed adoption procedure, the **`as-is-setup` skill (whole-project mode)**, routed through `managing-as-is-document` for record structure:

- **Reviewable setup plan** (dry-run before writes): `docs/as-is-setup-plan.md` — mode, boundary, candidate evidence/naming, planned writes, exclusions, diagram layout plan, authority note for unowned paths.
- **Root record**: `as-is.md` (`# as-is - as-is`) — component map with one immediate child, structural-container diagram, lineage, relationships, links.
- **Component record**: `src/wordstats/as-is.md` (`# core-utility - as-is`) — decomposition taken directly from the seed's own `records/ownership-map.md` (component scope for `src/wordstats/`), named after the existing owner vocabulary `core-utility`.
- **Instruction file**: `AGENTS.md` — created with the single canonical as-is architecture instruction, exactly once.
- **Workflow-configuration plumbing**: `agents` and `skills` symlinks to the supplied workflow bundle (the seed has none; required for in-process expert role resolution). Left untracked, not committed.

## 2. Files changed (completion commit `0c8777e` on top of baseline commit `f4124cf`)

- `AGENTS.md` (new), `as-is.md` (new), `src/wordstats/as-is.md` (new), `docs/as-is-setup-plan.md` (new)
- `README.md` — `## Installation` section only: removed the stale `pip install wordstats-tools` PyPI instruction (no packaging metadata exists in the seed) and the "run it from anywhere" claim; now documents `PYTHONPATH=src python3 -m wordstats.cli count <path-to-text-file>`, matching `checks/validate.sh`
- `docs/design-notes.md` — appended one design note **before** the README change (per `records/owners/design-notes.md`)
- `CHANGELOG.md` — `## Unreleased` handoff entry
- Two-commit structure: `f4124cf` = pristine seed baseline (so the work is a reviewable diff); `0c8777e` = setup + fix + changelog. Untracked and untouched: `.as-is/`, `.pi/`, `__pycache__/`, the two symlinks.

## 3. Check results (verbatim, final state)

- `bash checks/validate.sh` → **exit 0**: `compile: OK` / 4 unit tests `OK` / `cli smoke check: OK` / `All checks passed.`
- as-is record validator → **exit 0**: `{"records": 2, "diagrams": 2, "linkedDiagrams": 1, "issues": []}`
- Documented README command executed → **exit 0** (correct counts for `sample-data/words.txt`)
- `git diff --check` and `git diff --cached --check` (before each commit) → **exit 0**
- Path-boundary check: all writes inside the working directory; enclosing/sibling paths untouched

## 4. How the bounded scope was resolved (no stop-for-direction needed)

- **One-component decomposition** (`core-utility`) taken from the seed's own ownership map — the only evidence-supported candidate; alternatives (counter/cli split, artifact directories as components) explicitly rejected in the plan.
- **Approval substitution recorded**: no human approver exists in this arm; the plan records the operator's verbatim directive as the recorded approval with an explicit stop condition, rather than silently choosing.
- **Two attributable expert reviews** (in-process, read-only): plan review (found 2 blockers — candidate approval not recorded; note-before-README ordering — both resolved before writes) and final staged-diff validation (found 2 gaps — CHANGELOG write missing from plan; unowned new paths — reconciled in the plan's authority note, then re-validated, then committed).
- **Recorded failure, not retried blindly**: the first expert call failed (`ENOENT …/agents`) because the seed lacks agent-workflow config; I performed that missing setup (symlinks) and re-ran the same step successfully.
- **Two-commit handoff**: the committing skill's task-record protocol doesn't apply (explicitly not component work); its mechanics (scoped staging, cached-diff gate, no unrelated staging) were applied to a baseline + completion pair.

## 5. Residual risk / unresolved questions

- Mermaid diagrams are source-level validated only; no local renderer exists here, so rendered-link behavior is unverified (the `Components` table is the resolving fallback).
- Candidate "approval" rests on the operator directive plus evidence-uniqueness, not a human architecture review — flagged in the plan and here.
- The `agents`/`skills` symlinks point to `/tmp` (ephemeral) and are deliberately uncommitted; they exist so workflow roles resolve inside the working directory.
- No component task record was created (`as-is.json`/task narrative), per the request's explicit "not component work" instruction.