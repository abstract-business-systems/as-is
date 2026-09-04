# Full-flow adjudication record — accumulated flags 1–7 (user rulings, 2026-08-30)

Branch `implementing-composable-skills`. This record closes the pending-decision list in `handoffs/agentic-development-system-continuity-checklist.md` section 9. Each ruling below is a user design decision made in session; the side-by-side evidence files remain the historical record of what was flagged and never silently normalized.

## Flag dispositions and applied changes

| Flag | Ruling | Applied change |
| --- | --- | --- |
| 1 Terminal-stop clarifier inconsistency | Strip to verbatim stops (recommendation accepted) | `applying-bounded-edits`: appended "The stop is terminal: …" sentence removed; `choosing-change-methods`: terminal-stop clarifier bullet removed. Remaining pilot bullets (selection criterion, missing-capability rule, composition note) were not part of the flagged class and remain, as recorded in the pilot side-by-side documents. |
| 2 Description fit-phrase variance | Normalize to trigger style ("Use when…") | Descriptions rewritten for 14 reusable + all 12 master skills; fit/no-grant clauses preserved (fidelity check 3 semantics intact). |
| 3 Heading-level variance | Align to `##` (23 of 24 already used it) | `applying-bounded-edits` re-leveled `###`/`####` → `##`. |
| 4 Masters named in composition tables | **Masters may reuse masters** (user: "masters can reuse masters") | No artifact change; the draft's "Preferred reusable skills" column naming `implementing-tasks`/`managing-changelogs` is adjudicated as intended design, not an anomaly. |
| 5 building-components dual compositions | Skills-draft workflow example governs for the candidate catalog | Precedence note added to `candidate/skills/master/building-components/SKILL.md`; target-design text composition retained as named alternative binding at adoption time (target-design:89). |
| 6 Thin contracts | See rulings below | Per-item rulings recorded; only 6.4 changed artifacts. |
| 7 Working names | Retain `as-is-orchestrator` / `design-prototyper` | No change; revisit at adoption-time agent-contract review. |

## Flag 6 rulings (verbatim intent)

- **6.1 Escalation** is defined at the agent level. Each agent decides: resolve by itself, ask the advisor (`execution-advisor`, `expert` in the target roster), or escalate to its caller. Skills stay silent on the target; agent files carry the policy.
- **6.2 Cross-scope combining** never happens, apart from the parent component-builder injecting plans into children (the sanctioned parent→child flow).
- **6.3 Determinism** is inferred from the content of the skill or by analyzing traces; no fixed taxonomy in the contract.
- **6.4 Rendering** is like linting for code — a validation concern. `rendering-diagrams` is folded into `designing-diagrams` as a "Rendering validation" subsection. Reusable roster 24 → 23; `candidate/skills/reusable/rendering-diagrams/` removed via `git rm` (recoverable; contract text preserved verbatim in the subsection).
- **6.5.1 Delegation record** (advisory consult recorded in session): the child's component task record is the record of authority; the launcher registry is mechanical execution evidence only (adviser recommendation per `core/contracts/component-task-record-protocol.md` "Task Metadata" and `skills/spawning-pi-subagents/SKILL.md` registry best-effort semantics; user ratified).
- **6.5.2 Budget units**: the caller's responsibility — the skill stays unit-agnostic; the caller's harness declares units.
- **6.6 "Recommend only when justified"**: inference — the presenting agent's own criteria, recorded alongside the recommendation (same pattern as 6.3).
- **6.7 Backlog cleanup + commit message style**: inferred at runtime from repository conventions.

## Open design item (from this session, benchmark evidence)

**Mermaid design views**: no evidence was found that diagrams help models apply skills (the only citation in walk-through records is negative: the `building-context` diagram exposed a gap rather than guiding behavior). User decision: drop them if they don't help. Disposition: a no-diagram candidate arm is included in the benchmark round 2 pre-registration (`candidate/benchmark/pre-registration-v2.md`, pending recorded user acceptance); the drop decision will be made on that evidence.

## Evidence-integrity correction

`candidate/benchmark/results/workflow-comparison-2026-08-30/scoring.md` line 4 (between the rubric header and the baseline table) was garbled dictation text accidentally committed: "So this is a priority for the dictation editer which is built in press program, so and do not insulated whether in the input will be garrad, then a reschool is not input." Removed in this pass (quoted here verbatim for the record); scores, tables, and evidence were untouched and remain authoritative.

## Authorized departures from draft fidelity

The post-adjudication candidate catalog intentionally departs from `drafts/composable-skills.md` in these recorded ways: descriptions normalized (flag 2), heading levels aligned (flag 3), pilot clarifiers stripped (flag 1 — this *restores* verbatim), `rendering-diagrams` folded into `designing-diagrams` as a subsection (6.4), `building-components` precedence note added (5). Mermaid design-view blocks remain byte-equal to the draft everywhere (check 12); Purpose/Approach/How clauses remain verbatim (check 1). Fidelity re-run: `adjudication-fidelity-rerun-2026-08-30.log` alongside this record.

## Correction during round-2 execution setup (flag 3)

`choosing-change-methods` carried a residual `#### Design view` heading the original flag-3 pass missed (the side-by-side had flagged only `applying-bounded-edits`). Aligned to `##` on 2026-08-30 during round-2 execution setup; fidelity check re-run: pass=12 fail=0 (`adjudication-fidelity-rerun-2026-08-30.log` appended). This affects the no-diagrams variant derivation, so the setup script strips Design-view sections at any heading level (`#{2,4}`).
