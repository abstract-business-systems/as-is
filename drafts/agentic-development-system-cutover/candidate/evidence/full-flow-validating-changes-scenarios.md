# Behavioral scenario walk-through results — `validating-changes` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/validating-changes/candidate/skills/reusable/validating-changes/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-validating-changes.log`.

## Scenario A — acceptance-to-evidence matrix path (draft lines 417/419/421): PASS

The walker built the acceptance-to-evidence matrix from the fixture conditions and evidence, applied the four-value outcome semantics (every condition **untested** — no observable test-to-condition mapping existed), separated observations from inferences explicitly, declined the teammate-chat-message "passed" claim under "distinguish pass from unsupported claims," and recorded residual risk, recovery steps, and commit readiness ("not ready"). **PASS.** The conservative outcome values (untested rather than blocked or passed) were grounded in the document's outcome semantics.

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. Blocked-vs-untested boundary undefined (skipped-test case could read either way); walker chose the conservative "untested".
2. "Inspect the actual diff" unfulfillable from summaries only; document gives no substitute path (walker recorded limitation, did not substitute inference).
3. Matrix format unspecified; walker chose minimal columns.
4. Conflicting condition lists between two fixture records exposed a draft-level gap (no precedence rule) — fixture interaction, flagged.

## Residual risk

One evidence run (single matrix scenario — the plan minimum for this stop-semantic-free skill); no blocked/failed outcome scenario was walked (outcomes exercised were untested only; plan minimum met). No files were modified by the walker.