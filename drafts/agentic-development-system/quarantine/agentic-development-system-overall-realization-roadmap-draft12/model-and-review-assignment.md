# Agentic Development System — Overall Realization Roadmap — Draft 12 — Model and Review Assignment
Purpose: Record the corrected construction-time assignments while keeping planning, consultation, review, validation, model identity, integration ownership, and authority separate.

## Packet status and boundary

Packet identity: `drafts/agentic-development-system-overall-realization-roadmap-draft12/model-and-review-assignment.md`.

Status: proposed construction assignment within the exact overall-roadmap Draft 12 packet; not a permanent target roster, task record, contract adoption, implementation authorization, benchmark authorization, or merge authorization.

The accepted high-level-design Draft 11 uses purpose-based roles with replaceable model identities. This document applies only to the two top-level construction flows and their derived packets.

## Construction assignment matrix

| Function | Coding/application flow | Agents/skills flow |
| --- | --- | --- |
| Accountable plan author | Terra | Sol |
| Planning consultation | Sol is not directly involved by default. Terra may optionally request architecture advice when needed and records identity, scope, advice, limitations, disposition, and any revision. | Sol may record bounded specialist advice, but it does not change Sol’s authorship or replace required Kimi review. |
| Implementation author | Luna | Terra |
| Implementation adviser | Terra | Sol |
| Plan review path | No Sol plan review and no Kimi role. No replacement model reviewer is invented. | Sol freezes the plan and seeks external Kimi review of that same exact revision. Sol is the author, not a separate reviewer. |
| Human decision | The authorized human decides the exact frozen Terra plan before implementation. | After Kimi review, the authorized human decides the same exact frozen Sol plan before implementation. |
| Deterministic validator | Separate protected code-owned checks selected for the admitted task | Separate protected code-owned checks selected for the admitted task |
| Implementation-result reviewer | Terra reviews Luna’s actual result | Sol reviews Terra’s actual result |
| Result-review independence | Non-independent because Terra authored the plan and advised implementation | Non-independent because Sol authored the plan and advised implementation |
| Independent result review | Added only when risk, architecture, security, external effects, disagreement, or policy requires it | Added only under the same triggers |
| Integration or receiving owner | Current applicable component and task owner until a separately validated target transition is adopted | Current applicable component and task owner until a separately validated target transition is adopted |
| Kimi scope | None: no planning, review, implementation, validation, result-review, integration, or closure role | Required only for external review of the exact frozen agents/skills top-level plan; not a default result reviewer or authority |
| Model evidence | Terra is a construction label with historical observations; no reliable Luna model ID is established | Sol and Kimi have historical observations that do not select exact future identities |

## Top-level and derived scope

“Both plans” means exactly:

1. the coding/application top-level plan; and
2. the agents/skills top-level plan.

Derived child packets inherit the controls of their applicable top-level plan. They do not automatically receive Kimi review.

A material change to the coding/application top-level plan requires a newly identified Terra plan and Human Review through the coding path, without creating a Sol or Kimi plan-review gate.

A material change to the agents/skills top-level plan requires a newly identified Sol plan, Kimi review of that same exact revision, and Human Review.

## Review and independence rules

- Optional Sol coding consultation is architecture advice only and must not be represented as authorship, planning participation, approval, plan review, implementation advice, or independent review.
- Terra’s coding result review must disclose Terra’s plan authorship and implementation-advice relationship and be labelled non-independent.
- Sol’s agents/skills result review must disclose Sol’s plan authorship and implementation-advice relationship and be labelled non-independent.
- Sol does not separately review the agents/skills plan Sol authored; Kimi supplies the required external plan challenge.
- Kimi review is advisory and cannot approve the agents/skills plan, authorize implementation, validate deterministic behavior, integrate a result, or close a task.
- Kimi has no coding/application role and is not required to review implementation results.
- Deterministic validation remains separate from planning advice, plan review, semantic result review, model confidence, process exit, and integration.
- A required independent result reviewer should be distinct from the implementation author, plan author or adviser, integration owner, and protected-control owner where practicable.
- A material disagreement, design change, reviewer conflict, or unavailable required check stops the affected flow at a recoverable checkpoint.

## Current configuration and historical model evidence

| Configuration evidence | Current value |
| --- | --- |
| Provider default | `openrouter` |
| `small` alias | `@preset/abs-small` |
| `medium` alias | `@preset/abs-medium` |
| `large` alias | `@preset/abs-large` |
| `xlarge` alias | `@preset/abs-xlarge` |
| Maximum concurrent tasks | `1` |

Current role files and presets are live configuration, not exact construction assignments.

Historical bounded observations include:

- `openai/gpt-5.6-sol` through OpenRouter for Sol;
- `openai/gpt-5.6-terra` through OpenRouter for Terra; and
- `moonshotai/kimi-k3` through OpenRouter for Kimi.

These observations are historical evidence only. They do not establish future availability, suitability, independence, exact route, budget, capability, or authority. No sufficiently reliable durable evidence selects a Luna model ID. Do not invent one.

## Kick-off and admission facts

Exact model IDs, provider routes, budgets, capabilities, human holders, validators, review scopes, protected inputs, integration owners, recovery, escalation, and stop conditions remain unselected until the applicable plan-review, Human Review, kick-off, or task-admission gate.

Before coding/application implementation:

- identify the exact human-decided Terra plan;
- record optional Sol architecture consultation if used;
- confirm that no Sol or Kimi coding-plan review is asserted;
- name Luna’s exact task-level identity and admitted capabilities;
- name Terra’s advice and disclosed non-independent result-review scope;
- identify deterministic checks, integration owner, independent-review triggers, recovery, and stop conditions; and
- obtain separate kick-off and task-control admission.

Before agents/skills implementation:

- identify the exact frozen Sol plan;
- record Kimi review of that same exact revision;
- record the Human Review decision on that revision;
- name Terra’s exact task-level identity and admitted capabilities;
- name Sol’s advice and disclosed non-independent result-review scope;
- identify deterministic checks, integration owner, independent-review triggers, recovery, and stop conditions; and
- obtain separate kick-off and task-control admission.

## Authority boundary

Model identity, role identity, authorship, consultation, review, validation, integration ownership, and human decision authority are separate. No model, reviewer, preset, process exit, or successful check may approve its own assignment or acquire authority by being named Terra, Luna, Sol, or Kimi.

Until exact kick-off and admission facts are recorded, all assignments remain planning recommendations only.

startsWork: false
===== END ARTIFACT C: model-and-review-assignment.md =====
