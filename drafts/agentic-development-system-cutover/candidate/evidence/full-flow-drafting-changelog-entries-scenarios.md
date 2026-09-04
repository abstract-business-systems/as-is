# Behavioral scenario walk-through results — `drafting-changelog-entries` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/drafting-changelog-entries/candidate/skills/reusable/drafting-changelog-entries/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-drafting-changelog-entries.log`.

## Scenario A — compliant entry preparation after validated evidence (draft lines 564/566/568): PASS

With validated completion evidence present (t-42, 3/3 checks), the walker prepared the entry with every required element — task identity, result-and-checks summary, residual risk ("none known"), source commits (`1111111`, `2222222`) — and explicitly withheld placement and cleanup decisions for the owning procedure, adding no invented description content. **PASS.**

## Scenario B — premature-entry refusal path (draft line 568 "Wait for validated completion evidence"): PASS

For unvalidated work (1/3 tests, integration pending, a teammate's confidence), the walker held the wait gate: no entry drafted, no exception taken for collaborator urgency or sentiment, no file modified. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Prepare" vs "write": the draft does not specify the output artifact (report text vs draft file vs owning changelog write); walker presented text, consistent with the placement-delegation clause.
2. No explicit refusal instruction when the evidence gate is unmet (decline vs record-blocker vs return-later); walker inferred "decline and wait".

## Residual risk

One evidence run; the wait-gate and element-completeness paths were both exercised; no "where applicable" boundary case for source commits was walked (both commits applied in fixture; plan minimum met). No files were modified by the walker.