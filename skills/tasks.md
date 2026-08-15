# Task

## Requirement
Implement the selected `skills:deterministic-skills` backlog item as one focused reusable skill component. Define a bounded procedure for inspecting repeatable flows, optionally using attributable execution evidence, distinguishing deterministic candidates from intentional generative judgment, selecting the correct owner, and recording a bounded backlog item or explicitly authorized task. Preserve existing authority in components, task records, agents, orchestrators, maintenance, execution-evidence, verification, and backlog management. Do not change runtime behavior or retrofit existing skills in this task.

## Plan
1. Review the selected backlog item, skills component record, applicable instructions, naming and structuring guidance, maintenance, execution-evidence, verification, and backlog contracts.
2. Choose the smallest accurate skill name and component shape; create the durable record and reusable `SKILL.md` with focused inputs, procedure, outputs, boundaries, checks, and escalation conditions.
3. Add one discoverability entry to `skills/as-is.md` and preserve existing skill authority; do not add agent front matter or runtime tooling.
4. Validate front matter, content/navigation, catalog links, no-soft-wrap, JSON/task record, and whitespace contracts; obtain final read-only expert review.
5. Record completion evidence, commit the scoped durable handoff, reconcile exact identity `skills:deterministic-skills`, remove transient task artifacts, and pause.

## Scope
In scope: new `skills/deterministic-skills/` skill record and `SKILL.md`, `skills/as-is.md` catalog entry, `skills/backlog.md`, `skills/changelog.md`, local `skills/as-is.json`, and configured `skills/tasks.md`. Read-only context may include existing skills, agents, designs, and docs. Out of scope: existing skill rewrites, agent prompts/front matter, tools, modules, runtime behavior, task-control, execution instrumentation, backlog procedure changes, and descendants.

## Acceptance
- The new skill has accurate lowercase-kebab naming and a strict `# deterministic-skills - as-is` durable record with discoverable catalog navigation.
- `SKILL.md` defines bounded inputs, evidence sources and provenance, deterministic-candidate criteria, intentional-generative preservation, owner selection, outputs, authority boundaries, validation, and escalation; it does not become a caller or task authority.
- Existing `maintaining-components`, `exploring-execution-evidence`, `verification-discipline`, and `managing-backlog` remain authoritative for their concerns and are composed by link rather than copied.
- Focused documentation/content, catalog/link, task-record, JSON, and whitespace validation passes; final expert review says safe to commit; no descendants are authorized.
- Exact `skills:deterministic-skills` completion evidence is recorded and only that backlog row is reconciled.

## Progress
Started from clean committed baseline `01d767c`. Selected the highest available open skills item, `deterministic-skills`, after confirming no active task remained. Added the new `skills/deterministic-skills/` component with a focused procedure, durable record, and catalog navigation. The procedure composes adjacent skills by link and preserves their authority; no existing skill, agent, tool, module, or runtime behavior changed.

## Validation
Passed: `python3 components/task-record-validator/task_record_validator.py skills` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool skills/as-is.json` passed; `git diff --check` passed; and a focused contract audit confirmed the required inputs, procedure, outputs, boundaries, checks, escalation, and adjacent-skill composition. No live model or trace query was required for this documentation-only skill creation. Final read-only expert review completed: safe to commit; no blocker.

## Result
The deterministic-skills component and catalog entry satisfy the selected acceptance. The task is terminal `completed`; descendant closure is vacuous because no descendants were authorized.

## Blockers And Escalations
No blocker currently. Escalate if the procedure would need to select or authorize work, mutate task/backlog state, inspect unscoped execution evidence, or alter existing skill authority.

## Recovery
If naming or ownership is ambiguous, retain the task active and record the evidence rather than creating a generic skill. If validation fails, restore only the new skill and catalog/task changes; do not modify existing neighboring skills or runtime surfaces.

## Next Action
Record the concise completion summary, commit the scoped durable handoff, reconcile `skills:deterministic-skills`, remove transient task artifacts, and pause.
