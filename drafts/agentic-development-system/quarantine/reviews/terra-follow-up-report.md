# Terra follow-up reconciliation — advisory, read-only

**Decision:** retain the live component-task control plane and add a design-governance layer around it. The user’s additional input strengthens the earlier direction:

- **Path A is the only proposed lifecycle for now.** Path B should not be used while agents can reliably distinguish current and planned design. If that distinction becomes unreliable, the safe response is to improve the records or stop/escalate—not to switch to Path B.
- The first slice may be a **mock feature**, provided it exercises the real governance loop and is not represented as product validation.
- The active implementation branch may be any approved task/workspace branch. `master` is an evaluation baseline, not the mandatory active branch.
- This report is advice only. It neither adopts contracts nor authorizes design, tasks, implementation, or external actions.

## User-input interpretation

| Input | Interpretation |
| --- | --- |
| Earlier lifecycle discussion | Treat it as selecting **Path A by default**, now strengthened to Path A-only while current and planned design can be distinguished. |
| “Base as-is documents for the entire implementation” | This needs one scope clarification: “entire implementation” should mean the complete **approved implementation unit**, not every future ambition of the system. See the proposed rule below. |
| The then-current user is reviewer | The person currently accountable for the applicable design revision reviews and aligns on it. This must be recorded per revision; it is not a permanent role assignment inferred from a model session. |
| Answer 2 governs the boundary | Implementation starts only after the approved implementation unit has its required base design records and reviewer alignment. |
| First feature can be mock | Suitable and recommended for the first safety-oriented vertical slice. It must still have an aligned design, bounded task, controlled evidence, review, stale-design rejection, and recovery exercise. |
| Path B should never be used while models distinguish current/planned | Accepted. A branch is a workspace/integration mechanism, not the sole authority for planned design. |
| “Material change” is unclear | Replace it with **design-changing feedback** and use the plain-language rule below. |
| Active branch need not be `master` | Accepted. Branch/worktree choice is task context; `master` is only a pinned comparison baseline. |
| Asked for replaced/dropped agents and skills | The matrices below cover every current live contract. No live agent or skill should be silently removed. |

## Design-completion rule

### Proposed plain-language rule

> **Design is complete for an approved implementation unit when the current and planned base design records for every component that unit will create, change, retire, or materially depend on are available, linked, and approved by the current reviewer.**
>
> **Implementation may then begin only for tasks covered by those approved records.** A missing base record, an uncovered component boundary, or design-changing feedback returns the work to design.

This does **not** require every possible future system component, later backlog capability, or every derived leaf artifact to exist before a small first slice begins. It does require the whole scope that the approved implementation unit claims to realize.

### Required user clarification

“Entire implementation” has two plausible meanings:

1. **Recommended:** the full, explicitly bounded implementation unit currently being approved—e.g., the mock-feature vertical slice, or a later defined release/migration.
2. **Stricter alternative:** the entire long-term agentic-development system before any implementation starts.

The first interpretation preserves the user’s incremental-first-slice direction and avoids pretending that content generation, general tasks, external consumption, and all specialist workflows have already been designed. The second interpretation is valid if intended, but would deliberately defer all implementation until the complete long-term design is approved.

### Root and leaf design rule

- A **root design package** and its required base component records receive explicit human alignment.
- A **derived leaf artifact**—such as a task breakdown, diagram, mock artifact, or implementation-facing detail—does not need separate direct human review merely because it exists.
- It needs direct reviewer attention if it changes what is being built, expected behavior, scope, risk, external effects, architectural boundary, acceptance meaning, or a human-visible trade-off.

## Current-versus-planned `as-is.md` rule

The live `as-is.md` contract identifies durable component purpose, design, boundaries, relationships, and navigation. It must not imply that unimplemented behavior is already current.

**Proposed representation:**

```text
## Current state
What is implemented and currently true.

## Planned target state
A clearly labelled, revisioned description or pointer to the approved target design.
Status: draft | aligned | superseded | revoked.
This is not current behavior.

## Design relationship
The root design revision, reviewer alignment, derived artifacts, and task candidates.
```

