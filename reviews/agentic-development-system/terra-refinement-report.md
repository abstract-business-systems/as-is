# Terra refinement report — advisory only

**Read-only limitation:** This report is structured for durable capture, but I did not write it to the repository, alter task records, validate runtime behavior, or authorize implementation. It is based on the cited current-state records and selected history/drafts; it is not a substitute for Sol’s independent review.

## finding

The repository already has a comparatively mature **bounded component-development control plane**: durable component context, task-record authority, child-boundary rules, isolated Pi delegation, verification expectations, parent-owned integration, and recovery evidence. It is a strong implementation substrate for the requested system.

It does **not yet constitute the requested design-first agentic development system**. The material missing layer is not another general implementation skill: it is an approved human-design-to-task workflow that makes human intent, visual/structured design, feedback, alignment, re-planning, and escalation first-class inputs before agents begin implementation. The present Sol/Terra/Luna model hierarchy remains a draft proposal, not a configured or authoritative target roster.

**Recommendation:** retain the current control plane and incrementally add a design-governance and evaluation layer around it. Do not replace the launcher, task protocol, or component boundaries in the first slice.

**Readiness:** **ready for Sol review, not ready for implementation.** Sol must resolve the target-system contract questions, approve the design-alignment and orchestration authorities, and assess whether the first slice’s claims are enforceable with the existing host.

## current-implementation-observations

| Observation | Source | Interpretation |
| --- | --- | --- |
| The repository separates agents, reusable skills, bounded tools, host-neutral modules, host adapters, and contracts. | [`as-is.md`](as-is.md), [`agents/as-is.md`](agents/as-is.md), [`skills/as-is.md`](skills/as-is.md), [`tools/as-is.md`](tools/as-is.md), [`core/as-is.md`](core/as-is.md) | This aligns strongly with the brief’s goal that skills remain modular and tools not become hidden authority boundaries. |
| Component context is durable in `as-is.md`; active machine task authority is the local `as-is.json` task object plus configured Markdown narrative; backlogs are non-authoritative planning indexes. | [`core/contracts/component-task-record-protocol.md`](core/contracts/component-task-record-protocol.md), [`skills/implementing-component-tasks/SKILL.md`](skills/implementing-component-tasks/SKILL.md) | A usable foundation exists for bounded tasks, evidence, recovery, and human-readable progress. It should be retained rather than replaced with a new parallel task system. |
| `component-builder` owns task completion, child-result review, integration, and component-local durable context. A child with its own `as-is.md` is a separate authority boundary. | [`agents/component-builder/as-is.md`](agents/component-builder/as-is.md), [`agents/component-builder/agent.md`](agents/component-builder/agent.md), [`skills/building-components/SKILL.md`](skills/building-components/SKILL.md) | This is compatible with bounded autonomous implementation, but it is component-centric rather than yet design-program-centric. |
| The Pi launcher provides canonical role resolution, declared-tool admission, isolated child worktrees, hard wall-clock enforcement, forwarded cost budgets, detached observation, and recovery-candidate reporting. It intentionally does not own semantic integration or task completion. | [`skills/spawning-pi-subagents/as-is.md`](skills/spawning-pi-subagents/as-is.md), [`skills/spawning-pi-subagents/SKILL.md`](skills/spawning-pi-subagents/SKILL.md) | This should remain the Pi subprocess mechanism for a first slice. It already supports much of the brief’s delegation and recovery need. |
| Launcher isolation is a worktree/CWD boundary, not enforced read isolation. The brief’s initial “prompt-guided discipline” assumption matches the current state. | [`skills/spawning-pi-subagents/SKILL.md`](skills/spawning-pi-subagents/SKILL.md), [`drafts/agentic-development-system-brief.md`](drafts/agentic-development-system-brief.md) | Do not claim sandboxed context isolation in the first slice. Higher-risk work needs a later Sol-approved escalation profile. |
| Deterministic verification is already required by task procedures, with risk-matched checks, explicit evidence, residual-risk reporting, and a fixed read-only evidence-validator profile. | [`skills/verification-discipline/SKILL.md`](skills/verification-discipline/SKILL.md), [`agents/evidence-validator/as-is.md`](agents/evidence-validator/as-is.md), [`agents/evidence-validator/agent.md`](agents/evidence-validator/agent.md) | This is a sound verification baseline, though the fixed validator suite does not by itself establish task-specific product correctness. |
| The current front-face `as-is` role routes substantive work but does not itself declare `call_subagent`; the component-builder owns delegation within component work. | [`agents/as-is/as-is.md`](agents/as-is/as-is.md), [`agents/as-is/agent.md`](agents/as-is/agent.md), [`agents/component-builder/agent.md`](agents/component-builder/agent.md) | The future design workflow needs an explicit orchestration owner. It cannot assume that the current router silently becomes a delegation authority. |
| Existing roles are functional roles (`component-builder`, `worker`, `expert`, `evidence-validator`, etc.), configured through generic model presets (`small` through `xlarge`), not Sol/Terra/Luna roles. | [`agents/as-is.md`](agents/as-is.md), [`as-is.json`](as-is.json), agent contracts under [`agents/`](agents/) | The draft’s named model roles are not a current target configuration. Mapping them must be explicit and approved, not inferred from model size or agent name. |
| The package-owned launcher extension is an Option A repository-oriented registration boundary and explicitly does not claim independently installed-package operation. | [`skills/spawning-pi-subagents/as-is.md`](skills/spawning-pi-subagents/as-is.md) | Reuse by other projects is not yet established. Installation/distribution is a real architecture decision, not documentation cleanup. |
| Current execution and recovery documentation contains a prospective no-emitted-path invariant, while launcher procedure examples and historical behavior include path-bearing diagnostic examples. | [`design-principles.md`](design-principles.md), [`core/contracts/execution-contract.md`](core/contracts/execution-contract.md), [`skills/spawning-pi-subagents/SKILL.md`](skills/spawning-pi-subagents/SKILL.md) | The system must not claim complete emitted-metadata privacy or installation isolation without owner-specific enforcement evidence. This is a review risk, not a reason to broaden the first slice. |
| Historical material proposes replacing existing skills rapidly and comparing alternatives. | [`drafts/design-realization-flows.md`](drafts/design-realization-flows.md) | This is useful historical experimentation context, but wholesale skill replacement conflicts with the brief’s incremental, evidence-first approach and should not drive the first slice. |
| The changelog documents extensive current work on task control, launcher observability, model/session mapping, and migrations, but these summaries are historical evidence, not current task authority. | [`changelog.md`](changelog.md) | The existing implementation has substantial claimed test coverage, but this review did not rerun it. Treat it as historical evidence pending repeatable baseline verification. |

