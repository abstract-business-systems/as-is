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
| spawning-pi-subagents → (same) — MULTIPLE children run CONCURRENTLY | — | **gap → round-5 (uc9)** |
| delegation BUDGET enforcement and STOP RECOVERY (child exceeds budget; parent records stop, no re-roll) | — | **gap → round-5 (uc10)** |
| designing-mermaid-diagrams → designing-diagrams (pending-drop path) | uc4 | covered (round-4) |
| human-centered-consulting → consulting-humans, presenting-decisions | uc5, uc8 | covered* (round-4) |
| exploring-execution-evidence → inspecting-execution-evidence | uc7 | covered* (round-4) |
| changelog management → managing-changelogs, locating-changelogs, drafting-changelog-entries | uc6, uc7 | covered (round-4) |

## Open gap register

- **Multi-child concurrent delegation** (added 2026-09-01, from round-4 review): no use case forces two bounded children; single-child proven only. → round-5 uc9.
- **Budget-stop recovery path** (added 2026-09-01, from round-4 review): zero budget stops in four rounds means enforcement-under-pressure is unexercised; only the happy path is proven. → round-5 uc10.

New gaps identified in review are added here with date and source, then batched into the next pre-registration.