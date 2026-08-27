# Expert Review — Blocker Resolution Plan Draft 1

Purpose: Record a bounded read-only review of the first blocker-resolution plan for the agentic-development-system pilot.

## Review scope

Reviewed artifact: `drafts/agentic-development-system/quarantine/agentic-development-system-blocker-resolution-plan-draft1.md`.

The review checked whether the plan:

- explains the reasons and evidence impacts of the material pilot exclusions;
- gives honest conditions for later inclusion without creating automatic follow-on authority;
- accurately explains the `core/contracts` collection and preserves current ownership;
- proposes bounded resolutions for scope-preserving child integration and plan-readiness/child admission; and
- keeps planning proposals distinct from implementation evidence and authorization.

The review was read-only and advisory. It did not approve the target design, clear implementation blockers, create a task, appoint runtime workers, authorize kick-off, authorize implementation, or authorize a commit.

## Findings

### Supported repairs

1. **Clarify integration-result terminology.** Draft 1 described the child as recording `integrated`, `blocked`, or `recovery-required` without saying whether these were task statuses or evidence dispositions. The current task protocol has a fixed status set and does not include `integrated` or `recovery-required`. Draft 2 should state that these are proposed integration-result or handoff-disposition values, while durable task-status transitions remain governed by the current task-control protocol until a later authorized, consumer-backed implementation establishes compatible representation and behavior.
2. **Qualify the proposed use of `ready`.** Draft 1 stated that `ready` represents admitted work. The current protocol uses `ready`, but does not establish that every `ready` record proves the proposed plan-readiness decision. Draft 2 should state that a later implementation may retain `ready` for an admitted child only when the readiness result/checkpoint is represented and validated compatibly; until then, `ready` retains its current protocol meaning and is not by itself proof of target plan-readiness admission.

## Non-blocking notes

- The exclusion table clearly connects each exclusion to confounding risk, the claims the pilot cannot support, and capability-specific follow-on conditions.
- The inclusion policy appropriately requires separate ownership, inputs, approval, acceptance, validation, recovery, and evidence. It does not imply that follow-on work happens automatically.
- The `core/contracts` explanation correctly presents the directory as a normative-document home rather than a runtime authority, API, registry, task manager, or host adapter. It preserves task-control, process-adapter, launcher, observability, configuration-consumer, and component-builder ownership.
- The two blocker resolutions are appropriately framed as provisional planning resolutions. They include preconditions, failure dispositions, recovery expectations, and future behavioral evidence, while preserving current parent-side integration and current task-control authority.

## Disposition

Draft 1 has two supported terminology repairs. No broader repair is supported within the bounded review scope. Draft 2 is the successor candidate and must be treated as non-executable until its exact contents receive any required bounded review and separate task/kick-off authority is granted.