## proposed-architecture

### Recommendation

Use a five-boundary architecture, preserving the existing implementation where it already has an owner:

```text
Human intent and feedback
        ↓
Human-facing design and explicit alignment
        ↓
Approved work planning and bounded task authority
        ↓
Delegated implementation, verification, review, and integration
        ↓
Durable status, evidence, recovery, and design revision
```

This is a responsibility map, **not a target-system contract**.

### Retained boundaries

| Boundary | Retain | Rationale |
| --- | --- | --- |
| Durable component context | `as-is.md` remains purpose, design, boundaries, and navigational context. | It already distinguishes architecture from active work. |
| Task and recovery authority | Existing task-record protocol and component-local task records. | Avoid a parallel workflow/task schema. |
| Roles versus skills | Agents/orchestrators retain selection, authorization, launch, integration, completion, and escalation; skills remain reusable procedures. | Directly matches repository principles and brief. |
| Tools versus authority | Tools expose bounded operations; they do not choose roles or grant authority. | Supports globally available tool reuse without making tools policy owners. |
| Delegation | Existing canonical Pi launcher for separately owned subprocess children; in-process assistance only where current role contracts permit it. | Avoids a new, competing launcher. |
| Integration | Receiving component-builder owns semantic review and parent integration; launcher remains mechanical evidence/ancestry observer. | Preserves current recovery and provenance model. |
| Verification | Risk-matched deterministic checks, validation evidence, residual-risk reporting, and independent read-only review. | Provides the required model-independent control loop. |

