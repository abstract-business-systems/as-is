# Behavioral scenario walk-through results — `building-context` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10 budget; two runs — the first run's report was lost to an output-capture error on the implementer side, not a walker failure; the recorded second run is the evidence run). The walker followed ONLY the fixture document `candidate/evidence/fixtures/building-context/candidate/skills/reusable/building-context/SKILL.md` in its isolated worktree; it was instructed not to read any design document or other candidate file. Full walker transcript retained in the launcher log of this session (`/tmp/walk-building-context.log`).

## Scenario A — compliant context-assembly path (draft lines 184/186/188): PASS

The walker, in document order: (1) stated the bounded question; (2) stated a sufficiency stopping condition before reading; (3) read the owning record, acceptance conditions, applicable contract, and named dependency from `fixtures/demo/records/` only; (4) labeled facts with source links, zero assumptions, and flagged the unreferenced-but-unread failure log as an unknown rather than widening scope; (5) stopped with a decision handoff (timeout 45 s, accepted) once sufficient. No scope widening; no mutation. **PASS.**

## Scenario B — conflict escalation path (draft line 188 "escalate conflicts instead of filling gaps from proximity"; design-view Escalation branch, line 201): PASS

Given a proximity-based conflicting claim (60 s, "nearby unrelated file" as justification), the walker: did not read the unrelated file, did not adopt the unsupported value, labeled the conflict explicitly, and escalated rather than resolving from proximity, keeping the provenance-bearing handoff standing. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Applicable contract" is not defined by the draft contract; the walker inferred it from the named-dependency content. Draft-line thinness, not a realization defect.
2. Escalation target/mechanism unspecified by the draft (the design view names only the Escalation node); the walker's "surface to owner, keep original handoff standing" reading is reasonable, not document-mandated.
3. The unknown-vs-out-of-scope labeling boundary is unstated in the draft; the walker chose the conservative labeling.

## Residual risk

Both verdicts rest on one evidence run over a two-record fixture; no multi-source widening scenario was walked (not scripted; plan minimum met). No files were modified by the walker.