Rules:

1. **Current state remains the current architecture authority.**
2. **Planned target state is explicitly labelled and revisioned.** It may be in the relevant `as-is.md` record when concise, but a cross-component change should use one frozen root design package referenced by affected records.
3. A task references one exact aligned planned revision. An implementation worker may not edit that revision and then claim compliance with it.
4. After integration and review confirm the target has been realized, reconcile the relevant `Current state`; retain supersession history according to the repository’s durable-record policy.
5. Backlogs, changelogs, historical drafts, and model output remain context, not design/task authority.

This retains the useful Path A idea—target design drives downstream artifacts—without conflating planned and current architecture.

## Branch and baseline rule

- The active branch/worktree is selected for the bounded task and may be a feature branch, detached worktree, candidate branch, or other approved workspace. It **does not need to be `master`**.
- The aligned design revision must be durable and available to the worker from the selected committed baseline; it must not exist only in uncommitted changes or a mutable private branch.
- `master` is a **pinned evaluation baseline** for comparing the current workflow with a candidate workflow. It is not a universal task branch, approval source, or proof of completion.
- Branch merge remains an integration action. It does not imply design approval, validation, task completion, or release permission.

## Plain-language change and re-alignment rule

Use **“design-changing feedback”** instead of “material change.”

> A change needs renewed design review when it would make a reasonable reviewer answer differently to any of these questions: **What are we building? Who is it for? What must it do? What is excluded? What risks or external effects are allowed? How will we know it worked?**

Examples:

| Feedback | Disposition |
| --- | --- |
| Correct a typo, clarify a label, or specify an already implied field format | Clarification; keep the same design revision if it does not change the answers above. |
| Add a user-visible behavior, remove an acceptance condition, change supported scope, change a component boundary, or permit a new external effect | Design-changing feedback; create/revise the planned design and obtain reviewer alignment before new work launches. |
| Implementation reveals that a design cannot work as written | Stop the affected task, record the discrepancy, and return to design. Do not silently alter the design from implementation. |
| Feedback arrives after an implementation result | Treat it either as a discrepancy against the aligned design or as a new design request; do not silently append it to the completed task. |

## Mock-feature first-slice recommendation

**Recommendation:** use a deliberately small mock software feature or fixture as the first slice.

It should demonstrate:

1. A current reviewer aligns on one root design revision.
2. The design covers every base component record in the chosen slice.
3. One bounded component task links to that revision.
4. An admitted worker performs the task in an isolated worktree without credentials, network access, deployment, publication, or other external effects.
5. Deterministic checks and a semantic review inspect the actual result.
6. One stale/superseded-design launch is rejected before work begins.
7. One failure, timeout, or budget-stop result is reviewed into a recoverable state.
8. The result is compared to the aligned design and integrated only by the receiving owner.

A mock slice proves the workflow controls, not autonomous product-development quality, external-project readiness, or security isolation.

## Orchestration and escalation model

### Initial role model

| Responsibility | Initial owner | Limit |
| --- | --- | ---|
| Design/workflow orchestration and human escalation | Named applicable orchestrator; for the first single-component slice this may be `component-builder` | Must be named per workflow; it is not inferred from model identity or whichever agent received the message. |
| Human design review and alignment | Then-current accountable reviewer | Approves one revision and scope; does not automatically approve budgets, releases, credentials, or external effects. |
| Bounded implementation | `worker` or another admitted implementation role | Cannot self-accept, self-integrate, delegate, use credentials, or create external effects. |
| Deterministic evidence | Existing validators and checks; `evidence-validator` when appropriate | Produces evidence/recommendation, not integration authority. |
| Semantic result review | Receiving `component-builder` or distinct reviewer session | Must inspect actual diff/artifacts and design correspondence. |
| Integration | Receiving `component-builder` | Parent-owned; launcher exit and child commit are not completion. |
| Architecture/specialist review | Sol-equivalent advisory review, specialist, and/or accountable human as required | Advisory unless an adopted project policy grants a specific authority. |

