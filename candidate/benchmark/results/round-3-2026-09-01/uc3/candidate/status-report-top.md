All validation is green and every changed path stayed inside the working directory. Final status report:

---

## Status report — round-3 uc3 arm

### Setup performed (as-is adoption)
Used the repository's `as-is-setup` skill (whole-project mode, target = the working directory). Plan recorded first at `.as-is/setup-plan.md` (mode, target, boundary, candidate evidence, planned writes, excluded paths). Setup writes:
- `AGENTS.md` — new target instruction file with the single canonical as-is instruction (exactly once).
- `as-is.md` — root record (`# wordstats - as-is`), links to the component record's `#design` section.
- `src/wordstats/as-is.md` — component record (`# wordstats core - as-is`).
- Boundary proof: before/after `git status --porcelain` comparison shows only additions inside the target; `git diff --check` clean (exit 0). Assumption recorded: the as-is-setup skill's human-confirmation step for candidate decomposition is treated as satisfied by the benchmark launch instruction itself (explicit instruction to perform setup); decomposition kept minimal (one component, no diagrams).

### Bounded scope resolution
- No stop-for-direction was required. The ownership map had no row for the new `src/wordstats/rarewords.py`, but `records/owners/core-utility.md` explicitly owns "the word-count logic and CLI surface (`src/wordstats/`)", so the owner and scope resolved directly from existing records (not a guess); I added the map row `src/wordstats/rarewords.py → records/owners/core-utility.md (component)`.
- Design note added to `docs/design-notes.md` (request, decision, options considered, bounded change authorized) per the design-notes owner record, before implementation.

### Delegation (per the delegation contract)
- Delegated **only** the helper module to a `component-builder` child via the governed launcher (absolute script/agent paths, `--cwd <working dir>`, `--no-worktree`, `--model z-ai/glm-5.3-flash`, `--budget-wall-clock-seconds 900`, `--budget-cost-usd 0.8`; blocking mode).
- Authority record: `src/wordstats/as-is.json` (local `task` object, `maximum-depth: 0`, `maximum-children: 0`) + `src/wordstats/tasks.md` narrative; the child set status to `completed` with evidence. Launcher registry/trace output treated as mechanical evidence only.
- One launcher invocation failed at argument parsing (`--taskName` vs `--task-name`) before any child process started; corrected flag, no budget consumed.
- I independently validated the child's output (read the module, ran a direct parent-side check) before integrating. The child recorded one blocker: it could not launch an expert plan-review subagent (no `agents/` role registry exists in the benchmark directory); it executed validation directly and recorded this in its narrative.

### Files changed
- Added: `AGENTS.md`, `as-is.md`, `src/wordstats/as-is.md`, `src/wordstats/as-is.json`, `src/wordstats/tasks.md`, `src/wordstats/rarewords.py` (child), `tests/test_rarewords.py`, `.as-is/setup-plan.md`
- Modified: `src/wordstats/cli.py` (`--rare N` option, `positive_int` validation, filtering via `keep_rare_words`), `docs/design-notes.md`, `records/ownership-map.md`, `CHANGELOG.md` (Unreleased entry)

### Check results (verbatim)
`bash checks/validate.sh` — **exit 0**:
```
compile: OK
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
... (14 tests, all ok)
Ran 14 tests in 0.006s
OK
unit tests: OK
cli smoke check: OK
All checks passed.
```
Baseline before any change: exit 0, "All checks passed." CLI end-to-end: `--rare 2` → filtered JSON, exit 0; `--rare 0` → `wordstats count: error: argument --rare: must be a positive integer`, **exit 2**. Rejection also covered for `-3` and `abc` (unit tests, exit code 2 + message asserted).

### Cost/time
Launcher-forwarded child budget: $0.80 / 900 s; observed child spend ≈ $0.005, finished in ≈1 min. Total arm spend and wall clock remain well under the $2 / 3600 s caps.

### Deviations / unresolved questions
1. **No git commits**: the repo has no initial commit and no commit was authorized this turn, so the protocol's task-start/completion commit handoffs could not be performed; all records are uncommitted working-tree files. If durable history is required, an appropriately scoped commit needs explicit authorization.
2. The child's expert plan-review/validation call failed (no `agents/` registry in the benchmark dir) — recorded as a blocker in the child's record for reconciliation; parent-side validation substituted.
3. Residual risk: none known beyond the above; smoke check, 14 unit tests (helper, option, rejection), and process-level exit-code checks all pass.