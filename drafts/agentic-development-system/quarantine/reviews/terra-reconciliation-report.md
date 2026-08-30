# Terra reconciliation report — advisory, read-only

## Decision

**Proposed direction:** retain the repository’s existing component-task, validation, recovery, launcher, and parent-integration control plane; add a small **design-governance layer** before it rather than rebuilding orchestration.

Use a minimal agent-owned workflow:

1. A designated orchestrator gathers human intent and coordinates the design flow.
2. A human reviews an appropriate root design package and explicitly aligns on a versioned design direction.
3. The applicable orchestrator turns that aligned design into one bounded existing component task.
4. A task implementer performs the task; independent deterministic evidence and result review precede integration.
5. Feedback after design or implementation either becomes a revision, issue, or accepted result; it never silently mutates the approved basis of active work.

**Recommendation, pending human choice:** use **Path A** as the initial default: a target-state design section/revision drives derived artifacts and bounded implementation tasks. Preserve Path B for changes that genuinely need a temporary planning branch, but do not let an unmerged branch become the only source of approved design authority.

This is a proposed direction, not target-system contract adoption or implementation authorization.

---

## Accepted constraints

- Humans own feature intent, design judgment, feedback, issue raising, approval, intervention, and required specialist/release decisions; they do not perform routine implementation.
- The applicable **orchestrator owns human escalation**. A child agent may escalate to its caller; callers assess, resolve locally when authorized, or bubble the escalation upward until the responsible orchestrator presents it to a human.
- Multiple orchestrators are valid by context. Initially, `component-builder` can orchestrate component delivery, while the front-facing or design-owning orchestrator coordinates design-level status and human escalation.
- Agents own orchestration and authority-bearing decisions. Skills provide reusable procedures; tools provide operations and do not grant authority.
- The first scope is software development. Content, general task completion, hosted control planes, and specialist workflows remain later work.
- Existing `as-is.md` records remain current-state architecture evidence; drafts, backlog, changelog, and historical design-flow material remain non-authoritative context.
- Current launcher worktrees protect Git working state but do not prove filesystem, network, environment, credential, or read isolation.
- OpenRouter benchmark and Data APIs are valid external evidence sources when accessed under an authorized, credential-safe process. They inform model screening only; project-local evaluation remains decisive.
- No routine implementation begins until the design direction and first-slice controls receive explicit human approval.

---

## User-input interpretation

| User input | Reconciled interpretation |
| --- | --- |
| Escalation belongs to the orchestrator | Accepted. Escalations may move child → caller → higher caller → responsible orchestrator → human. A local caller may resolve only matters already inside its authority. |
| Component-builder and task implementer may suffice initially | Accepted as the smallest implementation roster. A new dedicated design/prototyping group is optional, not a first-slice prerequisite. |
| Agents orchestrate; skills provide flows | Accepted. Existing repository boundaries already support this: agents select, launch, integrate, recover, and escalate; skills describe repeatable procedures. |
| Feedback occurs after design and after implementation | Accepted. Post-design feedback determines alignment or revision. Post-implementation feedback determines acceptance, discrepancy, issue creation, or a new design cycle. |
| Explicit design-completion boundary is crucial | Accepted as the primary unresolved design decision. It must be represented in a durable design revision and task linkage, not solely in conversation. |
| Leaf designs may not need direct human review | Accepted. Human review applies to the root design package and material revisions; leaf artifacts are reviewed for traceability and correctness by agents/reviewers unless they materially alter human-visible intent, risk, or scope. |
| Agents choose tools within capabilities | Accepted with Sol’s qualification: agent choice is limited to the intersection of fixed safety rules, host policy, admitted role capabilities, and task constraints. Skills cannot expand that set. |
| Post-implementation verification may substitute for mechanical enforcement | Partially accepted. Post-implementation review is necessary, but cannot be the sole protection against launching work against an absent, revoked, or stale design. A lightweight pre-launch check is still needed for autonomous implementation. |

---

## Proposed responsibility and escalation model

### Initial role set