### Escalation path

```text
worker or reviewer detects a blocker
  → immediate caller assesses only within its existing authority
  → resolve locally, block, or bubble upward
  → named workflow orchestrator consolidates the issue
  → accountable reviewer decides when human design judgment is required
```

An escalation does not grant broader tools, a budget increase, a retry, a scope change, an external effect, or an implementation authorization.

## Current live-agent disposition matrix

The current live catalog is the actual contracts under `agents/`, not the draft Sol/Terra/Luna labels.

| Live agent contract | Proposed disposition | Evidence and current consumers | Migration/adaptation path | Unresolved authority |
| --- | --- | --- | --- | --- |
| `agents/agent-capability-probe/agent.md` | **Retain, test-only** | Read-only fixture for bounded in-process capability tests. It is not listed as a normal live role in `agents/as-is.md`. | Keep isolated from production workflow selection; update only if admission-test semantics change. | Whether the test fixture needs any design-lifecycle scenario coverage. |
| `agents/as-is/agent.md` | **Retain and adapt** | Front-face router selects an admitted role/skill and explicitly does not own task lifecycle or component work. | Preserve routing boundary; add awareness of design-package status and route design governance rather than silently acting as orchestrator. | Whether a future product-level orchestrator is a separate role or an explicit assignment to an existing role. |
| `agents/component-builder/agent.md` | **Retain and adapt** | Owns bounded component delivery, child integration, recovery, semantic completion, and expert gates. | For the first slice, may be the named component/workflow orchestrator; require aligned-design linkage, currentness check, capability profile, and design/result comparison before launch/integration. | Whether it can remain the design-flow coordinator beyond a single component without conflating design and implementation authority. |
| `agents/evidence-validator/agent.md` | **Retain and adapt** | Fixed, read-only controlled-worktree evidence validator. | Retain independent evidence boundary; extend review inputs only after a design-reference/currentness representation exists. | Exact evidence format for design linkage, stale/revoked status, and result disposition. |
| `agents/execution-advisor/agent.md` | **Retain** | Read-only trace/session and budget-extension analysis; no task or execution authority. | Use unchanged for later diagnostics and benchmark analysis; do not make it a lifecycle controller. | Whether first-slice evaluation needs session evidence at all. |
| `agents/expert/agent.md` | **Retain and compose** | Read-only cross-domain consultation and second perspective. Current Terra/Sol exercises used this contract with model overrides. | Continue as advisory review capability; retain model/role separation. | Whether an adopted architecture-review role is needed later; current “Sol” is not one. |
| `agents/thinking-companion/agent.md` | **Retain and compose** | Human-facing consultation; can request one bounded expert consultation. | Use optionally for explaining design choices and gathering non-authoritative feedback; do not make it design approver or task authority. | Whether a dedicated design-facilitation role adds value after the first slice. |
| `agents/worker/agent.md` | **Retain and adapt** | Leaf bounded implementation role with no commit, delegation, credentials, or external communication. | Require task-provided aligned-design reference, admitted capability profile, and worker-write exclusion for the frozen design/fixtures. | Exact launcher enforcement needed to guarantee credential-free environment and no external effects. |

### Agent roster conclusion

- **Retained:** all eight current agent contracts.
- **Adapted for the target proposal:** `as-is`, `component-builder`, `evidence-validator`, and `worker`.
- **Composed:** `expert` and `thinking-companion`.
- **No current contract is replaced, deprecated, or dropped.**
- **Sol, Terra, and Luna are not live agent contracts.** They remain review labels or possible model assignments, not an adoption-ready roster.

## Current live-skill disposition matrix