### Changed or added boundaries

| Needed boundary | Change | Why |
| --- | --- | --- |
| Human-design authority | Add a distinct pre-task design phase that records goal, constraints, visual/structured representations, feedback, and alignment state. | Current tasks start from requirements, but no current authority clearly represents approved human design direction. |
| Design alignment gate | Require explicit user alignment before detailed implementation task authorization or execution. | The brief requires implementation to be a verified realization of human-approved design, not an alternate design authority. |
| Feedback and issue routing | Add an explicit path by which feedback either adjusts the current design, triggers re-planning, or becomes a later issue. | Current task controls cover blockers and approvals but not the semantics of product/design feedback. |
| Program/workflow orchestration | Define which authority selects design reviewers, moves from alignment to planning, and creates component tasks. | The current router does not become this authority merely by routing requests. |
| Model routing | Separate functional roles from model/provider selection and from risk classification. | “Terra” and “Sol” should not become implicit authority labels. |
| Product-level evaluation | Add a controlled benchmark/evaluation protocol against `master`. | Current tests primarily validate repository/control-plane behavior, not comparative autonomous development efficacy. |
| Distribution boundary | Select and prove a project-consumption model before claiming reuse across projects. | Current package integration is repository-oriented and explicitly not stand-alone. |

### Human-facing design documents and user-alignment gate

Before implementation planning or execution, prepare a compact design package appropriate to the feature:

1. **Goal and feature brief** — user outcome, non-goals, assumptions, constraints, and acceptance-oriented success description.
2. **Human journey or scenario** — the meaningful path from request to status, feedback, issue, approval, or escalation; diagram where it reduces ambiguity.
3. **Visual/structured design representation** — prototype images when useful, plus diagrams, state/decision tables, example outputs, or interface-independent information views. This is not UI design.
4. **Authority and workflow view** — who supplies intent, who may approve, who may plan, implement, validate, integrate, or escalate; include abnormal/recovery paths where consequential.
5. **Slice scope and verification view** — the first demonstrated outcome, excluded work, observable acceptance evidence, and residual limitations.

**Explicit user-alignment gate:** an authorized workflow owner must present the package, record the user’s affirmative alignment or requested changes durably, and stop if alignment is absent, ambiguous, or superseded. Alignment approves a design direction and stated scope; it does not waive later task-level safety, budget, specialist, or release gates. Material feedback after alignment returns the work to design revision or re-planning rather than being silently folded into implementation.

## vertical-slice

### Smallest design-first vertical slice

Demonstrate one bounded **software-development change** from a human-approved feature intent through a single component handoff:

1. A human provides a small feature goal and one visual/structured representation.
2. The designated planning authority produces the five-item design package above.
3. The human explicitly aligns on the package.
4. The designated task authority creates one bounded task in an existing component with:
   - named scope and non-goals;
   - dependency links;
   - acceptance conditions derived from the approved design;
   - budget and recovery conditions;
   - planned deterministic checks.
5. An approved implementation role performs the task using the current component-builder/worker and launcher mechanisms.
6. Existing relevant deterministic checks run; evidence is recorded against acceptance conditions.
7. Ordinary result review occurs; the receiving builder owns integration and a human-readable result/status summary.
8. The slice ends with a design-versus-result review: accepted result, identified design mismatch, or a returned design issue.

### Why this is the smallest useful slice

It proves the missing design-first behavior while reusing the present task, delegation, validation, integration, and recovery machinery. It deliberately excludes multi-component fan-out, autonomous product discovery, content workflows, general task completion, UI work, model marketplace automation, and a new runtime scheduler.

### First-slice acceptance evidence

The future task authority should require evidence that:

- an approved design package and explicit alignment existed before task execution;
- the implementation task referenced that design without treating it as mutable implementation authority;
- the task stayed within one component boundary;
- deterministic checks mapped to the slice’s acceptance conditions;
- a reviewer distinguished observed evidence from claims;
- final status named result, residual risk, recovery point, and any design discrepancy;
- no unsupported autonomy claim was made about context isolation, cost enforcement, installation, or model capability.

