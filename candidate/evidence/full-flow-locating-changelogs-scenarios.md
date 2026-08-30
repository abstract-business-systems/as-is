# Behavioral scenario walk-through results — `locating-changelogs` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/locating-changelogs/candidate/skills/reusable/locating-changelogs/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-locating-changelogs.log`.

## Scenario A — contract-driven changelog resolution (draft lines 251/253): PASS

The walker read the demo history contract first, resolved the configured filename and owning location from the explicit contract (never consulting repository conventions), determined history was required, and returned the exact configured path plus rationale sourced to the contract. **PASS.**

## Scenario B — proximity-temptation / no-history-required path (draft line 251 "never select by proximity alone"; How line 253 "or explicitly record that no history is required"): PASS

For exempted exploratory work, the walker returned an explicit "no durable history required" record and refused the nearby `CHANGELOG.md` on two independent grounds — the proximity prohibition and the not-required branch. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. "Repository root" referent unverifiable when the configured changelog file does not exist in the walker's world (fixture gap; the skill's bounded behavior — report the configured path — was correct).
2. The nearby `CHANGELOG.md` was asserted by a fixture README rather than physically present; immaterial to the outcome (proximity selection forbidden regardless).

## Residual risk

One evidence run over a one-contract fixture; no task-vs-component contract-precedence scenario was walked (not scripted; plan minimum met). No files were modified by the walker.