| Live skill | Proposed disposition | Target use or adaptation |
| --- | --- | --- |
| `as-is-setup` | **Retain and adapt** | Establish required base records; distinguish current records from planned target references. |
| `building-components` | **Retain and adapt** | Add the aligned-design/currentness precondition and design-result comparison; retain agent-owned authority. |
| `committing-completed-work` | **Retain** | Continue scoped completion mechanics; do not treat merge/commit as design approval. |
| `context-building` | **Retain and compose** | Build a bounded package from current records, planned revision, task scope, constraints, and unknowns. |
| `designing-mermaid-diagrams` | **Retain and compose** | Create human-facing architecture/flow views where they reduce ambiguity; diagrams remain non-authoritative representations. |
| `deterministic-skills` | **Retain** | Assess later enforcement improvements; do not prematurely replace generative design judgment. |
| `exploring-execution-evidence` | **Retain** | Diagnose later workflow/benchmark runs without turning telemetry into approval authority. |
| `human-centered-consulting` | **Retain and compose** | Explain choices and collect feedback while preserving human authority. |
| `implementing-component-tasks` | **Retain and adapt** | Require a machine-checkable aligned-design reference and stop/escalate on stale or revoked design. |
| `integrate-as-is-documentation` | **Retain and adapt** | Identify and establish the base record set required by an approved implementation unit. |
| `maintaining-components` | **Retain** | Continue bounded housekeeping; design discrepancies return to design rather than becoming silent maintenance changes. |
| `managing-as-is-document` | **Retain and adapt** | Define how current state, planned target state, revision pointers, and post-integration reconciliation are represented without mixing task state into `as-is.md`. |
| `managing-backlog` | **Retain** | Backlog remains planning-only; it does not establish design alignment or task authority. |
| `naming-software-concepts` | **Retain** | Apply if new concepts/records are justified; no naming-driven architecture change. |
| `spawning-pi-subagents` | **Retain and adapt** | Preserve canonical delegation, but first-slice launch must fail closed if design linkage/currentness, worker isolation, reviewer capacity, or credential-free profile are absent. |
| `structuring-content` | **Retain and compose** | Place root design packages and target-state references without creating competing authorities. |
| `verification-discipline` | **Retain and adapt** | Require acceptance-to-evidence mapping plus design-correspondence and review-disposition evidence. |

### Skill catalog conclusion

- **Retained:** all 17 live `SKILL.md` contracts.
- **Adapted:** six procedures most directly involved in the design-to-implementation boundary: `as-is-setup`, `building-components`, `implementing-component-tasks`, `integrate-as-is-documentation`, `managing-as-is-document`, `spawning-pi-subagents`, and `verification-discipline`.
- **Composed, not replaced:** `context-building`, `designing-mermaid-diagrams`, and `human-centered-consulting`.
- **No live skill should be deprecated or dropped based on current evidence.**

## Mapping: historical composable-skills catalog to live skills

`drafts/composable-skills.md` is historical/proposal context only. Its proposed 25 reusable skills and 12 master skills are **not** the live catalog and do not authorize an all-skills replacement.

### Proposed reusable skills