## staged-plan

| Stage | Outcome | Gate before next stage |
| --- | --- | --- |
| 0. Current-state baseline | Reconfirm applicable records, current behavioral tests, configured models, launcher limitations, and `master` baseline revision. | Evidence is reproducible; discrepancies between records and implementation are surfaced. |
| 1. Design-first proposal | Produce human-facing design package templates/examples, workflow views, and a list of target-contract questions for Sol. | Terra/Sol/alternate review feedback is preserved; no target contract is silently created. |
| 2. Sol architecture validation | Sol independently assesses authority, task/design transition, safety, distribution, and benchmark soundness; defines or approves target contracts as needed. | Sol verdict is approve/revise/reject; blocking decisions have owners. |
| 3. Human alignment | Present the first-slice design package and obtain explicit alignment. | Durable affirmative alignment for the selected slice; otherwise return to Stage 1. |
| 4. Detailed bounded planning | Create one implementation-ready task plan only for the aligned slice. | Task scope, acceptance, checks, budgets, and escalation route are approved under the target contracts. |
| 5. First-slice implementation | Reuse existing component-builder, worker, launcher, evidence, and integration pathways. | Deterministic evidence and required reviews pass; recovery is recorded if not. |
| 6. Comparative evaluation | Run paired proposed-versus-`master` evaluation and review findings. | Evidence supports retain/adapt/reject decisions; no broad rollout based on anecdotes. |
| 7. Incremental adoption | Select the next smallest gap only if benchmark and review evidence justify it. | Each migration is independently tasked, validated, reversible, and integrated. |

## dependencies

| Dependency | Status or concern | Needed decision/evidence |
| --- | --- | --- |
| Sol authority | Required before target contracts and broad architecture become authoritative. | Sol must define/approve the necessary representations and transition rules. |
| Explicit design-alignment recording | Not evidenced as a current implementation capability. | Decide owner, durable location, revision/supersession handling, and status visibility. |
| Orchestration owner | Current `as-is` role routes, while component-builder owns component execution; no explicit design-program controller is evidenced. | Define the authority that turns aligned design into an authorized task. |
| Current host capabilities | Pi launcher and worktree isolation exist; hard context read isolation and provider cost observation do not. | Define slice claims within demonstrated host properties. |
| Installation/distribution choice | Current Option A is repository-oriented; independent installed-package operation is explicitly deferred. | Select a consumption model before cross-project claims. |
| Benchmark fixture set | No controlled comparative benchmark against `master` was observed in reviewed current-state records. | Define representative, non-secret, repeatable tasks and measurement collection. |
| Model availability and benchmark evidence | Current repository config uses generic presets; draft model names/prices are historical/provider-dependent. | Check authorized current provider evidence at selection time without persisting credentials. |
| Specialist review policy | Brief names future legal, security, financial, and operational concerns but defers workflows. | Define minimal risk categories and escalation ownership without pretending generic orchestration solves specialist work. |

## agent-and-model-selection

### Recommended selection principles

- Keep **functional responsibility** separate from **model selection**. A component-builder, worker, reviewer, or planner is a role; its chosen model is a configuration/risk decision.
- Retain the current roles as candidate capabilities rather than renaming them to Sol/Terra/Luna.
- Route based on task risk, ambiguity, blast radius, and required evidence—not token count, price, or model branding alone.
- Deterministic tools remain evidence providers, not model replacements and not autonomous approvers.
- Treat benchmark APIs and current provider data as time-bounded evidence. Credentials remain environment-only and must not enter prompts, durable reports, telemetry, or task records.

### Proposed role-to-capability posture

