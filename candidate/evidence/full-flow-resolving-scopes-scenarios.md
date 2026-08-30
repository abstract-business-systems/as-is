# Behavioral scenario walk-through results — `resolving-scopes` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/resolving-scopes/candidate/skills/reusable/resolving-scopes/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-resolving-scopes.log`.

## Scenario A — compliant scope resolution (draft lines 208/210): PASS

Request: "add a retry-backoff note to fixtures/demo/demo-note.txt". The walker, in document order: identified outcome and changed artifact; inspected the ownership record (`ownership.md`: artifact-level file, root-owned, no component record); tested component-task applicability (not applicable — no component record); chose **artifact** scope as the smallest owning scope; recorded the decision with rationale; verified no stop condition. No component task assumed; no mutation (the skill resolves scope, it does not edit). **PASS.**

## Scenario B — competing-owners stop path (draft line 210 stop clause; Approach stop clause, line 208): PASS

Request: "update the retry behavior in the demo component". The walker found two competing ownership claims (`owner-pointer.md`, `competing-owner.md` declaring an unresolved dispute), hit the How-line stop clause ("stop on competing owners or missing policy") before choosing a scope, stopped for explicit direction, recorded no scope decision, returned the request to the requester, and modified nothing. **Terminal stop honored: PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. Scope-label tension: an artifact-level file owned at the repository root admits both "artifact" (smallest owning scope, record's own classification) and "root" (owner location) readings; the draft gives no combining rule.
2. The draft does not say whether a stopped resolution should be recorded (blocker note) or only reported; walker reported only, consistent with the no-mutation constraint.
3. Dangling ownership-pointer targets: the draft says nothing about un-dereferenceable ownership pointers; the stop outcome here was unaffected (the competing-owner record self-declared the dispute).
4. Absent target file: fixture gap (immaterial to a scope-resolution walk), not a skill gap.

## Residual risk

One evidence run over a three-record fixture; no project/root-scope selection scenario was walked (not scripted; plan minimum met). No files were modified by the walker.