| Responsibility | Initial owner | Boundary |
| --- | --- | --- |
| Human-facing request, design status, cross-component escalation | Applicable design/workflow orchestrator | Coordinates; does not silently become implementation authority. |
| Component task orchestration, delegation, integration, task recovery | `component-builder` | Retains existing component-local ownership and parent integration. |
| Bounded implementation | Existing `worker` or another admitted task implementer | One authorized task; no self-approval, delegation, external communication, or credential use. |
| Evidence collection / deterministic validation | Existing validation tooling and `evidence-validator` where appropriate | Evidence and recommendation only; no integration or completion authority. |
| Semantic result review | Receiving builder or distinct reviewer session | Reviews real diff/artifacts and evidence; recommends disposition. |
| Human design approval and material decisions | Accountable human/project-defined group | Aligns, revokes, or revises a design; retains required specialist/release decisions. |

A dedicated design facilitator or prototyping group should be introduced only if the component-builder plus front-facing orchestration cannot produce clear, reviewable design packages without mixing design and implementation authority. It is an extension point, not a required initial role.

### Escalation flow

```text
Implementation or reviewer detects blocker / ambiguity / risk
  → immediate caller assesses within its authority
  → resolve locally, block and recover, or bubble to its caller
  → responsible orchestrator consolidates context and asks the human when needed
  → human decision becomes a versioned design, task, or policy input
```

An escalation does not authorize retries, broader tools, budget increases, external effects, or design changes by itself.

---

## Design-completion and implementation-start options

### Path A — target-state design generates downstream artifacts

**Shape:** `as-is.md` or a linked design revision contains an explicit target state. It drives architecture diagrams, prototypes, task breakdowns, leaf design documents, and eventually implementation tasks. Human alignment applies to the root package and material revisions.

**Advantages**

- Makes design intent available before implementation and in isolated child worktrees.
- Gives tasks a durable, reviewable source rather than a planning branch or conversation.
- Supports leaf artifacts without requiring every artifact to be directly human-reviewed.
- Fits the repository’s durable component-context and task-record model.
- Enables design-to-result comparison after implementation.

**Risks and required controls**

- A target section must not be mistaken for current behavior.
- Derived artifacts need provenance to the approved design revision.
- Implementation agents must not revise the design they cite as authority.
- “Final artifacts are implementation” needs clarification: whether it means generated implementation artifacts are reviewed after execution, or whether design artifacts themselves are the deliverable for certain non-code work.

### Path B — planning artifacts on a separate branch, merged after implementation

**Shape:** planning artifacts and implementation are developed on a dedicated branch; after implementation and human review, the branch merges to `master`.

**Advantages**

- Useful where a cohesive, multi-artifact change must be examined as one candidate.
- Keeps planning and implementation changes grouped for a final merge review.
- Can support larger migrations or experimental target-state work.

**Risks and required controls**

- An unmerged branch is not reliably visible to isolated workers based on committed `HEAD`.
- It can make the approved design unavailable, mutable, or ambiguous during implementation.
- It risks treating merge as proof of human alignment or implementation correctness.
- It complicates recovery, baseline evaluation, and concurrent work.

### Recommendation and tradeoff

**Recommend Path A for the first slice**, with a committed/versioned target-state design reference available before task launch. Implementation may still occur in an isolated worktree or candidate branch, but that branch is not the sole authority for design.

Use **Path B only when the human approves it for a defined change class**, such as a coordinated migration requiring artifacts and code to be evaluated atomically. In that case, require a frozen, reviewable design revision available outside the mutable implementation branch, and treat merge as an integration step—not a design or safety approval.

**Decision requiring user input:** confirm the intended semantics of Path A’s “final artifacts are the implementation,” and approve either A-as-default with B-by-exception or a different lifecycle.

---

## Current/target `as-is.md` representation proposal

Maintain `as-is.md` as current architecture context, but permit a clearly separated target-state section:

```text
## Current state
Observed present purpose, design, boundaries, relationships, and known limitations.

## Proposed target state
Versioned proposal reference, status, scope, non-goals, assumptions, and supersession link.
This is not current behavior or implementation authority until adopted.

## Design relationship
Links from target-state revision to derived diagrams, leaf documents, task candidates, feedback, and alignment decision.
```

For a small change, the target state may be a concise section in the affected component’s record plus linked artifacts. For a broad or cross-component proposal, it should be a separate versioned design package referenced by component records rather than copied into every record.

This preserves the user’s desired current/target representation while avoiding the false claim that proposed target behavior already exists.

---

## Human-review levels for root versus leaf designs

