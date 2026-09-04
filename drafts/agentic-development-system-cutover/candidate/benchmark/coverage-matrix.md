# Benchmark Coverage Matrix (standing registered artifact)

Maintained under the standing methodology (`pre-registration-v4.md` sections 4–6; arms, model, caps, rubric, parity margins, and scorer mandate are fixed there and referenced by every subsequent pre-registration). Each round's pre-registration cites the gap rows it closes and states its use-case set; on completion the round's scoring updates the Status column. Statuses: `covered (round-N)` = observed invoked with observable impact; `covered*` = impact observable but no skill-file read (invocation-vs-impact note); `gap` = not yet exercised by any registered use case.

| Capability (baseline → candidate) | Anchor use case | Status |
| --- | --- | --- |
| as-is-setup → as-is-setup | all | covered (round-4) |
| implementing-component-tasks → implementing-tasks + building-context, applying-bounded-edits | uc3, uc6 | covered (round-4) |
| building-components → master + reusables | uc3/4/7 | covered (round-4) |
| maintaining-components → (both sides) | uc6 | covered* (round-4: zero engagement BOTH sides — fixture gap, explained; parity did not rest on it) |
| verification-discipline → validating-changes, running-tests | all | covered (round-4) |
| committing-completed-work → (both sides) | uc7, uc2/3/6 | covered (round-4; candidate invocation records-based, flagged) |
| context-building → building-context (reusable) | uc3, uc6 | covered* (round-4) |
| naming-software-concepts → choosing-names | uc8, uc3 | covered (round-4) |
| structuring-content → (both sides) | uc4, uc8 | covered* (round-4) |
| managing-as-is-document/records | uc5, uc6, uc8 | covered (round-4) |
| managing-backlog → managing-backlogs, recording-backlog-items, identifying-owners, resolving-scopes | uc5 | covered (round-4) |
| spawning-pi-subagents → spawning-subagents, delegating-bounded-work, observing-delegated-work — SINGLE child | uc3 | covered (round-4) |
| spawning-pi-subagents → (same) — MULTIPLE children run CONCURRENTLY | uc9 | covered (round-5: registry-verified same-second launches, live overlap ~36s baseline / ~62s candidate; both arms dual-integrated with passing checks) |
| delegation BUDGET enforcement and STOP RECOVERY | uc10 | partially covered (round-5: budget pinning + forwarding OBSERVED INVOKED both arms; stop never fired — children completed at 31s/56s of the 180s cap; recovery path remains unexercised) |
| designing-mermaid-diagrams → designing-diagrams (pending-drop path) | uc4 | covered (round-4) |
| deterministic-skills → assessing-determinism (reusable) | (not exercised in any registered UC) | mapped 2026-09-01; counterpart exists, benchmark-unexercised — adoption disposition: port/mapping row, no catalog work |
| integrate-as-is-documentation → (function absorbed: setup flow + managing-as-is-records) | all (setup dimension scored 3/3 candidate every round) | mapped 2026-09-01; function covered by composition, no 1:1 skill — adoption disposition: absorbed, record rationale |
| MODEL-TIER GENERALIZATION (both arms on @preset/abs-medium) | uc9 (voided: symmetric fixture defect), uc10 | partially covered (round-6: uc10 parity MET 25v25 all gates PASS on gpt-5.6-luna; uc9 scored 25v25 with registry-verified concurrency both arms before voiding; aggregate 50v50) |
| human-centered-consulting → consulting-humans, presenting-decisions | uc5, uc8 | covered* (round-4) |
| exploring-execution-evidence → inspecting-execution-evidence | uc7 | covered* (round-4) |
| changelog management → managing-changelogs, locating-changelogs, drafting-changelog-entries | uc6, uc7 | covered (round-4) |

## Open gap register

- ~~Multi-child concurrent delegation~~ → closed round-5 (uc9, registry-verified concurrency both arms).
- **Budget-stop recovery path** (OPEN after round 6): six rounds, zero stops — round-6 uc10 children spent $0.0085/$0.0087 against the $0.05 cap (~6x headroom) even at mid-tier pricing; budget pressure alone cannot fire the stop. The probe needs non-budget pressure (e.g., a child task that CANNOT complete within any reasonable budget, forcing a mid-task stop).
- **Round-6 uc9 fixture lesson**: consumer trees as sibling directories under one parent let delegated children read the other arm (symmetric gate failure; uc9 voided by user 2026-09-01). Future multi-arm rounds must place consumer roots in disjoint fixture directories so cross-arm reads are impossible. — children complete well under plausible caps, so the recovery half of the delegation contract is still unexercised on both sides. Next probe design needs a pressure mechanism other than a small pinned budget (e.g., a child task that CANNOT complete within any reasonable budget, forcing a mid-task stop).
- **Round-5 run-1 lesson**: the governed launcher grants an explicit empty capability set to agents without a `tools:` declaration; arm prompts must pin the child-agent policy (added to round5/launch-arm.sh; applies to future rounds).

New gaps identified in review are added here with date and source, then batched into the next pre-registration.