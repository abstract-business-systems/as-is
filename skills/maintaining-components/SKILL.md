---
name: maintaining-components
description: Maintains and improves one bounded component through evidence-based housekeeping and targeted changes. Use when reviewing a component for stale, redundant, inconsistent, costly, or unnecessarily nondeterministic work.
---

# Maintaining Components

Maintain a component as a bounded unit of work. Preserve useful behavior and
durable context while removing avoidable maintenance cost, inconsistency, and
unnecessary nondeterminism.

## Method

1. Read the component's `as-is.md`, applicable permanent specifications, and the
   smallest necessary implementation context.
2. Identify concrete maintenance signals: stale or superseded material, duplicate
   knowledge, inconsistent conventions, missing validation, avoidable manual
   repetition, recovery gaps, or a nondeterministic flow where repeatable
   behavior is required.
3. State the specific maintenance need, affected artifacts, acceptance
   conditions, and residual risk in the component task record before changing
   the component.
4. Select the smallest suitable improvement. Compose existing focused skills for
   naming, structuring, verification, setup, and committing rather than
   duplicating their methods.
5. Replace a nondeterministic flow with deterministic behavior only when a
   concrete correctness, cost, recovery, or repeatability benefit is supported
   by evidence. Preserve intentional generative work and validate any changed
   behavior against its requirement.
6. Validate the resulting component with the smallest relevant checks. Record
   observations, inferred conclusions, residual risk, recovery state, and next
   action before completing the task.

## Boundaries

- Work only within the assigned component directory unless the requirement names
  an external dependency or the user authorizes broader access.
- Do not turn a housekeeping task into an unbounded refactor or generic
  framework.
- Escalate a cross-component concern to the nearest common ancestor task.
- Do not claim that deterministic behavior is inherently superior; assess the
  component's actual acceptance conditions and operating risk.

## Quality Checks

- Every change addresses a recorded maintenance signal and acceptance condition.
- Existing focused skills are reused rather than copied into this skill.
- A deterministic replacement has observable benefit and relevant validation.
- Intentional generative behavior is retained when it serves the component.
- Completion evidence and residual risk are recorded in the component task
  record.
