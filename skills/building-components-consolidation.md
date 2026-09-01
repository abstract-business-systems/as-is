# Building Components Consolidation Assessment

## Purpose

Assess whether the reusable `building-components`, `maintaining-components`, and `implementing-component-tasks` skills should be consolidated without moving authority across their boundaries.

## Scope and evidence

This planning artifact compares the current skill contracts and durable records. It is not an operational procedure, task authority, backlog authority, implementation plan authorization, or replacement for any of the three linked skills.

| Subject | Current primary purpose | Distinct authority or boundary | Current composition and consumers |
| --- | --- | --- | --- |
| [`building-components`](building-components/SKILL.md) | Compose bounded component-building context, implementation, review, validation, descendant closure, recovery, and durable handoff. | A reusable composition procedure; it does not select, authorize, start, or delegate agents. The configured component-builder role retains those decisions. | Composes [`building-context`](reusable/building-context/SKILL.md), [`implementing-component-tasks`](implementing-component-tasks/SKILL.md), [`verification-discipline`](verification-discipline/SKILL.md), and [`committing-completed-work`](committing-completed-work/SKILL.md). The component-builder role invokes the procedure while retaining role authority. |
| [`maintaining-components`](maintaining-components/SKILL.md) | Identify and address stale, redundant, inconsistent, costly, or unnecessarily nondeterministic work in one bounded component. | Evidence-based housekeeping and improvement selection; it preserves intentional generative behavior and does not become an unbounded refactor or generic framework. | Composes focused naming, structuring, verification, setup, and committing skills as needed. Its backlog and task scope remain component-maintenance inputs, not a component-build lifecycle replacement. |
| [`implementing-component-tasks`](implementing-component-tasks/SKILL.md) | Execute one selected bounded component task through task-record creation, scoped implementation, child boundaries, validation, changelog handoff, cleanup, and completion reconciliation. | Task lifecycle and descendant closure: task records own active machine/human state, child boundaries require configured component-builder delegation, and completion requires acceptance evidence and terminal descendants. | Invoked by component builders and backlog/task management. It is reusable for implementation tasks and remains the lifecycle contract that `building-components` composes. |

## Overlap and retained boundaries

The skills overlap in their use of bounded scope, component context, validation, recovery, and durable handoff. That overlap is compositional rather than duplicative:

- `maintaining-components` answers **why and what housekeeping improvement is justified** from evidence; it does not own the general task lifecycle or component-builder authority.
- `implementing-component-tasks` answers **how one selected component task progresses and closes**; it does not decide that a maintenance signal exists or replace the component-builder role.
- `building-components` answers **how a component builder composes context, implementation lifecycle, validation, review, descendant handling, and handoff**; it does not absorb maintenance judgment or task authority.
- `verification-discipline` and `committing-completed-work` remain focused supporting authorities for evidence selection and scoped commit procedure; they are not candidates for merging into a broader skill from this assessment.

## Alternatives considered

| Alternative | Assessment | Decision |
| --- | --- | --- |
| Merge all three into `building-components` | Reduces file count but conflates maintenance assessment, generic task lifecycle, and builder composition. It would obscure which procedure selects a maintenance improvement, which procedure owns task closure, and which role retains delegation authority. | Reject. The cognitive and authority cost exceeds the demonstrated navigation benefit. |
| Merge `maintaining-components` into `building-components`, retain `implementing-component-tasks` | Makes maintenance a mode of building, but maintenance can conclude with a bounded backlog proposal or no-change decision and need not implement a component change. It would also make a reusable housekeeping procedure depend on builder-specific composition. | Reject absent concrete repeated duplication or a requirement that maintenance always builds. |
| Merge `implementing-component-tasks` into `building-components`, retain maintenance separately | Makes the composition skill own task lifecycle details already represented by a focused reusable contract and used beyond builder composition. It would create a larger authority-bearing-looking procedure without removing the need for the lifecycle contract. | Reject. Keep lifecycle separate and compose it. |
| Retain all three and clarify composition/navigation only when needed | Preserves semantic boundaries, existing consumers, current links, and recovery paths while avoiding an unproven abstraction or migration. | Recommend. Treat current composition as the smallest coherent design. |

## Recommendation

Retain three separate skills with their current names and ownership. Keep `building-components` as the higher-level composition procedure, `implementing-component-tasks` as the task lifecycle and child-boundary contract, and `maintaining-components` as the evidence-based housekeeping procedure. Do not merge, rename, or physically relocate them based on the current evidence.

If future work identifies concrete duplicated paragraphs, repeated validation gaps, or a consumer that cannot be served by composition, open a new bounded task naming the exact overlap, owner, acceptance, migration path, and rollback. Do not use line-count reduction or adjacent directory placement as sufficient evidence.

## Migration and consumer risk

No migration is recommended now, so there is no reference-update or compatibility alias work. A future consolidation would risk changing component-builder role behavior, child delegation boundaries, task-record cleanup ordering, changelog handoff, maintenance no-change outcomes, and scoped commit eligibility. Any future change must preserve the configured component-builder role, local task records, terminal descendant closure, recovery semantics, and existing behavioral validation.

The assessment is based on current repository-authored contracts and references, not every external or dynamically loaded consumer. Those consumers remain residual risk if a later consolidation is proposed. No runtime, agent, task protocol, tool, or host behavior is changed by this artifact.

## Links

- [`building-components/as-is.md#design`](building-components/as-is.md#design) — composition skill context.
- [`maintaining-components/as-is.md#design`](maintaining-components/as-is.md#design) — maintenance skill context.
- [`implementing-component-tasks/as-is.md#design`](implementing-component-tasks/as-is.md#design) — task lifecycle context.
- [`../designs/skills-agents-separation-plan.md`](../designs/skills-agents-separation-plan.md) — separation rationale and component-builder migration boundary.
