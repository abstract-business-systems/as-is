# Agentic Development System - User Ask And Durable Handoffs

## Status

This document is a draft proposal and durable handoff record. It is not implementation authority, current architecture authority, task authority, or runtime configuration. No implementation should begin solely because this document exists.

**Handoff state:** prepared for Terra refinement.

**Next owner:** Terra should inspect the existing implementation and refine the development approach without changing repository files.

**Review sequence:** Terra refinement -> Sol independent architectural validation -> alternate-family review if justified -> Terra reconciliation -> human approval -> bounded implementation.

## Verbatim user ask

```text
I tried create an agentic devlopment system, with the help of AI. There's a working implementation (existing arcitecture will be provided); which looks like it could be rearchitectured. The goal of the system is allow autonomus development of applications, content and genral task completion (later). Humans will be consulted only in the prototyping (primarilly through visuals) and design phases. They allso will provide feedback and raise issues. The system should take care of the implementation, with subagents, while giving the human the ability interact with it to understand status, provide feedback, etc. We don't have to worry about the user interface. The same philosopy could be used to implement the system itself. Feel free to question, suggest and highlight issues.
```

## Refined user prompt

The following is the approved refinement of the user's request for downstream planning. It preserves the original ask above while making the intended scope, authority boundaries, and review outputs explicit. It remains a request for assessment and planning, not implementation authority.

```text
I have an existing working implementation of an AI-assisted agentic development system. I will provide its current architecture and implementation for review. The implementation works, but its architecture may need to be restructured. Do not assume that the existing architecture is correct, and do not propose a large rewrite before understanding what should be retained, adapted, isolated, deprecated, or replaced.

The long-term goal is a system that can autonomously develop applications, produce content, and eventually complete more general tasks. Software development is the initial priority. Content generation and general task completion are later backlog areas that should influence the extensibility of the initial design without expanding the first implementation beyond its justified scope.

The system should take a human-approved goal through suitable prototyping and design activities into implementation performed by bounded subagents. Humans should primarily participate in prototyping and design, including visual feedback where useful, and should be able to provide feedback, raise issues, inspect status, and intervene when necessary. Routine implementation should not require continuous human involvement. The system should provide sensible minimal defaults for approval and escalation gates, while the implementing project should define and evolve the concrete gates and workflows. Legal, security, financial, operational, and other specialist concerns should be represented as future expert-agent and domain-expert collaboration backlog items rather than ignored or treated as solved by generic orchestration.

User-interface design is out of scope. Define the behavioral and information contracts needed for human status inspection, feedback, issue reporting, approval, and escalation without designing the UI itself.

The system should support modular, swappable skills. Tools should be globally available through the platform and used by skills when appropriate; skills should not duplicate tool implementations or become hidden authority boundaries. Challenge this arrangement if the supplied implementation shows that explicit capability declarations, host safety profiles, or another composition boundary are required.

Assess how the system should represent goals, requirements, prototypes, designs, feedback, issues, and expert input; decompose approved work into bounded tasks; assign tasks to appropriately capable subagents; constrain subagent scope, context, tools, budgets, and authority; coordinate dependencies and integrate results; validate results with deterministic checks and independent review; report status and preserve evidence; handle failures, retries, partial work, recovery, and escalation; revise plans when implementation or human feedback changes requirements; and support future content and general-task workflows without overgeneralizing the initial software-development design.

The same development philosophy may be used to improve the agentic system itself. Treat that as a possible bootstrap application, not as permission for generated plans or model output to become implementation authority automatically.

Use the supplied implementation and repository guidance as evidence. Question the assumptions in this request, identify risks and contradictions, and suggest alternatives. Prefer an incremental migration and a small end-to-end vertical slice over a speculative whole-system rewrite. Capture future workloads, specialist expert agents, domain-expert collaboration, and related workflow extensions in backlogs with explicit dependencies and sequencing.

Produce an assessment of the existing architecture; a proposed target architecture and responsibility boundaries; the smallest useful first vertical slice; an incremental migration and implementation plan; task, evidence, validation, feedback, expert-input, and approval contracts; the model and subagent orchestration strategy; deterministic verification and recovery requirements; risks, non-goals, unresolved decisions, and assumptions; and an evaluation plan comparing the proposed workflow with the current implementation. Do not implement changes during the architecture and planning review. Clearly separate observations, recommendations, decisions requiring human approval, backlog items, and implementation tasks.
```

