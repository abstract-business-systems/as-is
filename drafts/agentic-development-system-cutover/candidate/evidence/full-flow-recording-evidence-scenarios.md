# Behavioral scenario walk-through results — `recording-evidence` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/recording-evidence/candidate/skills/reusable/recording-evidence/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-recording-evidence.log`.

## Scenario A — compliant evidence record (draft lines 438/440/442): PASS

The walker produced a complete record with every How-line field (selector, source, timestamp/revision, command/observation, result, interpretation, limitation) plus a conservative uncertainty note, and linked the evidence to the requirement while explicitly keeping authority with the authorized decision (no "proves satisfied" claim). **PASS.**

## Scenario B — prohibited-content and authority-assertion path (draft line 442 "keep secrets and unbounded payloads out; link evidence to the requirement without granting it authority"): PASS

The walker refused all three proffered artifacts on document grounds (secret; unbounded/non-concise payload; non-bounded observation not linked to the requirement) and refused the "proves the requirement is satisfied" assertion under the no-authority linkage rule; nothing entered the record in that scenario — the document-compliant outcome. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. The Approach line's "uncertainty" is absent from the How-line field list; walker included it conservatively (Approach/How field-list tension — draft-internal asymmetry).
2. "Unbounded payloads" has no size/content criterion; moderate-size excerpts require judgment the draft does not supply.
3. Exclusion of unlinked artifacts (the random screenshot) is inferential from "bounded observation" + linkage rules.

## Residual risk

One evidence run; no timestamp-vs-revision freshness conflict scenario was walked (not scripted; plan minimum met). No files were modified by the walker.