| Design level | Default review | Escalate to direct human review when |
| --- | --- | --- |
| Root feature/design package | Human review and explicit alignment required | Always before implementation. |
| Material revision of root design | Human re-alignment required | User-visible behavior, scope, risk, external effect, architecture, cost, or acceptance meaning changes. |
| Derived architecture diagram, task breakdown, or leaf design | Agent/reviewer traceability review | It changes root intent, introduces a meaningful unresolved choice, changes a risk class, or exposes a human-visible tradeoff. |
| Generated implementation-facing artifact | Deterministic and semantic review | It diverges from aligned design or creates a material discrepancy. |

Each leaf artifact should name its root design revision and derivation relationship. It need not require individual human review merely because it exists.

---

## Post-design and post-implementation feedback flow

1. **Post-design feedback**
   - The human reviews the root package.
   - Feedback is classified as acceptance, clarification, material revision request, or issue.
   - Material change produces a new design revision and invalidates unlaunched tasks tied to the old revision.
   - The orchestrator records alignment or returns the work to design.

2. **Post-implementation feedback**
   - Reviewer compares result and evidence to the aligned design and task acceptance conditions.
   - A result may be accepted for integration, require rework, be rejected, be escalated, or become a recovery candidate.
   - Human feedback on a delivered result becomes either a discrepancy against the aligned design or a new design request. It is not silently added to the finished task.

3. **Active-work feedback**
   - If feedback revokes or materially supersedes a design, new launches stop.
   - Active work reaches a safe checkpoint, is blocked/cancelled under the applicable policy, and its partial work is preserved for review rather than automatically integrated or discarded.

---

## Agent, skill, and tool boundaries

- **Agents/orchestrators:** decide whether to plan, delegate, integrate, retry, escalate, or request human input within their authority.
- **Skills:** provide reusable procedures for design preparation, task implementation, validation, recovery, and consultation. They do not appoint agents, grant tools, approve designs, or accept results.
- **Tools:** provide bounded actions. Existing tool boundaries correctly state that tools do not select roles, grant component ownership, or mutate task authority.
- **Tool selection:** the executing agent may select among globally available tools only when the tool is admitted by the role, task, host safety profile, and fixed policy. The choice belongs to the agent; admission does not.
- **Deterministic control:** design/task linkage, status transitions, budget admission, approval state, and capability admission should be deterministic where implemented. Model outputs are proposals and evidence, not transition authority.

---

## Right-sized first-slice controls versus later hardening

### Required for the first software-development slice

- One accountable orchestrator and one accountable human design approver.
- One versioned root design package with explicit alignment, scope, non-goals, and acceptance conditions.
- A task reference to the aligned design revision; no launch based only on chat history.
- One bounded component task and admitted implementation agent.
- Pre-launch confirmation that alignment is current, scope is known, and required reviewer capacity exists.
- No silent fallback from isolated worktree execution to caller CWD for autonomous implementation.
- No credentials or external side effects for the implementation task; explicit capability limits appropriate to the task.
- Deterministic checks mapped to acceptance conditions, actual diff/artifact review, and a recorded semantic disposition.
- A stale/revoked-design rejection scenario and a failed/budget-stopped recovery scenario in the slice evaluation.
- Candidate and benchmark fixtures outside the candidate implementation agent’s writable scope.

### Later hardening, unless the selected first task demonstrates a need

- Strong filesystem/read sandboxing, sparse materialized contexts, or mediated read interfaces.
- Full external-project installation, two-project isolation, upgrades, rollback, and uninstall support.
- Hosted/multi-tenant control plane.
- General content and non-software-workflow contracts.
- Broad specialist-review systems.
- Automated artifact generation pipelines and a dedicated design-agent group.
- Comprehensive provider/model telemetry, cost enforcement, and model marketplace automation.

**Material disagreement preserved:** Sol recommends fail-closed mechanical launch admission. The user asks whether verification can be post-implementation. This plan recommends a proportional middle position: a minimum deterministic pre-launch alignment check plus post-implementation independent verification. Post-check alone is insufficient because it cannot undo unauthorized work, leaked context, or an external effect.

---

## Task graph