### Interpretation notes

- "Humans consulted primarily in prototyping and design" means humans do not perform routine implementation; it does not remove necessary approval, intervention, or escalation authority.
- Legal, security, financial, operational, and other specialist concerns are future workflow capabilities. The system should plan backlog items for AI expert agents working with human domain experts, while the implementing project defines concrete gates and workflows from minimal defaults.
- Content generation and general task completion are later backlog areas. They should inform modular boundaries and extension points, but should not silently expand the first vertical slice.
- Modular and swappable skills, with globally available tools composed by skills, are a proposal to validate against the existing architecture. Skills must not duplicate tools or acquire hidden authority merely through composition.

## Refined development brief

### Problem

There is an existing working implementation of an AI-assisted agentic development system. Its current architecture may not be the best foundation for autonomous software development, content production, and later general task completion. The existing architecture will be supplied for assessment rather than assumed to be correct.

### Desired outcome

Design and incrementally implement a reliable agentic system that can take a human-approved goal through prototyping and design into autonomous implementation by bounded subagents. The system should preserve human visibility, feedback, issue reporting, approval, and escalation channels while minimizing routine human participation in implementation. The implementing project should define concrete gates and workflows, starting from sensible minimal defaults. The same development method should be usable to build and improve the system itself.

### Initial scope

- Assess the supplied implementation and its architecture before proposing a rewrite.
- Define the system's goals, boundaries, responsibilities, and authority model.
- Support software/application development as the first primary workload.
- Treat content generation and later general task completion as backlog areas and planned extensions. They should influence modularity and extensibility decisions without becoming first-iteration implementation scope unless a review establishes a necessary dependency.
- Define how human input enters during visual prototyping, design, feedback, issue raising, approval, and escalation.
- Define how the system decomposes work, assigns bounded subagent tasks, integrates results, verifies outcomes, reports status, and recovers from failure.
- Define an incremental implementation strategy with a small end-to-end vertical slice before broad rearchitecture.
- Define how the system can apply its own workflow to its implementation without granting generated plans implicit authority.

### Human role

Humans participate actively in prototyping and design, primarily through visual artefacts where useful, and can provide feedback or raise issues throughout the lifecycle. "Consulted primarily in prototyping and design" means that humans do not perform routine implementation; it does not silently remove approval, intervention, safety, specialist, release, or exception authority where those controls are necessary. The implementing project should define and evolve the concrete gates and workflows, starting from sensible minimal defaults. Future backlog items may introduce AI expert agents that work with human domain experts on legal, security, financial, operational, and other specialist concerns.

The system should expose status and feedback interaction as a capability contract even though the user-interface design is out of scope. The contract should specify what information humans can inspect, what feedback can change, which changes require re-planning, and which actions require explicit approval.

### Modularity and composition

Skills should be modular and swappable where their contracts permit substitution. Tools should be globally available through the platform and used by skills as appropriate, rather than reimplemented inside each skill. This is a design hypothesis to validate against the existing implementation: explicit capability declarations, host safety profiles, and agent-owned authority may still be required even when tool implementations are globally available. A skill remains a reusable procedure and must not silently select, authorize, start, delegate, integrate, or complete work merely because it can call a tool.

Future content-generation, general-task, and specialist expert-agent workflows should be captured in backlogs with dependencies and migration sequencing. Their existence should inform stable interfaces and extension points without forcing premature implementation.

### Agentic role model

- A stronger model should define architectural constraints, resolve high-risk ambiguity, and review architectural changes.
- A planning and coordination model should refine architecture into task contracts, dependencies, acceptance criteria, and bounded implementation work.
- A lower-cost implementation model should execute narrow approved tasks, add tests, run deterministic checks, and stop when the task exceeds its authority.
- Subagents should operate through the canonical Pi delegation mechanism and should receive explicit role, scope, budget, evidence, and handoff requirements.
- Deterministic tests, type checks, linting, builds, security checks, and other suitable validators should provide evidence independent of model confidence.

The current working orchestration proposal names these roles Sol, Terra, and Luna respectively. Terra should refine the plan, Sol should independently challenge it, and Luna should not receive implementation work until the plan and task contracts are approved.

### Core design principles