| Proposed catalog capability | Live disposition |
| --- | --- |
| `building-context` | Direct coverage: `context-building`. |
| `resolving-scopes` | Partial coverage: `as-is-setup`, `integrate-as-is-documentation`, `managing-as-is-document`; no separate live skill justified yet. |
| `identifying-owners` | Partial coverage: `context-building`, `managing-as-is-document`, and component/task contracts. |
| `locating-changelogs` | Partial coverage: `implementing-component-tasks` and `committing-completed-work`; no independent consumer demonstrated. |
| `choosing-names` | Direct coverage: `naming-software-concepts`. |
| `structuring-content` | Direct coverage: `structuring-content`. |
| `drafting-content` | Partial coverage: `structuring-content` and `human-centered-consulting`; a separate drafting skill is not yet justified. |
| `writing-code` | No live skill; currently role/task behavior of `worker` and `component-builder`. |
| `applying-bounded-edits` | No live skill; currently role/task behavior. |
| `writing-tests` | Partial coverage: `building-components` plus `verification-discipline`. |
| `running-tests` | Partial coverage: `verification-discipline`. |
| `validating-changes` | Direct coverage: `verification-discipline`. |
| `recording-evidence` | Partial coverage: `implementing-component-tasks`, `building-components`, and `exploring-execution-evidence`. |
| `designing-diagrams` | Direct coverage: `designing-mermaid-diagrams`. |
| `rendering-diagrams` | Partial coverage: `designing-mermaid-diagrams`; host renderer remains a separate capability concern. |
| `inspecting-execution-evidence` | Direct coverage: `exploring-execution-evidence`. |
| `assessing-determinism` | Direct coverage: `deterministic-skills`. |
| `recording-backlog-items` | Partial coverage: `managing-backlog`. |
| `drafting-changelog-entries` | Partial coverage: `implementing-component-tasks` and `committing-completed-work`. |
| `delegating-bounded-work` | Partial coverage: `building-components` and `spawning-pi-subagents`; authority remains with agents. |
| `observing-delegated-work` | Partial coverage: `spawning-pi-subagents` and `exploring-execution-evidence`. |
| `preparing-scoped-commits` | Direct coverage: `committing-completed-work`. |
| `presenting-decisions` | Partial coverage: `human-centered-consulting`; an independent skill is not yet justified. |
| `choosing-change-methods` | Partial role/procedure coverage; no separate live skill justified. |

### Proposed master skills

| Proposed master skill | Live disposition |
| --- | --- |
| `making-changes` | No direct live skill; possible later composition, not a replacement now. |
| `building-components` | Direct coverage: `building-components`. |
| `implementing-tasks` | Direct coverage: `implementing-component-tasks`. |
| `maintaining-components` | Direct coverage: `maintaining-components`. |
| `managing-as-is-records` | Direct coverage: `managing-as-is-document`. |
| `designing-mermaid-diagrams` | Direct coverage: `designing-mermaid-diagrams`. |
| `managing-backlogs` | Direct coverage: `managing-backlog`. |
| `managing-changelogs` | Partial coverage: task and completion procedures; no standalone live skill yet. |
| `spawning-subagents` | Direct coverage: `spawning-pi-subagents`. |
| `exploring-execution-evidence` | Direct coverage: `exploring-execution-evidence`. |
| `consulting-humans` | Partial coverage: `human-centered-consulting`, supported by `thinking-companion`. |
| `committing-completed-work` | Direct coverage: `committing-completed-work`. |

## Proposed additions

These are target capabilities and design tasks, **not approved implementation work**.

| Proposed addition | Why needed | First-slice status |
| --- | --- | --- |
| Versioned root design package and reviewer-alignment event | Makes approved human intent durable and attributable. | Required before implementation. |
| Current/planned design separation in base `as-is.md` records | Lets models and humans distinguish implemented behavior from target design. | Required before implementation. |
| Deterministic design-to-task reference and currentness/revocation check | Prevents launching work from absent, stale, superseded, or revoked design. | Required before implementation. |
| Explicit first-slice capability/environment profile | Demonstrates no credentials, external effects, unwanted network use, or unsafe fallback. | Required before implementation. |
| Named workflow orchestrator, reviewer, reviewer of result, integration owner, and benchmark scorer | Prevents authority gaps or circular escalation. | Required before implementation. |
| Frozen mock-feature fixture and baseline evaluation protocol | Separates workflow evidence from anecdotal model output. | Required before first-slice evaluation. |
| Dedicated design/prototyping facilitator group | May improve larger workflows. | Deferred; add only if composition of current roles proves unclear. |
| Versioned package/bundle, external-project isolation, installation, upgrade, rollback | Needed for reuse by other projects. | Deferred until distribution-facing work. |
| Specialist workflows, content generation, general-task realization | Later capability areas. | Deferred. |

## Explicit replacements, deprecations, and drops

