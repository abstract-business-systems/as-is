## Status Report

**Outcome: complete.** All acceptance conditions evidenced; one scoped commit `f5ae186` on `master`; `bash checks/validate.sh` exit 0.

### Setup performed (workflow adoption)
Whole-project mode per `as-is-setup`, executed inside the working directory only:
- `as-is.md` — root record (`# as-is - as-is`), structural container + component map
- `src/wordstats/as-is.md` — wordstats component record (pipeline diagram, contracts, lineage)
- `AGENTS.md` — created with the single canonical as-is instruction (exactly once)
- `agents/expert/agent.md`, `agents/component-builder/agent.md` — local role sources (copied from canonical parent-repo sources; only the expert skill path adapted to an absolute path) — required because both `call_subagent` role resolution and the launcher resolve `agents/<role>/agent.md` under the project root, and the seed ships none by design
- `as-is.json` — companion `configuration` (model policy: z-ai/glm-5.3-flash/openrouter for every role) + root `task` object

The setup plan (mode, boundary, candidates with evidence, exclusions, planned writes) was recorded in the transient `tasks.md` before writes; the delegating request's explicit setup authorization was treated as the reviewable approval (recorded as a material assumption). Boundary proof: all changed paths inside the target; enclosing benchmark dirs untouched.

### Files changed
- **Feature**: `src/wordstats/cli.py` (`positive_int` type + `--min-count`, exit 2 via `ArgumentTypeError`), new `src/wordstats/topwords.py` (`filter_min_count`: `>=` filtering, order preserved, `ValueError` on non-int/<1/bool), `tests/test_cli.py` (8 tests), `tests/test_topwords.py` (6 tests), design note appended to `docs/design-notes.md` **before** the behavior change per the owner-record convention
- **Records**: `CHANGELOG.md` (1.1.0 entry incl. durable delegation summary), root/component `as-is.md` records above
- Ownership-map discipline: `cli.py` and new `topwords.py` both resolve to the `core-utility` owner record (owns `src/wordstats/`); design note resolves to the design-notes owner — no ambiguous area, no stop-for-direction needed

### Bounded scope resolution — delegation
- Helper module implemented by a delegated child component-builder; **the child's component task record (`src/wordstats/as-is.json` task object + `tasks.md`) was the record of authority**; launcher registry = mechanical evidence only. Child record reached `completed` with its own expert plan-review (APPROVE) and final-validation (SAFE TO COMMIT) gates and 6/6 focused tests.
- Control-plane `delegate()` only creates new immediate sibling scopes of the root, so for the existing `src/wordstats` component directory I created the child task pair directly with the control plane's `childTaskData` schema; `admit-launch` normalized the budget to **780 s / $0.70**; launcher run: job `j-mtgfyvrs-tcnwei`, `--no-worktree`, model `z-ai/glm-5.3-flash` (dry-run verified first), exit 0, wall 117.9 s. Explicit **no-separate-integration** disposition (shared worktree, no child commit; parent owns the scoped commit). Parent gates: expert plan review PASS (call 56f091e16bd141ce8b2d31cb9635e133) and final-diff validation SAFE TO COMMIT (call 7369e81bc40c4664a5a5d43db55c4f9a).
- Protocol deviations recorded: no separate task-start commit (single completion commit; delegation facts preserved in `CHANGELOG.md`); transient task narratives/objects removed at completion per protocol. Parent integration touched the child's file only to add a missing trailing newline.

### Check results (verbatim, final run post-commit)
```
compile: OK
Ran 18 tests in 0.009s
OK
unit tests: OK
cli smoke check: OK
All checks passed.
EXIT=0
```
Also: `git diff --cached --check` clean; `can-complete` eligible (descendant closure: 1 child, terminal, none failed/cancelled).

### Unresolved questions / residual risk
- `positive_int` accepts `int()` quirks (`"+3"`, `" 3"`, `"1_0"`) — judged compliant with the stated acceptance; stricter `isdigit()` available if desired.
- `checks/validate.sh`'s smoke check exercises only the baseline output; `--min-count` is unit-covered, not smoke-covered.
- No cost meter was available; budgets were self-limited (child estimate ~$0.05 recorded in its record) — actual totals unobservable.