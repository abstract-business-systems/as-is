# Agentic Development System — Draft 10 — Model and Review Assignment
Purpose: Record the corrected construction-time assignments while keeping planning, consultation, review, validation, model identity, integration ownership, and authority separate.

## Status and boundary

Status: proposed construction assignment; not a permanent target roster, task record, contract adoption, implementation authorization, benchmark authorization, or merge authorization.

The accepted Draft-11 target uses purpose-based roles with replaceable model identities. This document applies only to the two top-level construction flows and their derived packets.

## Construction assignment matrix

| Function | Coding/application flow | Agents/skills flow |
| --- | --- | --- |
| Accountable plan author | Terra | Sol |
| Optional planning consultation | Sol may be consulted by Terra only when needed. Record identity, scope, advice, limitations, Terra’s disposition, and resulting revision. Consultation does not change Terra’s authorship. | Optional specialist consultation may be recorded if separately justified, but it does not replace the required Kimi review or change Sol’s authorship. |
| Implementation author | Luna | Terra |
| Implementation adviser | Terra | Sol |
| Plan review path | No Sol plan review. No Kimi role. No separate model reviewer is assigned beyond Terra’s planning responsibility, mandatory Human Review, and any risk-triggered independent review. | Sol freezes the plan and seeks external Kimi review of that same exact revision. Sol is the author, not a separate reviewer. A material revision after Kimi review requires review of the successor exact plan. |
| Human decision | The authorized human accepts, requests revision, defers, or rejects the exact frozen Terra plan before implementation. | After Kimi review, the authorized human accepts, requests revision, defers, or rejects the same exact frozen Sol plan before implementation. |
| Deterministic validator | Separate protected code-owned checks selected for the admitted task | Separate protected code-owned checks selected for the admitted task |
| Implementation-result reviewer | Terra reviews Luna’s actual result | Sol reviews Terra’s actual result |
| Result-review independence | Non-independent because Terra authored the plan and advised implementation | Non-independent because Sol authored the plan and advised implementation |
| Optional independent result reviewer | Add when architecture, security, external effects, material disagreement, policy, or other risk requires it | Add under the same triggers |
| Integration/receiving owner | Current applicable component/task owner until a separately validated target transition is adopted | Current applicable component/task owner until a separately validated target transition is adopted |
| Model evidence and status | Terra and Luna are construction labels. Historical Terra observations exist; no reliable Luna model ID is established. Exact identities remain unselected. | Historical Sol and Kimi observations exist. They do not select the exact plan-author, adviser, reviewer, or implementation models for this flow. |
| Kimi scope | None. Kimi has no planning, plan-review, implementation, validation, result-review, integration, or closure role. | Required only for external review of the exact frozen top-level agents/skills plan. Kimi is not a default result reviewer or integration authority. |

## Top-level and derived scope

“Both plans” means exactly:

1. the coding/application top-level flow plan; and
2. the agents/skills top-level flow plan.

Derived child packets inherit the applicable top-level plan’s controls. They do not automatically receive another Kimi review unless:

- the top-level plan changes materially;
- an explicit instruction requires Kimi for the derived scope; or
- an applicable risk process requires an independent or alternate-family review.

Coding-derived work never inherits Kimi merely because the agents/skills plan has a Kimi review requirement.

## Review and independence rules

- Optional Sol coding consultation must not be represented as authorship, approval, plan review, or independent review.
- Terra’s coding result review must disclose Terra’s planning and implementation-advice relationship and be labelled non-independent.
- Sol’s agents/skills result review must disclose Sol’s plan authorship and implementation-advice relationship and be labelled non-independent.
- Sol does not perform a separate review of the agents/skills plan that Sol authored; external Kimi review supplies the explicitly required plan challenge.
- Kimi review is advisory and cannot approve the agents/skills plan, authorize implementation, validate deterministic behavior, integrate a result, or close a task.
- Kimi is not required to review implementation results in either flow.
- Deterministic validation is independent of model confidence and remains separate from planning advice, plan review, and semantic result review.
- A risk-triggered independent result reviewer should be distinct from the implementation author, plan author/adviser, integration owner, and protected-control owner where practicable.
- A material disagreement, design change, reviewer conflict, or unavailable required check stops the affected flow at a recoverable checkpoint.

## Current configuration and model evidence

Current repository configuration records:

| Configuration evidence | Current value |
| --- | --- |
| Provider default | `openrouter` |
| `small` alias | `@preset/abs-small` |
| `medium` alias | `@preset/abs-medium` |
| `large` alias | `@preset/abs-large` |
| `xlarge` alias | `@preset/abs-xlarge` |

Current role files generally configure `medium` for `as-is`, `component-builder`, `worker`, and `execution-advisor`, and `large` for `expert`, `evidence-validator`, and `thinking-companion`. These are current live presets, not exact construction assignments.

Historical bounded observations include:

- `openai/gpt-5.6-sol` through OpenRouter for Sol;
- `openai/gpt-5.6-terra` through OpenRouter for Terra; and
- `moonshotai/kimi-k3` through OpenRouter for Kimi.

These observations are historical evidence only. They do not establish availability, suitability, independence, exact route, budget, capability, or authority for a future task. No sufficiently reliable durable evidence selects a Luna model ID. Do not invent one.

Exact model IDs, provider routes, budgets, capabilities, review scopes, human holders, validators, and integration owners are recorded at the applicable plan-review, Human Review, kick-off, or task-admission gate.

## Authority boundary

Model identity, role identity, authorship, consultation, review, validation, integration ownership, and human decision authority are separate. No model, reviewer, preset, process exit, or successful check may approve its own assignment or acquire authority by being named Terra, Luna, Sol, or Kimi.

## Admission checklist

Before coding/application implementation:

- identify the exact human-decided Terra plan;
- record optional Sol consultation if used;
- confirm no Sol or Kimi coding-plan review is asserted;
- name Luna’s exact task-level identity and admitted capabilities;
- name Terra’s advice and disclosed non-independent result-review scope;
- identify deterministic checks, integration owner, independent-review triggers, recovery, and stop conditions; and
- obtain separate kick-off and task-control admission.

Before agents/skills implementation:

- identify the exact frozen Sol plan;
- record Kimi review of that same exact revision;
- identify the human decision on that same exact plan;
- name Terra’s exact task-level identity and admitted capabilities;
- name Sol’s advice and disclosed non-independent result-review scope;
- identify deterministic checks, integration owner, independent-review triggers, recovery, and stop conditions; and
- obtain separate kick-off and task-control admission.

Until these facts are recorded and admitted, all assignments remain planning recommendations only.

startsWork: false
===== END ARTIFACT C: model-and-review-assignment.md =====
