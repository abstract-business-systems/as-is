# Agentic Development System — Draft 7 — Model and Review Assignment
Purpose: Record the construction-time coding and agents/skills assignments while keeping model identity, authority, and review independence separate.

## Status and boundary

Status: proposed construction-time assignment for review; not a permanent target roster, task record, contract adoption, implementation authorization, benchmark authorization, or merge authorization.

The accepted draft-11 target keeps purpose-based roles and replaceable model identities. This document records the user's temporary construction arrangement for two top-level flow plans only; Draft 6 remains the predecessor.

## Two-flow assignment matrix

| Function | Coding/application flow | Agents/skills flow | Independence and evidence requirement |
| --- | --- | --- | --- |
| Accountable plan author | Terra | Sol | One named author per exact plan; authorship and contributors are recorded. |
| Planning discussion/advice | Terra and Luna, with Sol participation | Sol and Terra | Advice is recorded separately from the frozen plan; material changes produce a successor. |
| Implementation author | Luna | Terra | Exact admitted role/model/route, scope, budget, capabilities, and task record are required. |
| Implementation adviser | Terra | Sol | Adviser cannot silently change scope, acceptance, architecture, protected inputs, or risk. |
| Plan reviewers before implementation | Sol + external Kimi-family reviewer | Sol + external Kimi-family reviewer | Both review the same exact frozen plan; review does not approve or authorize. Kimi is required here by user direction only. |
| Deterministic validator | Separate protected code-owned checks | Separate protected code-owned checks | Fixed checks remain independent of model confidence and plan review. |
| Implementation-result reviewer | Terra reviews Luna | Sol reviews Terra | Planner/result review is explicitly non-independent because the reviewer authored/advised the plan. |
| Additional independent result reviewer | Add when risk, architecture, security, external effects, disagreement, or policy requires it | Add under the same triggers | Must be distinct from implementation author, adviser, plan author where possible, integration owner, and protected-control owner. |
| Architecture/high-risk escalation | Sol when triggered | Sol is already adviser; add disclosed independent review when needed | Trigger, prior involvement, exact scope, and limitations are recorded. |
| Integration/receiving owner | Current applicable component/task owner until target transition is adopted | Current applicable component/task owner until target transition is adopted | Preserve current authority and record current-versus-target mode and recovery. |
| Human decision holder | User/then-current authorized human | User/then-current authorized human | Human accepts exact plan/envelope, kick-off, exceptions, advancement, adoption, retirement, and merge. |

“Both plans” means exactly the coding/application-related top-level flow plan and the agents/skills-related top-level flow plan. Derived child-task packets inherit the applicable plan's requirements and do not automatically receive another Kimi review unless the plan changes materially, an explicit instruction requires it, or an applicable risk control adds it.

## Model and provider evidence

Current repository configuration establishes provider default `openrouter` and aliases:

| Alias | Configured preset |
| --- | --- |
| `small` | `@preset/abs-small` |
| `medium` | `@preset/abs-medium` |
| `large` | `@preset/abs-large` |
| `xlarge` | `@preset/abs-xlarge` |

Current role defaults generally use `medium` for `worker` and `component-builder`, and `large` for `expert` and `evidence-validator`. These describe the live system and must not silently determine the construction assignments.

Historical named-model observations support `openai/gpt-5.6-sol`, `openai/gpt-5.6-terra`, and `moonshotai/kimi-k3` through OpenRouter in bounded reviews. No sufficiently reliable durable evidence selects a Luna model ID. Do not invent one. The exact Luna model ID, Terra model ID, Sol model ID, Kimi model ID, provider routes, budgets, capabilities, and human holders remain unselected until the applicable plan-review or kick-off admission.

Model identity, role identity, reviewer identity, and authority are separate. A model cannot approve its own plan or result merely by being named Luna, Terra, Sol, or Kimi. A review verdict is advisory unless an adopted task contract gives a bounded role, and even then it cannot replace human decisions reserved by the accepted envelope.

## Conflict safeguards

- Terra's coding-plan authorship and advice to Luna must be disclosed when Terra reviews Luna's result; label that result review non-independent.
- Sol's agents/skills-plan authorship, advice to Terra, and review of Terra's result must be disclosed; label both Sol reviews non-independent.
- Sol's participation in both plan discussions and plan review requires a fresh read-only review invocation and explicit prior-involvement disclosure.
- Kimi reviews the same exact frozen plan without treating Sol's verdict as authority; record exact identity, model, route, scope, budget, and limitations.
- A material disagreement, design change, or reviewer conflict stops the affected flow at a recoverable checkpoint and returns to the accountable planner or human as appropriate.
- Deterministic validation is separate from both model advice and semantic result review.
- An independent result reviewer is added when the risk profile requires it; Kimi plan review alone does not satisfy every result-review need.

## Kick-off admission checklist

Before either implementation flow starts, record and admit:

- exact accepted design/envelope and flow-plan revisions;
- one accountable plan author and contributors;
- Sol and Kimi plan-review records for that exact plan;
- implementation author and adviser;
- exact model IDs, provider routes, budgets, capabilities, and human holders;
- deterministic validator and protected checks;
- implementation-result reviewer and independence disclosure;
- integration/receiving owner and current-versus-target mode;
- component/task boundaries and protected inputs;
- acceptance, recovery, escalation, conflict handling, and stop conditions; and
- confirmation that no model, reviewer, preset, caller, or process exit grants authority.

Until these facts are recorded and admitted, all assignments remain recommendations only. `startsWork: false`.
