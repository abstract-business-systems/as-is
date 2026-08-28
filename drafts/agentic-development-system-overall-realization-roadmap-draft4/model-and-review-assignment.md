# Agentic Development System — Model and Review Assignment
Purpose: Recommend first-pilot operational responsibilities while keeping model identity, authority, and task admission separate.

## Status and use

Status: proposed operational companion to Draft 4; not part of the exact four-file planning-decision packet and not an assignment, task record, contract adoption, or implementation authorization.

Current project configuration uses provider `openrouter` and these aliases:

| Alias | Configured preset |
| --- | --- |
| `small` | `@preset/abs-small` |
| `medium` | `@preset/abs-medium` |
| `large` | `@preset/abs-large` |
| `xlarge` | `@preset/abs-xlarge` |

An alias or named model is routing configuration, not role or authority. Exact task-level model IDs, provider routes, budgets, capabilities, human holders, and accountable owners must be set and admitted at kick-off.

## First-slice assignment matrix

| Function | Responsibility | Current configured role/default | Proposed first-slice use | Named-model evidence or proposal | Authority | Selection status and required evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Design/planning/advice author | Convert the accepted envelope into bounded plans, dependencies, acceptance, recovery, and decision briefs without changing target architecture. | No live design-agent contract exists. Current `component-builder` may plan its authorized component using `medium` → `@preset/abs-medium`; `expert` provides read-only advice using `large` → `@preset/abs-large`. | The authorized planning owner authors. Use a separate `expert` for advice. Do not let the adviser become task or design-acceptance authority. | Historical Terra used `openai/gpt-5.6-terra` through the read-only `expert` contract. For the first slice it may be explicitly proposed as the advisory model if available, but historical use alone does not select it. | Planning authority comes from the accepted envelope, accountable owner, and applicable task/planning record. Human acceptance remains human-only. | **Not selected.** At kick-off name the author, adviser if any, exact model, provider route, budget, scope, and expected plan evidence. |
| Implementation worker or child builder | Perform one admitted bounded implementation, add or update tests, run required checks, stop on contradiction, and return evidence. | `worker`: `medium` → `@preset/abs-medium`. `component-builder`: `medium` → `@preset/abs-medium`. | Prefer the lower-cost `worker` for bounded leaf implementation where the current task contract permits it. Use a fresh child-scoped `component-builder` when separately owned component planning, child authority, validation, recovery, or delegation obligations require that role. | Historical “Luna” denotes a proposed implementation function, but the named sources do not establish a supported permanent Luna model ID. No named model is proposed here. | Only the admitted task and role contract authorize implementation. The worker cannot self-approve, widen scope, or gain authority from its model. | **Role and model not selected.** Draft 6 explicitly leaves workers and numerical budgets to later task packets and admission. |
| Deterministic evidence validator | Inspect protected controlled-worktree evidence and run only admitted code-owned fixed checks. | `evidence-validator`: `large` → `@preset/abs-large`. | Assign separately from the implementation worker. Keep validators, expected outcomes, and protected controls outside worker write scope. | No historical named model is necessary or selected. Determinism comes from fixed checks and protected evidence, not the reviewer model. | Read-only evidence assessment; no mutation, task admission, semantic integration, human acceptance, or completion authority. | **Role recommended; holder and exact model unselected.** Kick-off must name the validator, fixed checks, evidence scope, and unavailable-evidence behavior. |
| Semantic/result reviewer | Compare the actual result with accepted design, task acceptance, scope, and residual risk; identify unsupported completion claims. | `expert`: `large` → `@preset/abs-large`; `evidence-validator` also uses `large` but has a narrower fixed-evidence contract. | Use an independent `expert` for semantic review, or a separately admitted evidence-review role where the review is fully covered by its contract. Keep the reviewer distinct from the implementation worker. | Historical Terra performed ordinary planning/review advice; this is evidence of possible fit, not a standing assignment. No named reviewer model is selected. | Advisory/read-only unless an adopted task contract explicitly assigns a bounded result-disposition role. Review does not integrate or authorize completion by itself. | **Not selected.** Record reviewer independence, reviewed revision, actual evidence, conflicts, recommendation, and residual risk at kick-off. |
| Architecture/high-risk reviewer | Challenge architecture, authority, safety, cross-component boundaries, irreversible effects, or material target-envelope changes. | `expert`: `large` → `@preset/abs-large`. | Assign only when the task risk or discovered change requires architecture/high-risk review. | `openai/gpt-5.6-sol` is the supported historical Sol reviewer model observation. Propose it only through an explicit bounded Sol assignment; do not treat “Sol” as a permanent target role. | Advisory only. It cannot approve architecture, adopt contracts, authorize implementation, or override the human or owning component. | **Conditional and unselected.** Kick-off or escalation must state the triggering risk, exact model, review scope, budget, and decision recipient. |
| Integration/receiving owner | Protect unrelated work, decide or execute integration within current authority, preserve ancestry and recovery evidence, and account for descendant outcomes. | Current `component-builder`: `medium` → `@preset/abs-medium`, with receiving-builder semantic review and parent-side integration. | Preserve current receiving-owner authority until a separately accepted and validated transition exists. Draft 6 may implement candidate mechanical child-result application only after the process-adapter owner accepts the boundary. | No named model is selected. The accepted draft-11 target proposes child-owned validation/integration and parent accounting, which conflicts with current behavior and remains a migration dependency. | Authority comes from current component/task contracts or a later adopted successor, never from model identity. A host adapter has mechanical responsibility only. | **Current owner boundary applies; target holder unresolved.** Kick-off must name the receiving owner, integration mode, protected scope, conflict handling, validation, and recovery. |
| Evaluation/scoring owner | Freeze seed, revisions, model/configuration, cases, rubric, validators, scorer, thresholds, permitted differences, and results; keep controls outside candidate write scope. | No permanent agent/model assignment is configured. `expert` may advise using `large`; deterministic scoring should be code-owned where feasible. | Appoint an independent accountable evaluation/scoring owner distinct from candidate implementation and protected-control writers. Semantic cell review must remain separate where the scorer aggregates judgments. | Historical records propose independent evaluation ownership but no permanent named model. No named model is selected. | The owner controls the approved evaluation protocol and evidence, not target adoption or merge. Advancement remains a separate human decision. | **Not selected.** Before benchmark approval name the owner, human approver, exact model/configuration if used, provider route, budget, protected controls, scoring version, and conflict rules. |
| Alternate-family reviewer | Supply bounded dissent when explicitly requested or when a newly identified risk justifies independent family evidence. | No current permanent target role or gate. | Do not assign for the Draft-4 correction or by default for the first pilot. | Historical transitional reviews used `moonshotai/kimi-k3` through `openrouter`. This does not establish permanent independence, suitability, or authority. | Read-only advisory review only. It cannot approve, authorize, integrate, score its own work, or become a lifecycle prerequisite by precedent. | **Not selected and not required.** Use only after explicit request or a documented new justification, with exact identity, scope, budget, and review recipient. |