| Node | Owner | Dependencies | Allowed scope / non-goal | Acceptance and integration evidence | Recovery |
| --- | --- | --- | --- | --- | --- |
| 1. Confirm first-slice design lifecycle | Human + design/workflow orchestrator | None | Decide Path A/B semantics and approver | Recorded decision and design package shape | Leave proposal advisory if no decision |
| 2. Produce root design package | Design/workflow orchestrator | 1 | One feature, visual/structured representation, scope, non-goals | Human-readable revision; leaf derivation rules | Revise from feedback |
| 3. Human alignment | Accountable human | 2 | Align/reject/request change; no implementation | Explicit decision tied to revision | Return to node 2 |
| 4. Define bounded task and admission profile | Component-builder/task authority | 3 | One component; no distribution or external effects | Task links to aligned revision, allowed capabilities, checks, budget, reviewer | Block if any record or reviewer absent |
| 5. Implement isolated attempt | Task implementer | 4 | Assigned component and task only | Structured handoff, actual changed scope, checkpoint | Preserve partial work and block/escalate |
| 6. Validate and semantically review | Validator/reviewer + receiving builder | 5 | Evidence and design comparison; no self-acceptance | Check results, diff review, disposition, residual risk | Rework, escalate, reject, or recovery |
| 7. Integrate and gather post-implementation feedback | Receiving builder + orchestrator | 6 | Parent-owned integration only | Integration checks, result/design comparison, status | Create issue or new design revision |
| 8. Evaluate candidate versus baseline | Independent evaluator/reviewer | 1–7 fixture preparation | Frozen corpus; no candidate control of scoring | Predeclared metrics, run evidence, decision rule | Retain baseline or revise candidate |

Actual budgets, models, and tool admissions remain task-specific and require future approval; this report does not allocate them.

---

## Review disposition for Terra and Sol findings

| Finding | Disposition |
| --- | --- |
| Terra: retain the task-control, launcher, validation, and component boundaries | **Accepted.** This is the lowest-risk starting substrate. |
| Terra: add a design-first layer | **Accepted, narrowed.** Start with a root design package and design-to-task linkage, not a parallel whole-system workflow engine. |
| Terra: dedicated design role may be needed | **Deferred.** Optional after evidence that existing orchestration cannot compose the design flow cleanly. |
| Sol: no implicit authority-bearing design workflow owner | **Accepted.** The human-approved orchestrator must be named per workflow. |
| Sol: immutable/versioned design and design-to-task linkage | **Accepted in principle.** First slice needs a durable version/reference; exact schema evolution remains a later design task. |
| Sol: every outcome receives result review and no worker self-accepts | **Accepted.** Applies to success, failure, timeout, and partial work. |
| Sol: global availability differs from per-attempt admission | **Accepted.** This reconciles the user’s agent-owned tool choice with fixed safety constraints. |
| Sol: worktree/CWD/environment limitations invalidate broad autonomy claims | **Accepted.** First slice must state these limits and avoid credentials/external effects. |
| Sol: immediate package/bundle target before any work | **Partially accepted.** Select it before distribution-facing changes; repository-local dogfooding may proceed without claiming external consumption support. |
| Sol: OpenRouter API is unverified | **Revised by supplied user input.** The documented `/api/v1/benchmarks` endpoint and Data API are treated as real external evidence sources. Exact fields, terms, availability, and retrieval results still require verified, authorized use before reliance. |
| Sol: Sol itself defines/approves target contracts | **Not adopted as authority.** Sol may recommend and review contracts; human/project adoption grants authority. |
| Sol: alternate-family review | **Recommended for security/isolation and evaluation design before broad rollout**, but not required before this advisory human decision unless the human selects higher-risk autonomy. |

---

## Human-approval points

1. **Design lifecycle:** approve Path A as the default and define when Path B is allowed, or choose another lifecycle.
2. **Design completion semantics:** confirm what “final artifacts are the implementation” means for Path A.
3. **Human approver:** name the accountable human or group for design alignment, revocation, and material design decisions.
4. **First-slice risk envelope:** approve no credentials, no external effects, one component, isolated worktree required, and bounded tool admission.
5. **Minimum gate posture:** approve a pre-launch design-currentness check plus post-implementation review, or explicitly decide whether the system may perform work that is only audited afterward.
6. **First-slice feature and evaluation corpus owner:** select a representative, non-secret feature and accountable scorer.
7. **Distribution boundary:** approve repository-local dogfooding only for the first slice; require package/bundle design before external-consumption claims or distribution-facing implementation.

