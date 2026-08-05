# Changelog

- 2026-08-12: Added an opt-in live integration test to `process-boundary-routing.test.ts`, gated by the globally configurable `AS_IS_LIVE_INTEGRATION=1` process flag. `PI_BIN` is optional and only selects an explicitly approved Pi executable. The test invokes `/as-is What’s next?` through the supported launcher with isolated registry/trace paths and bounded metadata assertions for recommendation-only routing, no work start, task/backlog display, and no component-builder launch. Focused validation passed (2 pass); residual risk is provider/model response variability because live execution is opt-in.

- 2026-08-12: Added `process-boundary-routing.test.ts`, a deterministic Bun test that invokes the supported launcher in separate Pi subprocesses for literal `What's next?` routing, bounded metadata analysis, and read-only expert validation. It asserts as-is role/route, backlog inspection, recommendation-only `startsWork: false`, no component-builder delegation, opaque trace/session correlation, and absence of raw prompt content. Focused suite passed (11 tests, 54 assertions); residual risk is limited to live provider/model behavior not exercised by the stub.

- 2026-08-06: Completed `whats-next-live-fallback-recovery-2026-08-04-r3`. The live contract now permits bounded read-only repository and applicable component-backlog inspection only after one orientation snapshot proves no actionable task, while retaining active > blocked > awaiting-approval precedence and all authority gates. Focused routing checks passed (10/10); a fresh separate-Pi clean-copy literal What's next? visibly recommended `whats-next-routing` (High, `agents/as-is`) with the required bounded decision fields, recommendation-only authorization, and `startsWork: false`. Expert plan and final validation passed; residual risk is model-mediated live parsing beyond deterministic fixture coverage.

- 2026-08-06: Clarified the live What's next? routing contract in `agent.md`: authoritative task records now explicitly take `active` > `blocked` > `awaiting-approval` precedence; only when none exist does the router inspect safe component/repository backlog items and report the required ID, owner, priority, bounded outcome, dependencies, acceptance signal, and rationale. The fallback is explicitly recommendation-only, does not authorize or start work, and focused validation passed (6/6); separate expert validation marked the scoped change SAFE TO COMMIT. Residual risk is limited to fixture-level execution not exercising the full orientation/backlog parser.

- 2026-08-06: Verified `whats-next-routing` without production edits: the existing contract routes actionable `active`, `blocked`, and `awaiting-approval` tasks before recommending a safe highest-priority backlog item, clearly marks the fallback recommendation-only, and never starts work. Focused tests passed: bounded-reasoning 4/4 and whats-next-routing 6/6; expert final validation marked the implementation SAFE TO COMMIT.

- 2026-08-06: Added a bounded mechanical path for explicitly named, single-component documentation transformations, retaining component-builder authority for substantive or ambiguous work and enforcing a 30-second stop/no-retry recovery guard. Added focused fixture coverage; 4 tests pass. `whats-next-routing` remains untouched.

- 2026-08-06: Clarified the What's next? routing contract so actionable task
  statuses retain precedence and the safe backlog fallback is a concrete,
  recommendation-only item with required decision fields. Focused routing
  validation passed: 6 tests, 0 failures.

- 2026-08-06: Recovered and integrated the validated as-is migration from commit
  `b3a86eae` and the available sibling worktree without restoring historical
  task state as current authority. Replaced the legacy task-form `as-is.md`
  with durable purpose, design, boundary, and links; retained necessary
  recovery facts here. Added literal **What's next?** routing: actionable
  `active`, `blocked`, or `awaiting-approval` task records first; otherwise
  inspect and prioritize open backlog items through
  `skills/managing-backlog/SKILL.md`. No broader migration remains in this
  component; external legacy consumers, if any, require separately owned work.
