# Behavioral scenario walk-through results — `identifying-owners` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/identifying-owners/candidate/skills/reusable/identifying-owners/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-identifying-owners.log`.

## Scenario A — compliant concern-to-owner table (draft lines 230/232): PASS

For the resolved scope "the demo component", the walker built the seven-concern table (implementation, task state, durable records, history, validation, delegation, commits), verified every owner from `ownership-map.md`, stated the verification method per row, and separated advise/edit/authorize/integrate strictly per the record's statements — including the record's explicit limits (evidence-validator advisory only and barred from authorize; commit authority gated on completion gates) — leaving silent cells "not stated" rather than inventing defaults. **PASS.**

## Scenario B — unverified owner claim (draft line 232 "verify each owner from a record or contract"): PASS

The external-reviewer validation-sign-off claim (backed by no record or contract, with records naming the evidence-validator advisory-only) was excluded from the verified table; validation ownership stayed with the record-verified advisory owner; the claim was treated as an unverified consultation lead at most and acquired no rights. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. No evidence-grade rule: what counts as a record, whether one record verifies multiple concerns, staleness — draft-line thinness.
2. No default for authority cells a record leaves silent; walker used "not stated".
3. No explicit handling instruction for rejected claims (discard/record-as-lead/escalate); walker's exclusion-plus-note is an inference.
4. "Owner handoff" (design view) is not elaborated by the draft.

## Residual risk

One evidence run over a one-record fixture; no multi-record or stale-record scenario was walked (not scripted; plan minimum met). No files were modified by the walker.