---

## Evaluation protocol

### Project-local evaluation is decisive

Run two separate, predeclared comparisons against a pinned `master` baseline:

1. **Workflow experiment:** equivalent human goals through the current and candidate workflows. Measure design clarity, alignment reversals, review burden, implementation outcomes, recovery, and safety behavior.
2. **Implementation-boundary experiment:** both workflows receive the same frozen aligned design and task. Measure delegation, capability admission, evidence, review, recovery, correctness, and integration behavior.

Use a small corpus containing:

- one normal, low-risk component change;
- one missing-dependency case that should stop/escalate;
- one stale or revoked-design launch rejection;
- one failed or budget-stopped recovery case;
- one adversarial scope/instruction-injection case where safe refusal/escalation is preferred.

Pin source revisions, host/adapters, model/provider settings where available, budgets, retry policy, validator versions, fixture versions, scoring rubric, and decision thresholds before runs. Candidate agents must not modify their own fixtures or scoring rules.

### OpenRouter evidence usage

The supplied feedback establishes that OpenRouter’s documented benchmark endpoint (`/api/v1/benchmarks`) and Data API are real evidence sources. Their use should be bounded as follows:

- Query only through an authorized selector/evaluation process with narrowly scoped network access and environment-only credentials.
- Record sanitized provenance: endpoint category, retrieval time, relevant model metadata/benchmark fields, and selection rationale.
- Do not persist credentials, raw sensitive responses, or provider output as task instructions.
- Verify current endpoint behavior, field meanings, availability, terms, model IDs, provider routing, and retention implications at retrieval time.
- Use the information to shortlist models or alternate-reviewer candidates by capability, context, latency, or cost.
- Do not let provider rankings select architecture, grant roles, approve a task, or outweigh local results.

### Proposed decision rule

Retain or expand the candidate only if it has:

- no safety-critical failure in the defined corpus;
- successful deterministic verification and independent semantic review for the normal case;
- correct stop/escalation for stale-design, missing-dependency, and adversarial cases;
- a recoverable disposition for failed work;
- no materially higher human review or integration burden without a documented compensating benefit.

Otherwise, revise the smallest failing control or retain the current workflow. Provider benchmark position is not part of the pass/fail rule.

---

## Rollback or recovery

- Preserve the existing task-control, launcher, and component-builder path as the rollback baseline.
- Introduce design linkage additively; do not invalidate old task records without an explicit migration policy.
- Treat existing/in-flight tasks without design linkage as legacy tasks: they may complete under existing rules only if separately authorized, but they are not evidence that the design-first workflow passed.
- On design revocation, block new launches; preserve active partial work at a durable checkpoint for review.
- On failed validation or review, retain evidence and worktree state where safe, record a recovery disposition, and require an authorized retry or revised task.
- Do not automatically change model, worker, budget, tool set, or scope during recovery.
- Do not merge candidate control-plane changes into the active control path until the benchmark and rollback evidence support it.

---

## Remaining questions

The smallest decisions requiring user input are:

1. **Which lifecycle is intended?** Approve Path A as the normal design-to-implementation flow, with Path B only for approved exceptions, or define a different distinction.
2. **What exactly completes design?** Is a human-approved root target-state revision sufficient, or must a defined set of derived artifacts also exist before tasks begin?
3. **Who is the accountable human design approver?** One named role/person/group is needed for alignment, revocation, and conflicting feedback.
4. **What minimum pre-launch enforcement is acceptable?** This report recommends a lightweight deterministic design-currentness/task-link check; post-implementation audit alone leaves an unacceptable gap for autonomous work.
5. **What is the first-slice risk envelope and feature?** The plan assumes one low-risk component change with no credentials or external effects.
6. **When is Path B justified?** Define criteria such as coordinated migration, atomic artifact/code review, or another concrete need.
7. **What counts as a material change?** This needs a simple initial policy for re-alignment versus implementation clarification.

---

## Readiness for human approval

**Ready for limited human design-direction approval; not ready for implementation approval.**

The proposal is sufficiently reconciled to ask the user to decide the seven items above, especially the design-completion/lifecycle boundary and minimum launch gate. After those choices, an authorized owner can prepare the root design package and first-slice task design. No implementation, task launch, target-contract adoption, or external API operation is authorized by this report.
