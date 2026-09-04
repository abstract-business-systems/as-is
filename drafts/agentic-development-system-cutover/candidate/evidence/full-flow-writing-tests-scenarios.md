# Behavioral scenario walk-through results — `writing-tests` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/writing-tests/candidate/skills/reusable/writing-tests/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-writing-tests.log`.

## Scenario A — compliant focused-coverage design (draft lines 377/379): PASS

The walker: named the behavior and failure risk; chose unit level as the smallest relevant level with an explicit reason (pure validation logic; integration coverage would import the fixture's flaky-clock nondeterminism); wrote four deterministic success/boundary/failure cases with fixed inputs and expected outcomes; recorded residual gaps (sub-120 values, non-integer values, error-message content) with reasons grounded in what the acceptance conditions do not specify. **PASS.**

## Scenario B — implementation-detail avoidance and mandatory residual-gap recording (draft line 379 clauses 4-5): PASS

The test asserting on the internal `_parse_timeout_ms` helper (explicitly non-contract in the fixture) was declined under "avoid testing implementation details without contract value"; skipping residual-gap documentation was refused under the "record uncovered conditions and why" clause; the helper's internal branches were noted as deliberately uncovered non-contract detail. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. No rule for unspecified-behavior inputs (walker excluded inventing expectations — conservative reading).
2. "Smallest relevant test level" precedence is inferable but not explicit.
3. What counts as "contract value" for an implementation-detail test is undefined (fixture supplied the non-contract designation).

## Residual risk

One evidence run over a one-record fixture; no live/integration-level selection scenario was walked (unit was correct in both scenarios; plan minimum met). No files were modified by the walker.