## Practical first-pilot recommendation

Use three separated operational functions:

1. **Plan/advice:** the authorized planning owner prepares the bounded first-slice packet. If additional advice is needed, use the read-only `expert` role; `openai/gpt-5.6-terra` is a proposed task-specific option supported by historical advisory use, not a current default or authority holder.
2. **Implement:** use the least costly role that satisfies the task boundary—`worker` for a bounded leaf task or a child-scoped `component-builder` for a separately owned component—using the current `medium` → `@preset/abs-medium` default unless kick-off selects and admits another exact model.
3. **Review:** use an independent `evidence-validator` for protected deterministic evidence and a separate `expert` when semantic or architecture review is required, using current `large` → `@preset/abs-large`. Use `openai/gpt-5.6-sol` only for an explicitly assigned architecture/high-risk review.

The project provider default is `openrouter`, but the exact provider route is not selected by this record. Kick-off must resolve the concrete route and model identity and must fail closed if either is unavailable or incompatible with the admitted role.

## Kick-off admission checklist

Before any implementation launch, record and admit:

- exact accepted design and plan revisions;
- task and component boundaries;
- planning owner and any advisory reviewer;
- implementation role, exact model ID, and provider route;
- deterministic validator and protected fixed checks;
- semantic or architecture reviewer where required;
- receiving/integration owner and current-versus-target integration mode;
- evaluation owner if evaluation work is in scope;
- human decision and escalation holders;
- capabilities, tools, prohibited actions, and risk profile;
- cost and wall-clock budgets, reserve, retry policy, and stop point;
- protected inputs, validation, recovery, and evidence requirements; and
- explicit confirmation that no identity, preset, caller, or review grants additional authority.

Until these facts are recorded and admitted, all listed assignments remain recommendations only.

===== END E: model-and-review-assignment.md =====
