# Behavioral scenario walk-through results — `writing-code` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/writing-code/candidate/skills/reusable/writing-code/SKILL.md` in its isolated worktree; edit scope limited to `fixtures/demo/`. Transcript retained in `/tmp/walk-writing-code.log`.

## Scenario A — compliant implementation with no completion claim (draft lines 333/335; How line 339): PASS

The walker: read the requirement, interfaces, constraints, and the nearby pattern (`retry.py`, `retry_delay`); defined changed artifacts and an acceptance mapping to the two fixture test cases; implemented the smallest coherent path (added `FetchError`, `max_retries=3` parameter, backoff loop, exhaustion raise); preserved the error behavior per the requirement; returned a framed diff-for-testing-and-validation and explicitly did NOT claim completion or verified acceptance (no test execution available). **PASS.**

## Scenario B — out-of-capability path via the authorized line-148 separation note: PASS

A surgical one-constant config tweak was correctly rejected as outside this skill's fit: the walker declined to perform the change under this skill, named `applying-bounded-edits` as the owning separate capability (per the authorized separation note), performed no edit, and granted itself no authority. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Smallest coherent path" is undefined when a required error type does not yet exist (walker defined it locally — smallest path including the missing error type).
2. Stub-parameter-vs-requirement-parameter naming conflicts have no rule (walker followed the requirement's explicit name).
3. No diff format or self-validation is prescribed for "return the diff for testing and validation".
4. The separation note names the owning capability but gives no refusal/hand-off wording (walker returned refusal plus pointer as the most faithful reading).

## Residual risk

One evidence run; the implemented retry loop's success path is a fixture placeholder (no real transport) — appropriate, since the skill's contract ends at the diff handoff and explicitly does not claim completion. No multi-artifact requirement scenario was walked (not scripted; plan minimum met).