| Subject | Disposition |
| --- | --- |
| Live agents | **No replacements, deprecations, or drops justified.** |
| Live skills | **No replacements, deprecations, or drops justified.** |
| Historical “drop every existing skill and replace all skills” idea in `drafts/design-realization-flows.md` | **Rejected as a migration strategy.** It is historical proposal context, not a retirement decision for any live skill. |
| Path B planning-branch lifecycle | **Not selected for the target proposal while current/planned design remains distinguishable.** This is not a live component removal. |
| Sol/Terra/Luna as a mandatory target roster | **Not adopted.** These are advisory/model-role labels, not live target contracts. |

## Retained boundaries

- `as-is.md` remains durable component architecture context; task records remain task authority.
- Agents/orchestrators select, authorize, launch, integrate, recover, and escalate within admitted authority.
- Skills remain reusable procedures; they do not acquire authority or capabilities through composition.
- Tools remain bounded operations; globally installed availability is distinct from per-attempt admission.
- `component-builder` retains parent-owned integration and semantic completion; a child exit or child commit is not completion.
- `worker` remains a bounded implementation role without self-acceptance, delegation, credentials, or external communication.
- `evidence-validator`, `expert`, and `execution-advisor` remain advisory/read-only boundaries.
- Worktrees protect caller Git state but do not prove filesystem, network, environment, credential, or read isolation.
- Backlog/changelog records, `drafts/design-realization-flows.md`, and `drafts/composable-skills.md` remain historical/proposal context, not implementation authority.
- OpenRouter information may be screening evidence only when authorized and safely retrieved; it does not appoint agents or approve work.

## Remaining Sol and user decisions

### User decisions still needed

1. **Meaning of “entire implementation”:** confirm whether it means the complete approved bounded implementation unit, as recommended, or the entire long-term system.
2. **First mock feature and risk envelope:** select the low-risk feature/fixture and confirm one component, no credentials, no external effects, isolated worktree, and independent review.
3. **Accountable reviewer identity:** confirm that the then-current user is recorded as reviewer for the selected root design revision and how conflicting later feedback is resolved.
4. **Current/planned record form:** approve a clearly separated planned-target section/reference in the base records, with a frozen root package as the alignment target.
5. **Design-changing feedback rule:** approve the plain-language re-alignment rule or replace it with an equally clear rule.

### Sol re-review questions

1. Does the proposed “approved implementation unit” interpretation satisfy the user’s “entire implementation” rule without weakening it?
2. Does Path A-only, with a frozen planned revision and no Path B fallback, sufficiently handle the current/planned distinction?
3. Does the current live-catalog disposition preserve all necessary capabilities and avoid a premature abstraction/replacement program?
4. What is the smallest compliant deterministic representation for design reference, reviewer alignment, revocation, and launch admission under the strict current task-control model?
5. Which current launcher changes are strictly required to prove the first slice’s credential-free and no-external-effect profile?

## Implementation implications

Before any implementation authorization is considered:

1. Record the user decisions above.
2. Establish the full base-record set for the approved implementation unit.
3. Produce and align one frozen root design package.
4. Name the orchestrator, reviewer, task owner, implementation worker, semantic reviewer, integration owner, and evaluator.
5. Define the deterministic design-link/currentness/revocation mechanism under the existing task-control authority.
6. Define and prove the child environment and capability profile; a prompt statement alone is insufficient.
7. Pin the active candidate revision and `master` evaluation baseline, fixtures, checks, recovery reserve, and rollback path.
8. Create a separately authorized bounded task only after those conditions are met.

## Readiness for final Sol re-review

**Ready for final Sol re-review as an advisory revision.** The report incorporates the new substantive decisions, supplies the missing live-agent/live-skill matrix, rejects the historical wholesale replacement approach, and identifies the remaining non-silent decision about the scope of “entire implementation.”

**Not ready for implementation.** Human confirmation of the bounded-unit interpretation, first slice, reviewer, and planned/current record form remains necessary; Sol must still assess the resulting final proposal and minimum launch-control design.
