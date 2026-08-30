# Construction-agent model selection revision — decision brief

## Purpose

Record the current user's requested model substitutions for the next construction-agent/model-binding successor. This record preserves the accepted Draft-1 packet unchanged and supplies the user-directed model identifiers for a fresh packet; it does not select a provider route, establish model availability or capability, create custom agent artifacts, or authorize execution.

`startsWork: false`

## User-directed successor bindings

| Construction profile responsibility | Draft-1 model identifier | Successor model identifier | Selection state |
| --- | --- | --- | --- |
| Terra: coding/application planning, advice, and disclosed non-independent result review | `openai/gpt-5.6-terra` | `google/gemini-3-7-flash` | User-directed selection for the successor packet; runtime route, availability, capability, holder, and budget remain gate-time facts |
| Terra: agents/skills implementation | `openai/gpt-5.6-terra` | `google/gemini-3-7-flash` | User-directed selection for the successor packet; runtime route, availability, capability, holder, and budget remain gate-time facts |
| Luna: coding/application implementation | `openai/gpt-5.6-luna` | `z-ai/glm-5.3-flash` | User-directed selection for the successor packet; runtime route, availability, capability, holder, and budget remain gate-time facts |

The responsibility assignments are unchanged: Terra remains the coding/application planner/adviser and disclosed non-independent result reviewer, and implements agents/skills work; Luna remains the coding/application implementation profile. Sol's agents/skills planning/advice and non-independent result-review assignment and Kimi's external agents/skills exact-plan review assignment are unchanged by this decision.

## Preserved boundaries

- `drafts/agentic-development-system-construction-agent-model-binding-draft1/` and its freeze, review, and Human Review acceptance remain immutable historical planning evidence.
- The substituted identifiers apply only to a future successor packet. They do not revise Draft 1 in place or select permanent target roles.
- No provider route is inferred from historical OpenRouter observations or current repository configuration. The successor must name and confirm its exact provider route at the applicable gate.
- Neither identifier is an availability, suitability, capability, holder, credential, budget, tool, or launch proof. A missing or contradictory fact blocks the affected profile; it does not permit a fallback to current implementation or to another model.
- The independent candidate boundary on `implementing-composable-skills` remains required. Current component-builder, task-control, control-plane, budget, launcher, task-record, adapter, and fixture implementation remain bootstrap governance or later benchmark baseline only, never candidate behavior.

## Required successor work

Prepare a fresh construction-agent/model-binding Draft 2 packet that incorporates these model selections, exact profile artifacts, provider routes, holders, capabilities, budgets, protected inputs, validators, recovery boundaries, and review assignments. Freeze it with a new manifest and caller-computed digest, then apply the accepted coding/application and agents/skills review paths and obtain fresh Human Review before candidate-boundary or implementation planning relies on it.

This decision does not authorize a provider call, model availability probe, profile launch, task creation, candidate implementation, benchmark, migration, adoption, retirement, commit, or merge.

`startsWork: false`