| Need | Current capability to retain/use | Model-selection posture |
| --- | --- | --- |
| Human request routing and status orientation | `as-is` router | Existing medium/default configuration remains a baseline; it should not obtain hidden orchestration authority. |
| Planning/design refinement | No dedicated current role is evidenced; Terra is a proposed review role. | Use a stronger planning-capable model only after explicit configuration mapping and evaluation. |
| Target architecture and contract approval | No current “Sol” role; `expert` is advisory-only. | Must be an explicitly authorized architectural role, not a relabelled expert response. |
| Bounded component implementation | `component-builder` and `worker` | Lower-cost model is appropriate only for low-ambiguity, bounded, tested work. |
| Ordinary evidence review | `evidence-validator` and receiving builder | Independent review should be available without granting task or integration authority. |
| Execution/budget diagnosis | `execution-advisor` | Retain read-only posture; it recommends but cannot extend budgets or retry work. |
| High-risk or specialist review | No generic current substitute. | Select a model/reviewer profile per risk and require human domain expertise where the project’s policy requires it. |

## installation-and-consumption

### Recommendation

Do not choose a distribution model during the first slice. Use the current repository-local installation/launcher surface as the slice baseline and define a later consumption decision with at least these alternatives:

| Option | Benefit | Material limitation |
| --- | --- | --- |
| Repository-local source integration | Smallest first slice; reuses current package, records, and host configuration. | Does not prove other-project consumption. |
| Versioned package with explicit host-services adapter | Supports reuse while preserving project-owned configuration and authority. | Requires a stable public host-services/versioning contract and installation/upgrade tests. |
| Hosted/service control plane | Could centralize scheduling/status across projects. | Greatly expands credential, tenant isolation, privacy, operational, and UI-adjacent concerns; not justified for the first slice. |

Any later consumption design should isolate:

- each consuming project’s component records, tasks, state, sessions, traces, and recovery evidence;
- project-local model/provider configuration and credentials;
- declared skills/tools and host trust/approval settings;
- version compatibility between package, Pi host, adapters, agent contracts, and configuration;
- upgrades, rollback, migration, and unsupported-host behavior.

The existing launcher’s package-owned registration boundary is useful evidence, but its own record says it does not yet prove independently installed-package operation. That limitation should remain explicit.

## implementation-review-approach

### Delegation, integration, and recovery flow

```text
Aligned human design
  → authorized planning/task owner
  → bounded component task
  → implementation role
  → deterministic checks
  → ordinary review and receiving-builder integration
  → result/design comparison and status update

Failure, missing evidence, changed feedback, budget exhaustion, or scope conflict
  → durable blocker/recovery checkpoint
  → re-plan, recover, escalate, or return to human design alignment
```

### Required review rules

1. **Before implementation:** verify design alignment, bounded scope, dependencies, acceptance evidence, applicable risk tier, and recovery point.
2. **During implementation:** implementation agents report observed changes and checks; their report is evidence, not completion authority.
3. **Deterministic verification:** select the smallest existing checks that directly map to acceptance conditions. Examples may include focused behavioral tests, type checks, lint, build/package checks, schema checks, or integration tests as appropriate.
4. **Ordinary result review:** receiving builder or Terra-equivalent reviews scope, changed artifacts, test evidence, design correspondence, residual risk, and integration readiness.
5. **Escalated review:** Sol-equivalent, specialist, or human reviews architectural, security-sensitive, irreversible, legal/financial/operational, cross-component, repeatedly failing, or materially ambiguous work.
6. **Integration:** retain current parent-owned semantic integration and ancestry evidence. A launcher result or child exit code never establishes completion.
7. **Recovery:** retain current durable task-record recovery, attempt accounting, preserved worktree behavior, and no-silent-retry rule. A changed design returns to an explicit design or task revision gate, not a silent resume.

### Implementation-result review output

For the first slice, reviews should state:

- observed design alignment or divergence;
- observed scope and dependencies;
- deterministic checks and their direct outcomes;
- review conclusion and integration disposition;
- unresolved risks and omitted checks;
- recovery checkpoint and next safe action;
- whether user design re-alignment is required.

## benchmark-plan

### Goal

Compare the proposed design-first workflow against the `master` workflow without conflating model variance, task difficulty, untracked context, or reviewer preference with architecture quality.

### Protocol recommendation

1. Pin an immutable `master` baseline revision and a candidate revision.
2. Choose a small, representative task corpus:
   - one low-risk single-component behavior change;
   - one task with an explicit dependency or missing-context condition;
   - one task that should escalate rather than proceed.
