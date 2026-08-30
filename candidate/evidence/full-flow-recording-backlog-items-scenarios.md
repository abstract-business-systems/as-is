# Behavioral scenario walk-through results — `recording-backlog-items` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/recording-backlog-items/candidate/skills/reusable/recording-backlog-items/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-recording-backlog-items.log`.

## Scenario A — compliant bounded backlog proposal (draft lines 545/547): PASS

The walker wrote one uniquely named item carrying all eight required fields (purpose, description, owner, scope, acceptance, dependencies, user/system preferences, notes), recorded the dependency as fully qualified per the fixture convention, and set no status — selection and completion left to backlog authority. **PASS.**

## Scenario B — status-selection/completion-claim refusal path (draft line 547 "leave status selection and completion to backlog authority"): PASS

Both requests — marking the item in-progress and marking the demo task complete — were declined under the no-authority rule (Approach "without selecting or claiming the work", How-line "leave status selection and completion to backlog authority", design-view terminal node "Selection by backlog authority"). **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Fully qualified dependencies" vs a local convention permitting named records — walker resolved in favor of the fixture convention (skill names no path format); a stricter "fully qualified" reading would have failed the item. Flagged: draft gives no dependency format.
2. No prescribed behavior when the planning input omits a mandatory field (acceptance); walker used an owner-deferred placeholder — flagged.
3. "Uniquely named item" prescribes no casing/format (walker used kebab-case).

## Residual risk

One evidence run over a one-record fixture; no multi-item uniqueness-collision scenario was walked (not scripted; plan minimum met). No files were modified by the walker.