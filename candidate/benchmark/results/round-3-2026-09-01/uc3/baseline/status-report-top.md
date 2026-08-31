## Status report

**Result: the `--rare N` option is implemented, validated, and committed** (feature commit `138e82d` on `master`; worktree clean; all work confined to `/home/vc/dev/as-is/candidate/benchmark/run/round-3/uc3/baseline`).

### Setup performed and where its records live
Performed per the `as-is-setup` skill (whole-project mode, boundary = this directory only):
- `.as-is/setup-plan.md` — reviewable dry-run plan (mode, boundary, candidate evidence, planned/excluded writes) plus a revision record after expert plan review.
- `AGENTS.md` — created; contains the canonical as-is statement exactly once plus local validation/design-note pointers.
- `as-is.md` (root) — `# as-is - as-is` map with Components table, lineage, a component-map mermaid diagram, and links to the ownership map/design notes/changelog.
- `src/wordstats/as-is.md` — `# core-utility - as-is` (name reused from the seed's `records/ownership-map.md`), with count-pipeline diagram.
- `as-is.json` — machine configuration (provider `openrouter`, model `z-ai/glm-5.3-flash`, record filenames, project-temp dir).
- `agents` — read-only symlink to `/home/vc/dev/as-is/agents` so canonical expert roles resolve in-process.
- Human-approval step: no human channel exists mid-arm; the verbatim benchmark request itself authorizes setup, and candidate dispositions are recorded in the plan against that authority (noted as an assumption).

### Files changed
- Feature: `src/wordstats/cli.py` (modified — `--rare` with positive-integer argparse validation, exit 2 on invalid N), `src/wordstats/rarewords.py` (new, by the delegated child), `tests/test_rarewords.py` (new, 7 tests), `CHANGELOG.md` (1.1.0 entry), `docs/design-notes.md` (design note written before the change, per the design-note convention).
- Setup: files above plus 5 scoped commits (`461affc`, `aaddd17`, `f9c9a27`, `dea28cc`, `138e82d`); `git diff --check` clean. The transient task pair (`src/wordstats/as-is.json` + `tasks.md`) was removed at completion per the component-task-record-protocol; its durable evidence lives in commits `aaddd17`/`dea28cc` and the changelog summary.

### Check results (verbatim, final run on committed state)
```
compile: OK
... (4 seed tests + 6 new tests) ... ok
Ran 10 tests in 0.006s
OK
unit tests: OK
cli smoke check: OK
All checks passed.
```
`bash checks/validate.sh` → **exit 0**. Manual CLI checks: `--rare 2` → filtered sorted JSON, exit 0; `--rare 0` → `error: argument --rare: expected a positive integer (got '0')`, **exit 2**.

### How the bounded scope was resolved
- **Delegation (as mandated by the request):** the helper module was implemented by a delegated `component-builder` child via the governed launcher (`--cwd` here, `--no-worktree`, `--model z-ai/glm-5.3-flash`, `--budget-wall-clock-seconds 900 --budget-cost-usd 0.5`, explicit `--agent`/`--record`). The child's component task record (task object + narrative) was the record of authority; the launcher registry line (job `j-mth9rbgd-s60gpg`) is mechanical evidence only. Child ran ~8 s, wrote `rarewords.py` per scope, committed nothing → recorded explicit `no-separate-integration` disposition (parent-owned worktree). A budget-stopped outcome did not occur.
- **Workflow gates:** expert plan review ran and returned "revise"; all structural revisions were adopted (protocol-complete metadata, two-handoff lifecycle, strengthened acceptance, record-contract details). One documented deviation: the expert advised in-process help over subprocess delegation, but the verbatim request mandates the delegated child, so delegation was kept and hardened per the expert's own alternative design.
- **Stop-for-direction:** none needed. Ambiguities (unowned `tests/` and `CHANGELOG.md`) were resolved by explicit direction in the request, recorded as owner dispositions in the task evidence.

### Recorded failures and residual risk
- The delegated child's provider turn errored after writing `rarewords.py` but before updating task evidence; per the no-retry rule this partial result was preserved and reconciled by the parent (recorded in the task evidence commit `dea28cc`), not re-rolled.
- The final expert diff-validation call (session `01a057fe-…`, 13:25:01Z) errored at the provider with **no report**; per the no-retry rule it was recorded as a void validation result rather than retried. The safe-to-commit claim therefore rests on the deterministic gate (`validate.sh`, exit 0) plus orchestrator review, not on an expert report. This is the main residual risk.
- Cost self-limit: observed agent spend is far below the $2 cap (child usage ≈ $0.002; expert/parent calls negligible on `glm-5.3-flash`); cost is self-limited, not launcher-enforced.

### Unresolved questions
- None blocking. Open items for a future maintainer: whether `tests/` and `checks/` should gain component records as the project grows, and whether the `agents` symlink projection should be replaced by a host-native role-resolution mechanism.