3. For each task, use paired fresh worktrees and equivalent task descriptions, model settings, budgets, retry policy, host version, and deterministic checks.
4. Run enough paired repetitions to expose gross variance; do not make statistical claims from one model response.
5. Preserve non-secret task definitions, evaluation rules, observed commands/results, and reviewer dispositions.
6. Keep human design alignment identical for both routes where the benchmark is assessing implementation; separately benchmark the cost and clarity of the design-alignment phase if that is the question.
7. Review failures qualitatively: a safe escalation or explicit missing-dependency report can be preferable to an apparently successful out-of-scope change.

### Measures

| Category | Measures |
| --- | --- |
| Correctness | Acceptance-condition pass rate, deterministic-check results, later defects, review rejections. |
| Scope and authority | Out-of-scope reads/edits where observable, unauthorized assumptions, escalations, missing-dependency discovery, integration rework. |
| Human-facing quality | Clarity and completeness of design package, alignment reversals, feedback-to-replan traceability. |
| Reliability | Recovery success, blocked/retry outcomes, preserved partial-work quality, handoff completeness. |
| Efficiency | Wall-clock time, provider-reported cost where available, retries, review burden, and integration time. |
| Safety | Unsupported completion claims, missed high-risk escalations, accidental credential/path exposure, and false claims of isolation. |

A comparison is valid only when deterministic evidence, source revisions, model/provider settings, and reviewer criteria are attributable. OpenRouter ranking or price alone must not be the benchmark.

## risks

| Risk | Consequence | Mitigation or decision point |
| --- | --- | --- |
| Treating drafts as architecture authority | Unapproved target design is implemented. | Keep all current drafts advisory; require Sol and human alignment gates. |
| Hidden orchestration authority | Router, skill, tool, or model silently authorizes work. | Preserve role/skill/tool separation; explicitly appoint the future orchestration owner. |
| Human approval becomes a checkbox | Implementation drifts despite nominal “alignment.” | Require human-readable design package, revision linkage, and re-alignment on material change. |
| Overgeneralizing first slice | Large rewrite and delayed evidence. | Limit to one software-development component task and reuse existing control plane. |
| Misrepresenting isolation | Security or context assumptions exceed actual host controls. | Describe worktrees/prompt discipline accurately; add enforced controls only after risk/evidence justifies them. |
| Misrepresenting cost enforcement | Budget overruns or false accounting. | Keep hard wall-clock and forwarded cost limits distinct; record unavailable cost as unavailable. |
| Model-role coupling | “Sol” or “Terra” branding becomes architecture authority. | Use functional roles plus explicit, versioned configuration and risk routing. |
| Review monoculture | Same-family models share blind spots. | Use an alternate-family reviewer targeted to a named risk and preserve dissent. |
| Benchmark confounding | Candidate appears better due to changed model/prompt/task conditions. | Paired protocol with pinned baselines and comparable controls. |
| Premature package distribution | Other projects inherit hidden repository dependencies or unsafe state coupling. | Delay distribution choice; prove explicit adapter, compatibility, isolation, and rollback behavior. |
| Incomplete privacy enforcement | Diagnostic/runtime metadata leaks paths or identifiers. | Treat current policy as prospective where implementation evidence is incomplete; do not make broader claims. |
| Specialist-domain overreach | Generic agents make legal/security/financial decisions without qualified oversight. | Make specialist collaboration a future policy-backed workflow with human-domain-expert gates. |

## open-questions

1. Who is the authority-bearing workflow owner that converts aligned design into task authority without turning the front-face router into an unbounded orchestrator?
2. What constitutes explicit user alignment: an affirmative decision, versioned design reference, scope statement, expiry/review condition, or all of these?
3. Which feedback changes are minor implementation clarifications versus material design changes requiring renewed alignment?
4. Is a new design-planning role justified, or can existing routing/component-builder roles compose it without collapsing their existing boundaries?
5. Which risk classes require enforced context/tool isolation rather than the current prompt-guided discipline and worktree separation?
6. What product-level status/issue information must be durable, and what remains an implementation/runtime observation?
7. What is the smallest consumption model that satisfies the first external-project adopter without prematurely creating a hosted platform?
8. What task corpus represents meaningful comparison with `master`, and who owns its non-secret fixtures and review criteria?
9. What provider/model data may be collected, retained, and compared without exposing credentials or creating a provider-specific architectural dependency?
10. What first specialist domain, if any, warrants a dedicated future review workflow after software development is reliable?