- Treat the existing implementation as evidence and a migration starting point, not as unquestionable authority.
- Make authority explicit in durable task records, contracts, acceptance criteria, and approval gates.
- Separate planning, implementation, validation, integration, recovery, and human approval responsibilities.
- Use bounded tasks with explicit allowed scope, dependencies, non-goals, budgets, and completion evidence.
- Prefer incremental vertical slices over a large speculative rewrite.
- Keep deterministic verification in the control loop.
- Preserve human escalation for high-risk, ambiguous, security-sensitive, irreversible, or persistently failing work.
- Record decisions, feedback, issues, model handoffs, validation evidence, and unresolved disagreement durably.
- Keep proposals in `drafts/` until an authorized owner adopts them as architecture, skill, workflow, or implementation task authority.

### Initial context-discipline assumption

The first experiment should use the existing Pi launcher and separate child worktrees/CWDs. Children should be instructed to read only applicable instructions, the assigned task, and files needed for that task and its verification; they should not explore unrelated context merely for background. This is prompt-guided discipline, not enforced read isolation. Materialized dependency pruning, read manifests, BBWrap, and other sandboxing should be deferred until measurements show that the soft boundary is insufficient or the task risk requires stronger controls.

### Explicit non-goals for the first iteration

- Designing the user interface.
- Implementing general task completion before the software-development workflow is reliable; it remains a backlog concern that informs architecture.
- Building a fully autonomous system without safety, approval, specialist, release, or escalation boundaries.
- Performing a wholesale rewrite before understanding the current implementation.
- Treating model-reported file access, correctness, or completion as authoritative without independent evidence.
- Adding enforced context pruning or OS sandboxing without a demonstrated requirement, except where risk classification requires it.
- Implementing future content, general-task, or specialist expert-agent workflows before their backlog item is selected and its dependencies are understood.

## Questions the reviewers must answer

- What does "autonomous" mean operationally, and which actions remain approval-gated?
- Which parts of the current implementation should be retained, adapted, isolated, deprecated, or replaced?
- What is the smallest end-to-end vertical slice that demonstrates useful autonomous development?
- What are the canonical task, plan, design, feedback, issue, status, validation, recovery, and handoff records?
- Which agent or orchestrator owns each authority decision, and how are circular delegation and hidden authority prevented?
- How are visual prototypes represented, versioned, reviewed, and converted into testable design constraints?
- How does human feedback invalidate or revise an active plan without corrupting task history?
- What evidence is required before a subagent result can be integrated or declared complete?
- How are failed attempts, retries, budget exhaustion, partial work, and recovery candidates handled?
- Which workload differences between software development, content generation, and general tasks require separate contracts or validators?
- What risks are acceptable for prompt-guided context discipline, and which tasks require enforced isolation?
- How should efficacy be compared with the current `master` workflow using controlled, repeatable tasks?
- Which skills can be genuinely modular and swappable, and which require explicit compatibility contracts or stable capabilities?
- Can globally available tools be safely composed by skills, or do some tools require agent-, host-, or risk-specific admission and safety profiles?
- Which backlog items are required for content generation, general task completion, and AI expert agents working with human domain experts?
- Which independent model family or specialist reviewer would most effectively challenge the proposed architecture?

## Durable handoff: Terra refinement

**Role:** Terra.

**Mode:** Read-only planning and analysis; do not implement, commit, or change task authority.

**Inputs:** This document, the supplied existing implementation, applicable repository guidance, and the current multi-model orchestration draft at `drafts/multi-model-development-orchestration.md`.

**Request:** Assess the existing implementation against the refined brief. Produce an implementation-ready approach rather than a speculative rewrite. Identify retained and changed boundaries, the smallest vertical slice, the target task and record model, delegation and integration flow, human feedback and escalation points, deterministic verification, migration stages, evaluation against `master`, and explicit risks or unresolved decisions. Refine the role split and identify the minimum repository changes needed for the first slice. Separate observations from recommendations and do not treat this draft as authority.

**Required output:** A structured report containing `finding`, `current-implementation-observations`, `proposed-architecture`, `vertical-slice`, `staged-plan`, `dependencies`, `acceptance-criteria`, `risks`, `open-questions`, `alternate-reviewer-profile`, `out-of-scope-items`, and `residual-uncertainty`. State whether the approach is ready for Sol review.

**Completion condition:** Terra returns a bounded plan and does not begin implementation.

## Durable handoff: Sol validation

**Role:** Sol.

**Mode:** Independent architectural and adversarial review; do not implement, commit, or change task authority.

