# Role-oriented agent architecture — decision brief

## Purpose and status

Record the user-confirmed successor direction for the agent architecture before preparing a replacement implementation packet. This brief is planning context and a traceable decision record. It does not alter frozen predecessor packets, select a provider or model, create a task, launch an agent, permit a repository mutation, or authorize implementation. `startsWork: false`.

This direction replaces the fixed construction-time role-to-model bindings as the intended basis for a later successor packet. The accepted historical binding packet and its reviews remain preserved provenance; they do not establish the future runtime roster, model route, or delegation policy.

## Confirmed role architecture

| Role identifier | Boundary and responsibility | User interaction | Default tool boundary |
| --- | --- | --- | --- |
| `implementer` | Owns the user request, implementation planning, task maintenance, delegation, validation, integration, delivery status, and escalation. | The only user-facing role. | Task-admitted implementation capabilities only. |
| `planning-adviser` | Answers bounded planning, design, risk, or implementation questions asked by the implementer. It has no plan, task, implementation, integration, or completion authority. | Never contacts the user. | No repository read, write, edit, shell, or ambient project-context capability. |
| `external-adviser` | Provides read-only advisory challenge, alternatives, or risk input when consulted by another role. It reduces blind spots but does not create a review gate by its existence. | Never contacts the user. | No repository read, write, edit, shell, delegation, approval, validation, integration, or closure capability. |
| `worker` | Performs one bounded implementation subtask admitted by the implementer, reports progress, requests clarification, validates within the assigned scope, and returns a structured result. | Never contacts the user. | Only the task-admitted implementation capabilities and paths. |

Role identity, authority, capability, and model selection are independent facts. Repository-facing agent names must express these role identifiers rather than a model name. `Terra`, `Sol`, `Luna`, and `Kimi` are candidate model-family or routing labels only; they are not role IDs, authority grants, or durable worker identities.

The implementer owns task implementation planning and maintenance. The planning-adviser advises only on the context that the implementer supplies. It does not inspect the repository or independently construct, admit, maintain, or revise a task plan.

## Communication and advisory flow

The default communication transport is a live, bidirectional, brokered channel rather than a durable file handoff:

```text
user <-> implementer
implementer <-> planning-adviser
implementer <-> worker
implementer <-> external-adviser
planning-adviser <-> external-adviser
worker <-> external-adviser
```

Only the implementer presents questions, material alternatives, status, and results to the user. A worker may ask the implementer for clarification and may send progress or a result. The planning-adviser may ask the implementer for missing context. The external-adviser returns advice only to the role that consulted it.

Any role may consult the external-adviser when bounded external challenge is useful. The consulting role selects the minimum relevant request and response context to forward. Advice remains non-authoritative: it cannot approve, veto, admit, launch, validate, integrate, close, or otherwise change task state. A later task policy may require consultation for named risk conditions, but consultation is not a universal gate by default.

## Traceability and recovery

Live communication must remain traceable after the fact without making durable file exchange the ordinary transport. The broker records an append-only, non-authoritative communication trace in private runtime state for every inter-role exchange. Each trace record includes:

- immutable communication, correlation, task-revision, and attempt identifiers;
- sender and recipient role identifiers;
- request and response timestamps, delivery state, and any cancellation or failure observation;
- selected context provenance, redaction/selection statement, and content digest;
- requested and effective provider, model, and thinking-level selection;
- input, output, cache, cost, wall-clock, retry, and budget observations when available; and
- a bounded outcome, question, or result classification and its parent correlation.

The exact retained message payload or a secure private reference to it is required when audit or recovery policy requires later reconstruction; otherwise the trace keeps the selected-context and content digests plus the bounded outcome. The component task record remains authoritative for material decisions, admission, validation, status, integration, and completion. It records the relevant trace identifiers and concise disposition rather than duplicating full conversations. Private traces are observability and recovery evidence only; loss or unavailability cannot create, alter, or infer task authority.

## Model and thinking selection

Every role invocation may select an approved provider/model at call time. A call may use the role default or an allowed override; no role is permanently bound to a Terra, Sol, Luna, or Kimi model selection. The requested selection, effective selection, and selection rationale are trace facts.

The default thinking level is `high`. A caller may request an allowed override. The runtime clamps the effective level to the selected model's supported capabilities and records the result. A model swap does not change the role's authority, tool boundary, communication rights, or task scope.

Delegation and model selection remain subject to approved role/model pools, task budgets, concurrency limits, protected-input policy, and explicit fallback rules. An unavailable model, unsupported thinking level, absent budget, or disallowed override blocks the call; it does not silently select a substitute.

## Required successor work

Before a new implementation packet or live runtime is prepared:

1. Define the broker protocol, private trace retention/redaction policy, recovery behavior, and task-record trace reference without creating a second task authority.
2. Define the four role contracts and call-time model policy, including the `high` thinking default and capability clamp behavior.
3. Define the implementer's admission envelope for a worker: scope, writable paths, validation, budget, cancellation, result handoff, and integration boundary.
4. Define the planning-adviser and external-adviser as context-supplied, tool-free advisory roles.
5. Resolve exact provider/model candidates, holders, budgets, capability declarations, and model-selection evidence at the applicable gate; do not infer them from historical labels.
6. Define deterministic tests for denied model overrides, unauthorized communication edges, missing trace events, trace-to-task-reference integrity, worker scope violations, cancellation, and recovery.

The existing candidate implementation packet readiness brief is a predecessor readiness record for the fixed construction binding. A successor readiness decision must apply this role-oriented architecture before implementation planning resumes.

## Decision summary

The user interacts only with the `implementer`. The implementer owns implementation planning and task maintenance; the `planning-adviser` answers its bounded questions; the `worker` implements admitted subtasks; and the `external-adviser` supplies optional, non-authoritative blind-spot reduction to any consulting role. Communication is live and bidirectional by default, with private post-fact traceability and durable task-level references for material outcomes. Models are selected per call within policy, with `high` as the default thinking level and recorded overrides.

`startsWork: false`