## alternate-reviewer-profile

Select an alternate reviewer from a **different model family** than the primary architecture reviewer, with demonstrated competence in:

- agent/workflow authority separation and capability security;
- reproducible software-delivery evaluation and benchmark design;
- package installation, dependency closure, upgrade/rollback, and project isolation;
- adversarial review of claims about sandboxing, budgets, observability, and autonomous completion.

The reviewer should receive only the relevant plan, current-boundary excerpts, benchmark proposal, and selected risk question. Its output should identify overlooked failure modes, unenforceable controls, contradictory authority assumptions, and the smallest corrective changes. It must remain read-only and advisory; it cannot approve contracts, select tasks, authorize implementation, or override Sol silently.

## provisional-contract-questions-for-sol

These are questions for Sol to define or approve; they are **not target contracts** proposed by this report.

1. What are the authoritative representations and lifecycle for a human goal, visual prototype, design revision, explicit alignment, feedback item, issue, and supersession?
2. What exact authority may transition an aligned design into detailed implementation planning, and what evidence must that transition reference?
3. How should design revisions relate to existing component-local task revision/attempt semantics without creating a competing task authority?
4. What minimum task-to-design traceability is required before an implementation task launches, and how is a design mismatch represented after implementation?
5. Which workflow state transitions are deterministic control-plane behavior versus advisory model output?
6. What role/capability contract should own cross-component design coordination while preserving component-builder integration authority?
7. What risk classification determines ordinary review, Sol-level review, specialist review, mandatory human approval, or enforced host isolation?
8. What evidence makes an implementation-agent result eligible for review, integration, and completion across different project types?
9. What are the compatibility boundaries for swappable skills, globally available tools, project-local agent configuration, and host safety profiles?
10. What distribution/installation contract, if any, is appropriate for an external consuming project, including versioning, project isolation, upgrades, and rollback?
11. What benchmark-result schema and decision rule are sufficient to retain, adapt, or reject a workflow change without treating provider rankings as approval?
12. Which emitted metadata, provenance, privacy, retention, and credential constraints are mandatory before external-project consumption is supported?

## out-of-scope-items

- User-interface design or implementation.
- General task completion and content-production implementation.
- Specialist legal, security, finance, or operations workflows beyond identifying future escalation needs.
- A wholesale replacement of existing skills, roles, task records, launcher, or tools.
- A new scheduler, hosted multi-tenant service, browser capability, or OS sandbox.
- Independent installed-package support before a distribution decision and validation.
- Provider credential handling, live OpenRouter API use, or model purchase decisions.
- Implementing the first vertical slice or modifying any record, agent, skill, contract, launcher, package, or test.
- Treating historical backlog/changelog items or `drafts/design-realization-flows.md` as active implementation direction.

## residual-uncertainty

- This review examined current architecture records, role/skill contracts, configuration, and historical drafts, but did not execute tests, inspect source implementation in depth, inspect the actual `master` revision, invoke Pi, call provider APIs, or validate a live delegated run.
- Historical changelog claims indicate broad provider-free coverage, but those claims require reproducible reruns before they are used as current baseline evidence.
- The current repository’s model presets do not demonstrate an admitted Terra/Sol/Luna mapping, current provider availability, pricing, benchmark status, or alternate-family independence.
- The present records establish strong component/task mechanics but do not yet prove an end-user design/feedback lifecycle, external-project installation, or benchmark harness.
- Sol and the user retain the consequential decisions: target-system contracts, design-alignment semantics, orchestration ownership, risk gates, first-slice selection, and whether any later implementation is authorized.