**Inputs:** This document, the supplied existing implementation, applicable repository guidance, and Terra's durable refinement report. Sol should first form an independent view of the existing implementation before relying on Terra's proposed structure.

**Request:** Red-team the refined approach. Check whether the proposed architecture can safely support bounded autonomous development, human feedback, subagent delegation, integration, recovery, and later workload expansion. Challenge assumptions about autonomy, authority, context discipline, task boundaries, verification, visual design inputs, model routing, and self-application. Identify omissions, circular ownership, unsafe escalation behavior, untestable claims, and migration risks. Decide whether the first vertical slice and implementation sequence are architecturally sound.

**Required output:** A structured report containing `verdict` (`approve`, `revise`, or `reject`), `strengths`, `blocking-issues`, `missing-requirements`, `authority-boundary-risks`, `security-and-safety-risks`, `context-boundary-risks`, `acceptance-gaps`, `required-revisions`, `alternate-reviewer-profile`, and `residual-uncertainty`. State clearly whether implementation should proceed.

**Completion condition:** Sol provides an independent review and does not begin implementation.

## Durable handoff: alternate-family review

**Role:** A reviewer from a different model family or an appropriately independent specialist, selected after Terra and Sol recommend the required profile.

**Mode:** Bounded, read-only dissent and risk discovery.

**Inputs:** The refined brief, the proposed architecture and staged plan, the relevant current-implementation excerpts, and only the review scope necessary to assess the selected risk.

**Request:** Independently challenge the assumptions most likely to be shared by the primary model family. Prefer a profile covering software architecture, dependency/build boundaries, workspace isolation, reproducible evaluation, security, or human-in-the-loop governance as indicated by Terra and Sol. Review the plan without acquiring approval, implementation, task, or integration authority.

**Required output:** Identify overlooked failure modes, contradictory assumptions, omitted dependencies, unenforceable controls, evaluation flaws, and the smallest corrective changes. State what was not assessable from the supplied context.

**Completion condition:** The review is advisory and is preserved alongside disagreements; it does not silently override Terra or Sol.

## Durable handoff: Terra reconciliation

**Role:** Terra, after the independent reviews return.

**Request:** Reconcile the Terra plan, Sol validation, and alternate-family review into one proposed implementation approach. Preserve material disagreements and explain each accepted or rejected recommendation. Reduce the work to bounded tasks with explicit owners, dependencies, allowed scope, budgets, acceptance tests, non-goals, recovery actions, and integration evidence. Mark any item requiring human approval or a later architectural decision.

**Required output:** A versioned plan with `decision`, `accepted-constraints`, `task-graph`, `review-disposition`, `human-approval-points`, `evaluation-protocol`, `rollback-or-recovery`, and `remaining-questions`. State whether the plan is ready for human approval.

## Durable handoff: Luna implementation

**Role:** Luna, only after the reconciled plan is explicitly approved.

**Mode:** Bounded implementation; no architectural redesign, silent scope expansion, or autonomous approval.

**Inputs:** One approved task contract at a time, applicable repository guidance, the relevant design and decision records, and the approved validation/evaluation procedure.

**Request:** Implement only the assigned task. Read the task contract and necessary local context, avoid unrelated exploration, make the smallest safe change, add or update tests, run the required deterministic checks, and report files read, changed, and verified. Stop and escalate when a dependency, requirement, security boundary, or architectural assumption exceeds the task contract.

**Required output:** A structured handoff containing `finding`, `evidence`, `changed-scope`, `verification`, `recommendation`, `residual-risk`, `recovery-checkpoint`, and `integration-needs`. A successful process exit is not completion; the receiving builder or orchestrator must review evidence and own integration.

## Handoff protocol for future compaction

When resuming after context compaction, read this document first and restore state from the following fields: `Handoff state`, `Next owner`, `Review sequence`, the latest completed durable handoff, its verdict, unresolved questions, and the next action. Do not infer approval or implementation authority from conversation history, model output, process exit, or the existence of a branch commit.

Each downstream handoff must cite the source document and report, preserve source/result scope, distinguish observations from recommendations, identify residual uncertainty, and name the receiving owner. A handoff is not complete until its output is durably recorded and its next owner is explicit.

## Current next action

Provide the Terra refinement handoff above with the existing implementation and repository guidance. Do not implement the proposed rearchitecture until Terra, Sol, and any selected alternate-family reviewer have completed their bounded reviews and an authorized owner approves the reconciled plan.
