# Agentic Development System - User Ask And Durable Handoffs

## Status

This document is a draft proposal and durable handoff record. It is not implementation authority, current architecture authority, task authority, or runtime configuration. No implementation should begin solely because this document exists.

**Handoff state:** Terra refinement, Sol validation, Terra reconciliation, Sol re-review, Terra follow-up reconciliation, and Sol final re-review completed as advisory, read-only reports; expanded user direction is recorded; Terra expanded re-planning completed; Sol expanded re-review returned `revise`; implementation remains unauthorized and the target plan requires another Terra-Sol revision cycle.

**Current orchestrator:** this document is being maintained by the present orchestration session. The current session is not Terra.

**Next owner:** delegate the expanded Sol review to Terra for explicit disposition of each remaining blocker and revision of the target plan. Terra must correct the program-scope versus bounded-unit distinction, normalize target agent/skill rosters and source-to-target migration, clarify alternate-reviewer selection, broaden the rewrite escape criteria, complete self-application controls, and make workflow versus implementation-boundary benchmark inputs exact. Then delegate the revised plan to Sol for fresh independent re-review. No concrete alternate model family has been selected; selection remains a later evidence-based decision. The user is the then-current design reviewer. Implementation remains unauthorized. Sol and Terra were run as the `expert` read-only contract with explicit model overrides because no canonical Sol/Terra presets currently exist. These mappings are execution observations, not approved target-system role mappings.

**Review sequence:** Terra design refinement and implementation-plan enrichment [complete, advisory] -> Sol independent architectural validation [complete, revise] -> user feedback [received, substantive partial] -> Terra reconciliation [complete, intermediate advisory] -> Sol re-review [complete, approve for limited design-direction approval] -> additional user inputs [received, substantive] -> Terra follow-up reconciliation [complete, advisory] -> Sol final re-review [complete, approve readiness for next design package] -> expanded user direction [received, substantive] -> Terra expanded re-planning [complete, advisory] -> Sol expanded re-review [complete, revise] -> Terra blocker disposition and revision [pending] -> Sol fresh re-review [pending] -> full human-facing target design package [pending] -> explicit user design alignment [pending] -> setup-inclusive comparative first slice [pending] -> bounded implementation. Alternate-family review remains conditional on residual risk.

## Core project principle

> **Humans focus on design and features; agents take care of implementation.**
>
> Implementation is the verified, evidence-bearing equivalent of compiled output for humans: it realizes the human-facing design without making implementation a second design authority. This is a communication metaphor, not a claim that software implementation is literally compilation or that implementation can be trusted without verification. Human-facing design should be communicated through images, diagrams, tables, and other structured representations wherever those make intent easier to understand.

This principle governs the rearchitecture. Internal consistency with the overarching goal is more important than mechanically preserving the current design, but deviations from the current implementation or durable records must be surfaced and escalated rather than applied silently.

## Verbatim user ask

```text
I tried create an agentic devlopment system, with the help of AI. There's a working implementation (existing arcitecture will be provided); which looks like it could be rearchitectured. The goal of the system is allow autonomus development of applications, content and genral task completion (later). Humans will be consulted only in the prototyping (primarilly through visuals) and design phases. They allso will provide feedback and raise issues. The system should take care of the implementation, with subagents, while giving the human the ability interact with it to understand status, provide feedback, etc. We don't have to worry about the user interface. The same philosopy could be used to implement the system itself. Feel free to question, suggest and highlight issues.
```

## Refined user prompt

The following is the approved refinement of the user's request for downstream planning. It preserves the original ask above while making the intended scope, authority boundaries, and review outputs explicit. It remains a request for assessment and planning, not implementation authority.

```text
I have an existing working implementation of an AI-assisted agentic development system. I will provide its current architecture and implementation for review. The implementation works, but its architecture may need to be restructured. Do not assume that the existing architecture is correct, and do not propose a large rewrite before understanding what should be retained, adapted, isolated, deprecated, or replaced.

The long-term goal is a reusable system that can autonomously develop applications, produce content, and eventually complete more general tasks for this and other consuming projects. Software development is the initial priority. Content generation and general task completion are later backlog areas that should influence the extensibility of the initial design without expanding the first implementation beyond its justified scope.

The system should take a human-approved goal through human-facing prototyping and design into implementation performed by bounded subagents. The planning phase should focus primarily on producing and revising human-facing design documents, including images, diagrams, tables, and other structured representations. Implementation may start only after the user has explicitly aligned on the design direction. The guiding principle is: humans focus on design and features, while agents take care of implementation. Implementation should be presented to humans as the equivalent of compiled output: its correctness is established through traceable design alignment, deterministic verification, review, and observable evidence rather than requiring humans to perform routine implementation. This is a communication metaphor, not a claim that implementation is literally compilation or can be trusted without verification. Humans should primarily participate in prototyping and design, including visual feedback where useful, and should be able to provide feedback, raise issues, inspect status, and intervene when necessary. Routine implementation should not require continuous human involvement. The system should provide sensible minimal defaults for approval and escalation gates, while the implementing project should define and evolve the concrete gates and workflows. Legal, security, financial, operational, and other specialist concerns should be represented as future expert-agent and domain-expert collaboration backlog items rather than ignored or treated as solved by generic orchestration; specialist review is another kind of bounded task, with the required human-domain-expert collaboration and gates defined by the implementing project.

Design should be conveyed for efficient human consumption through images, diagrams, tables, and other suitable visual or structured representations, not only through prose. The system need not prescribe a user interface, but the planning should account for these representation needs.

User-interface design is out of scope. Describe the behavioral and information needs for human status inspection, feedback, issue reporting, approval, and escalation without designing the UI itself. Any target-system contracts proposed during review must be explicitly labelled provisional; Sol is responsible for defining or approving target-system contracts, not this orchestration draft.

The system should support modular, swappable skills. Tools should be globally available through the platform and used by skills when appropriate; skills should not duplicate tool implementations or become hidden authority boundaries. Challenge this arrangement if the supplied implementation shows that explicit capability declarations, host safety profiles, or another composition boundary are required.

The system is intended to be reusable by other projects. The planning should address installation or consumption, project-local configuration and durable records, skill and tool distribution, host/runtime prerequisites, compatibility and versioning, project isolation, upgrades, and provider-dependent operation. Do not choose a distribution model without examining the existing implementation and its consumers.

Assess how the system should represent goals, requirements, prototypes, designs, feedback, issues, and expert input; decompose approved work into bounded tasks; assign tasks to appropriately capable subagents; constrain subagent scope, context, tools, budgets, and authority; coordinate dependencies and integrate results; review Luna's implementations with deterministic checks and appropriately scaled independent review; report status and preserve evidence; handle failures, retries, partial work, recovery, and escalation; revise plans when implementation or human feedback changes requirements; and support future content and general-task workflows without overgeneralizing the initial software-development design.

The same development philosophy may be used to improve the agentic system itself. Treat that as a possible bootstrap application, not as permission for generated plans or model output to become implementation authority automatically.

Use the supplied implementation and repository guidance as evidence. Question the assumptions in this request, identify risks and contradictions, and suggest alternatives. Prefer an incremental migration and a small end-to-end vertical slice over a speculative whole-system rewrite. Capture future workloads, specialist expert agents, domain-expert collaboration, and related workflow extensions in backlogs with explicit dependencies and sequencing.

Produce an assessment of the existing architecture; a proposed target architecture and responsibility boundaries; the smallest useful first vertical slice; an incremental migration and implementation plan; recommendations for task, evidence, validation, feedback, expert-input, and approval handling; the model and subagent orchestration strategy; deterministic verification and recovery requirements; risks, non-goals, unresolved decisions, and assumptions; and an evaluation plan comparing the proposed workflow with the current implementation. Do not implement changes during the architecture and planning review. Clearly separate observations, recommendations, provisional target-system contracts for Sol's review, decisions requiring human approval, backlog items, and implementation tasks.
```

### User feedback received after Sol review

The following feedback is preserved verbatim as a durable input to Terra reconciliation and subsequent architectural review. It is not by itself target-system contract authority or implementation authorization.

```text
## General Thoughts
Human escalation is the responsibility of the orchestrator. Other agents can escalate to their caller though, the callers could decide on how to act, when they asses the escalation is not under their purview, they can bubble it up to the next caller, eventually ending up with the orchestrator. Based on context there could be various agents that orchestrate, usually it would be the component-builder and the as-is agent.

If needed we could have a separate skill / agent group for the prototyping and design part.

One crucial item was missed, on when does design complete and implementation begin. There could be two paths to it. One, where the design (as-is.md) generates input for subsequent flows, like architecture diagrams, UI mockups etc, here the final artifacts are considered to be the implementation (which the human reviews). Another, have the artifacts built in the planning phase, as a separate branch and the merged to master post implementation. Human review still plays a part. The key difference is that as-is document doesn't only talk about the component "as-is" currently, but also the target state, probably as a separate section. We can align on this again.

Feedback happens post design and  post implementation.

Workflow orchestration is done by various agents. Currently we could do with component builder and task implementer (or a better name). The skills provide the flow, but the agent is the orchestration authority.

Apart from reviews, sol could suggest things, too.

## On Blocking Issues
1. Authority discussed in the previous section.
2. Agreed. Instead of enforcing it mechanically, could it be verified post-implementation?
3. And this might not always be the case, as there are leaf level design documents, which the human did not (and doesn't have to review).
4. A proposal is needed.
5. A proposal is needed.
6. Tool availability is decided by the agent, not the skill.
10. Checking the internet would help here.

For the rest of the items. Terra and Sol can align.
```

### Additional user decisions and questions

The user supplied the following follow-up inputs. They are substantive planning input, not target-system contract authority or implementation authorization.

```text
Answers for the questions:

1. Discussed in the previous section.
2. The availability and approval of the base as-is documents for the entire implementation. marks the completion of the design phase.
3. The then current user is the reviewer.
4. Look at answer 2.
5. I could even be a mock feature.
6. Never, as long as models can differentiate the current and planned designs.
7. Not getting the meaning of "material change".

A few items, that weren't discussed explicitly. The current branch (during the utilization of the skill), doesn't always have to be the master.

Aren't there a list of skills or agents that are replaced or dropped.
```

### Expanded scope feedback received after the final Sol re-review

The user supplied the following additional direction. It is substantive planning input, not target-system contract authority or implementation authorization.

```text
Haven't we decided on the alternate-reviewer model, yet? The current implementation of quite a few agents and skills might need some heaving refactoring and trimming down, is this recorded somewhere? Will the new implementation be a mere continuations of the existing ones? Heavy refactoring or even a total rewrite is fine? Why aren't there any new tables in the above reponse? The entire implemetation means the achivemnt of the stated goal through a revised / refactored set of skills and agents. Was drafts/composable-skills.md consulted for direction? The first slice could be some existing (simple) backlog item. Ideally, we should cover the setup part too and create a mock project somewhere and try to test both setups agains one of the projects features (in different dirs) and compare. The "owners not mentioned" could be solved by identifying / creating the right agents. Rollback won't be needed, as the implementation is sone in a separate branch (current).
```

The current interpretation is that the target may be a heavy refactor and, if evidence later requires it, a total rewrite; it is not required to be a mere continuation. `drafts/composable-skills.md` is proposal direction and must be used in the re-plan, but remains non-authoritative. Setup/consumption is part of the target evaluation. The active branch is the candidate and recovery boundary for this exercise, while `master` is only a pinned comparison baseline; no separate rollback mechanism should be designed unless a concrete need is demonstrated. Terra must provide explicit tables and Sol must re-review the expanded plan. No concrete alternate-reviewer model has yet been selected; only reviewer profiles and the selection criteria have been discussed.

### Interpretation notes

- "Humans consulted primarily in prototyping and design" means humans do not perform routine implementation; it does not remove necessary approval, intervention, or escalation authority.
- Legal, security, financial, operational, and other specialist concerns are future workflow capabilities. The system should plan backlog items for AI expert agents working with human domain experts, while the implementing project defines concrete gates and workflows from minimal defaults.
- Content generation and general task completion are later backlog areas. They should inform modular boundaries and extension points, but should not silently expand the first vertical slice.
- Modular and swappable skills, with globally available tools composed by skills, are a proposal to validate against the existing architecture. Skills must not duplicate tools or acquire hidden authority merely through composition.

## Refined development brief

### Problem

There is an existing working implementation of an AI-assisted agentic development system. Its current architecture may not be the best foundation for autonomous software development, content production, and later general task completion. The existing architecture will be supplied for assessment rather than assumed to be correct.

The repository's `as-is.md` records are the durable representation of the existing setup, including component boundaries, purpose, current design context, and links. They are the primary starting point for reconstructing the current system, together with the implementation itself. They are evidence for this rearchitecture exercise, not automatic authority for the target architecture or permission to implement their backlogs.

`drafts/design-realization-flows.md` records the user's earlier manual attempt to rearchitect the solution. While developing that attempt, the user recognized that AI could be used to perform the same design-and-realization exercise, which started this current investigation. That draft is historical design context and must not be treated as an implementation plan.

### Desired outcome

Design and incrementally implement a reliable agentic system that can take a human-approved goal through prototyping and design into autonomous implementation by bounded subagents. The system should preserve human visibility, feedback, issue reporting, approval, and escalation channels while minimizing routine human participation in implementation. The implementing project should define concrete gates and workflows, starting from sensible minimal defaults. The same development method should be usable to build and improve the system itself.

### Initial scope

- Assess the supplied implementation and its architecture before proposing a rewrite, using the relevant `as-is.md` records as the durable representation of the current setup.
- Define the system's goals, boundaries, responsibilities, and authority model.
- Support software/application development as the first primary workload.
- Treat content generation and later general task completion as backlog areas and planned extensions. They should influence modularity and extensibility decisions without becoming first-iteration implementation scope unless a review establishes a necessary dependency.
- Define how human input enters during visual prototyping, design, feedback, issue raising, approval, and escalation.
- Define how the system decomposes work, assigns bounded subagent tasks, integrates results, verifies outcomes, reports status, and recovers from failure.
- Define review of Luna's bounded implementation: deterministic verification is required for every task, Terra or the receiving builder reviews ordinary results, and Sol or a human reviews high-risk, architectural, security-sensitive, or otherwise escalated results.
- Define an incremental implementation strategy with a small end-to-end vertical slice before broad rearchitecture, while keeping planning focused on human-facing design documents until the user aligns on the design direction.
- Define how the system can apply its own workflow to its implementation without granting generated plans implicit authority.

### Human role

Humans participate actively in prototyping and design, primarily through visual artefacts where useful, and can provide feedback or raise issues throughout the lifecycle. "Consulted primarily in prototyping and design" means that humans do not perform routine implementation; it does not silently remove approval, intervention, safety, specialist, release, or exception authority where those controls are necessary. The implementing project should define and evolve the concrete gates and workflows, starting from sensible minimal defaults. Future backlog items may introduce AI expert agents that work with human domain experts on legal, security, financial, operational, and other specialist concerns.

The system should expose status and feedback interaction as a capability even though the user-interface design is out of scope. The planning review should describe what information humans need to inspect, what feedback can change, which changes require re-planning, and which actions require explicit approval; Sol should define or approve any target-system representation. User alignment on the human-facing design is a mandatory gate before implementation begins; later feedback may still trigger re-planning or a new design-alignment gate.

### Existing records and non-authoritative history

Models may read relevant `backlog.md`, `changelog.md`, and related historical records to understand the course of the existing work, prior decisions, abandoned approaches, and unresolved concerns. These records are context only. They are not implementation guidance, active task authority, approval, or a request to implement their items. The task is to achieve the overarching goal described here, not to implement the backlog. Active task authority comes only from an explicitly approved downstream task.

### Modularity and composition

Skills should be modular and swappable where Sol-approved compatibility criteria permit substitution. Tools should be globally available through the platform and used by skills as appropriate, rather than reimplemented inside each skill. This is a design hypothesis to validate against the existing implementation: explicit capability declarations, host safety profiles, and agent-owned authority may still be required even when tool implementations are globally available. A skill remains a reusable procedure and must not silently select, authorize, start, delegate, integrate, or complete work merely because it can call a tool.

Future content-generation, general-task, and specialist expert-agent workflows should be captured in backlogs with dependencies and migration sequencing. Their existence should inform stable interfaces and extension points without forcing premature implementation.

### Agentic role model

- A stronger model should define architectural constraints, resolve high-risk ambiguity, and review architectural changes.
- A planning and coordination model should refine Sol-approved architecture into proposed bounded tasks, dependencies, acceptance criteria, and implementation work without independently defining target-system contracts.
- A lower-cost implementation model should execute narrow approved tasks, add tests, run deterministic checks, and stop when the task exceeds its authority.
- Subagents should operate through the canonical Pi delegation mechanism and should receive explicit role, scope, budget, evidence, and handoff requirements.
- Deterministic tests, type checks, linting, builds, security checks, and other suitable validators should provide evidence independent of model confidence.

Sol, Terra, and Luna are the current implementation's proposed roles, not mandatory roles of the target system. During construction, the system may define additional purpose-specific agents and associate them with suitable models. Terra should refine the plan, Sol should independently challenge it and define or approve target-system representations, and Luna or another selected implementation agent should not receive implementation work until the applicable plan and task definitions are approved. Model selection may use current OpenRouter Benchmark APIs when available and authorized; credentials must remain in the environment and never enter prompts, records, telemetry, or output.

### Core design principles

- Treat the existing implementation as evidence and a migration starting point, not as unquestionable authority. Internal consistency with the overarching goal is more important than preserving the current design; deviations from current behavior or recorded assumptions must be identified and escalated rather than made silently.
- Make authority explicit in durable task records, Sol-approved target-system representations, acceptance criteria, and approval gates.
- Separate planning, implementation, validation, integration, recovery, and human approval responsibilities.
- Use bounded tasks with explicit allowed scope, dependencies, non-goals, budgets, and completion evidence.
- Prefer incremental vertical slices over a large speculative rewrite.
- Keep deterministic verification in the control loop.
- Preserve human escalation for high-risk, ambiguous, security-sensitive, irreversible, or persistently failing work.
- Treat the human-facing design and feature intent as the primary specification and implementation as its verified, evidence-bearing realization.
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

## Planning review agenda

This agenda is part of the current rearchitecture exercise. The overall goal and the settled inputs below have priority over preserving the current implementation design. A proposed deviation is acceptable when it improves alignment and internal consistency with the goal, but it must be identified, justified, and escalated rather than applied silently.

The following are settled inputs to the review, not questions for the models to reopen without evidence:

- Humans primarily support prototyping and design and provide feedback, issue reports, status inquiries, and intervention; they do not perform routine implementation. Necessary approval and escalation gates remain, with minimal defaults refined by the implementing project.
- Software development is the first workload. Content generation, general task completion, and specialist expert-agent/domain-expert workflows are backlog areas that inform extensibility but are not first-iteration implementation scope unless a necessary dependency is demonstrated.
- The rearchitecture should focus primarily on agents, skills, orchestration, and their boundaries. Existing tools should be reused as much as possible; critical tool extensions are allowed when justified.
- Planning should first produce human-facing design documents and secure explicit user alignment on the design direction. No implementation task may start before that alignment gate is satisfied.
- Sol, Terra, and Luna describe the current implementation's proposed model roles, not a fixed target roster. The target system may create additional agents and model assignments when the goal, risk, and available benchmark evidence justify them.
- Internal consistency with the overarching goal takes precedence over mechanically following the current design. Deviations from the current implementation, `as-is.md` records, or historical assumptions must be surfaced and escalated rather than silently applied.
- Model selection and alternate-reviewer selection may use authorized OpenRouter Benchmark APIs and environment-provided credentials without exposing credentials in durable artifacts.
- Skills are intended to be modular and swappable, while globally available tools may be composed by skills as appropriate. The models may challenge this arrangement if the existing implementation demonstrates a need for explicit capability or safety boundaries.
- Relevant `as-is.md`, backlog, and changelog records may be read for current-state reconstruction and historical context, but none of them is implementation guidance for this task. The task is to achieve the overarching goal, not to implement backlog items.
- The current user manual rearchitecture attempt in `drafts/design-realization-flows.md` is historical input to the exercise, not an approved design or implementation plan. It records the manual rearchitecture attempt that led to using AI for the same design-and-realization exercise.

The review should decide or recommend:

- What human-facing design documents, visual representations, and design-alignment evidence are needed before implementation can begin.

- Which parts of the current implementation and tool surface should be retained, adapted, isolated, deprecated, or replaced.
- What is the smallest end-to-end vertical slice that demonstrates useful autonomous development.
- Which agent or orchestrator owns each authority decision, and how circular delegation and hidden authority are prevented.
- How visual prototypes and human feedback become sufficiently durable design input without designing the UI.
- What evidence is required before a Luna result can be reviewed, integrated, or declared complete, and when Terra, Sol, a specialist, or a human must review it.
- How failed attempts, retries, budget exhaustion, partial work, and recovery candidates are handled.
- What risks are acceptable for prompt-guided context discipline and which task classes require enforced isolation.
- How efficacy should be compared with the current `master` workflow using controlled, repeatable tasks; the benchmark is a required part of the implementation plan, not an optional afterthought.
- Which future backlog items and dependencies are needed for content generation, general task completion, and AI expert agents working with human domain experts.
- Which independent model family or specialist reviewer would most effectively challenge the proposed architecture, and how OpenRouter Benchmark API evidence can inform that selection without making benchmark ranking the sole authority.
- How the system can be installed or consumed by other projects while isolating project-specific configuration, records, state, tools, and provider credentials.
- Which additional agents and model assignments should be created during construction rather than assuming the current Sol/Terra/Luna roster is sufficient.
- Which target-system contracts, if any, Sol should define or approve. This orchestration draft does not define them.

## Durable handoff: Terra refinement

**Design-first gate:** Terra's output must prioritize human-facing design documents and must not authorize implementation. Implementation planning may become concrete, but implementation cannot begin until the user explicitly aligns on the applicable design.

**Role:** Terra.

**Mode:** Read-only planning and analysis; do not implement, commit, or change task authority.

**Inputs:** This document, the supplied existing implementation, relevant `as-is.md` records, applicable repository guidance, relevant backlog and changelog history as context only, `drafts/design-realization-flows.md` as historical context only, and the current multi-model orchestration draft at `drafts/multi-model-development-orchestration.md`.

**Request:** Assess the existing implementation against the refined brief. Use `as-is.md` records to understand the current setup and use backlog/changelog records only to understand history and course; do not treat them as implementation guidance and do not implement their items. Read `drafts/design-realization-flows.md` as the user's historical manual rearchitecture attempt, not as an implementation plan. Produce an implementation-ready approach toward the overarching goal rather than a speculative rewrite or a backlog implementation plan. Focus changes primarily on agents, skills, orchestration, and their boundaries; reuse existing tools wherever possible and identify only justified critical tool extensions. Treat Sol, Terra, and Luna as current implementation roles that may be supplemented or replaced by additional purpose-specific agents selected during construction. Identify retained and changed boundaries, the smallest vertical slice, the target task and record approach, delegation and integration flow, human design/feature input and visual representations, feedback and escalation points, review of implementation-agent results, deterministic verification, migration stages, installation or consumption by other projects, model selection and alternate-reviewer selection using authorized OpenRouter Benchmark APIs where useful, the benchmark against `master`, and explicit risks or unresolved decisions. Internal consistency with the overarching goal is more important than preserving the current design, but deviations from current behavior or records must be surfaced and escalated rather than silently applied. Refine, verify, and enrich the implementation approach and identify the minimum repository changes needed for the first slice. Do not define target-system contracts; identify where Sol must define or approve them. Separate observations and historical context from recommendations, decisions, backlog items, and implementation tasks, and do not treat any draft or history record as authority.

**Required output:** A structured report containing `finding`, `current-implementation-observations`, `proposed-architecture`, `vertical-slice`, `staged-plan`, `dependencies`, `agent-and-model-selection`, `installation-and-consumption`, `implementation-review-approach`, `benchmark-plan`, `risks`, `open-questions`, `alternate-reviewer-profile`, `provisional-contract-questions-for-sol`, `out-of-scope-items`, and `residual-uncertainty`. State whether the approach is ready for Sol review.

**Completion condition:** Terra returns a bounded, verified, and enriched design-first implementation approach and does not begin implementation. The approach must identify the human-facing design documents and the explicit user-alignment gate that precede implementation planning and execution.

## Durable handoff: Sol validation

**Role:** Sol.

**Mode:** Independent architectural and adversarial review; do not implement, commit, or change task authority.

**Inputs:** This document, Terra's durable refinement report at `reviews/agentic-development-system/terra-refinement-report.md`, the supplied existing implementation, relevant `as-is.md` records, applicable repository guidance, relevant backlog and changelog history as context only, and `drafts/design-realization-flows.md` as historical context only. Sol should first form an independent view of the existing implementation before relying on Terra's proposed structure. Sol's result is durably recorded at `reviews/agentic-development-system/sol-validation-report.md`.

**Request:** Red-team the refined approach. Use historical backlog and changelog records only as context, not as implementation guidance; the task is to achieve the overarching goal, not to implement backlog items. Check whether the proposed architecture can safely support bounded autonomous development, human design and feature input, visual/structured design communication, subagent delegation, integration, recovery, review of implementation-agent results, installation for other projects, and later workload expansion. Sol is reviewing the current implementation's Sol/Terra/Luna arrangement, not approving it as the target roster; assess whether additional agents and model assignments are needed. Focus the proposed restructuring primarily on agents, skills, orchestration, and their boundaries, while challenging unnecessary tool replacement and identifying justified critical tool extensions. Challenge assumptions about authority, context discipline, task boundaries, verification, model selection, OpenRouter Benchmark API use, alternate-family reviewer selection, modular/swappable skills, globally available tools, self-application, project isolation, and provider credentials. Identify omissions, circular ownership, unsafe escalation behavior, untestable claims, and migration risks. Internal consistency with the overarching goal is more important than preserving the current design, but deviations from current behavior or records require explicit escalation. Define or approve any target-system contracts that the plan requires, clearly distinguishing them from this orchestration proposal. Decide whether the first vertical slice, benchmark against `master`, installation approach, and implementation sequence are architecturally sound.

**Required output:** A structured report containing `verdict` (`approve`, `revise`, or `reject`), `strengths`, `blocking-issues`, `missing-requirements`, `authority-boundary-risks`, `security-and-safety-risks`, `context-boundary-risks`, `implementation-review-requirements`, `benchmark-review`, `installation-and-consumption-review`, `agent-and-model-roster-review`, `target-system-contracts-defined-or-approved`, `acceptance-gaps`, `required-revisions`, `alternate-reviewer-profile`, and `residual-uncertainty`. State clearly whether implementation should proceed.

**Completion condition:** Sol provides an independent review and does not begin implementation.

## Durable handoff: alternate-family review

**Role:** A reviewer from a different model family or an appropriately independent specialist, selected after Terra and Sol recommend the required profile.

**Mode:** Bounded, read-only dissent and risk discovery.

**Inputs:** The refined brief, the proposed architecture and staged plan, relevant current-implementation excerpts and `as-is.md` records, the benchmark proposal, and only the review scope necessary to assess the selected risk. Backlogs, changelogs, and `drafts/design-realization-flows.md` may provide historical context but are not implementation guidance.

**Request:** Independently challenge the assumptions most likely to be shared by the primary model family. Prefer a profile covering software architecture, agent/skill composition, tool reuse and extension boundaries, installation and project isolation, reproducible evaluation, model selection, benchmark interpretation, security, or human-in-the-loop governance as indicated by Terra and Sol. Review the plan and benchmark without acquiring approval, implementation, task, or integration authority. Do not treat historical records or backlogs as implementation instructions. The reviewer may be selected with authorized OpenRouter Benchmark API evidence, but benchmark rankings are evidence rather than approval authority.

**Required output:** Identify overlooked failure modes, contradictory assumptions, omitted dependencies, unenforceable controls, evaluation flaws, and the smallest corrective changes. State what was not assessable from the supplied context.

**Completion condition:** The review is advisory and is preserved alongside disagreements; it does not silently override Terra or Sol.

## Durable handoff: Terra reconciliation

**Additional reconciliation requirements:** Terra must interpret the user's design-completion answer as: design completes when the base `as-is.md` documents required for the implementation are available and approved by the then-current user/reviewer. Terra must clarify whether this means the complete implementation's base design or the base design for the next bounded implementation unit, and must preserve current-versus-planned state as distinct, clearly labelled content so the system can differentiate them. The first slice may be a mock feature. Path B is not expected to be used if the models can reliably distinguish current and planned designs. The active branch is a task/workspace context and need not be `master`; baseline comparison against `master` is an evaluation concern, not a universal branch requirement. Terra must produce a clear disposition matrix for every current agent and skill: retain, adapt, compose, replace, deprecate, or drop, with evidence, consumers, migration path, and unresolved authority. The matrix must distinguish the historical proposal to replace all skills from the current live catalog and must not silently remove anything.

**Ping-pong review rule:** Terra's reconciliation is an intermediate proposal, not a terminal review result. Each material Sol objection must receive an explicit Terra disposition and, where accepted, a revised proposal; each material revision must return to Sol for independent re-review. The loop ends only with Sol's approval of the revised approach or a durable statement that a specific residual disagreement requires human decision. Neither model's agreement substitutes for user alignment or implementation authorization. Terra should use serial in-process `call_subagent` consultations with the Sol role for focused feedback and suggestions when available, while preserving a fresh independent Sol re-review for the final material revision.

**User-input constraints for reconciliation:** Treat the user's escalation model, agent-owned orchestration model, post-design and post-implementation feedback points, optional dedicated design-agent group, and two proposed design-to-implementation paths as substantive inputs. Treat the exact design-completion semantics, target-state placement in `as-is.md`, leaf-document review requirements, post-implementation verification boundary, and artifact-branch merge lifecycle as decisions to propose clearly for renewed user alignment rather than silently deciding. Preserve the distinction that agents may decide which globally available tools they use within their admitted capabilities, while skills do not grant capabilities or authority and fixed host/task safety constraints still apply. Terra should also incorporate the verified OpenRouter documentation evidence that `/api/v1/benchmarks` and the Data API exist, while distinguishing those sources from project-specific evaluation and approval authority.

**Role:** Terra, after the independent reviews return.

**Request:** Reconcile the Terra plan, Sol validation, and the user's feedback into one proposed implementation approach. Use serial in-process `call_subagent` consultations with the Sol role for focused feedback and suggestions when available, then preserve a fresh independent Sol re-review for the final material revision. Preserve material disagreements and explain each accepted or rejected recommendation. Incorporate the additional user decisions and questions above. Explain design completion in plain language, distinguish the base design for the whole implementation from the base design for one bounded unit, define a simple alternative to the unclear term “material change,” and clarify that the active branch need not be `master`. Add a complete current-agent/current-skill disposition matrix covering retain, adapt, compose, replace, deprecate, and drop candidates, with the historical all-skills replacement proposal clearly separated from the live catalog and from the target recommendation. Treat the user's escalation and orchestration direction as inputs, not as permission to suppress safety concerns. Resolve the design-completion boundary explicitly: compare the two proposed paths (design artifacts generated from a target-state design document versus planning-branch artifacts merged after implementation), explain when each applies, distinguish human-reviewed design documents from derived leaf-level design documents, and define how post-design and post-implementation feedback affect status and re-planning. Propose how `as-is.md` can represent current and target state without conflating them. Define the smallest role set using agent-owned orchestration and skill-provided procedures, including escalation bubbling to the orchestrator and the possibility of a dedicated design/prototyping agent group. Incorporate Sol's proposals for review, isolation, environment/credential handling, installation, migration, and benchmark controls, but right-size them to the first software-development slice and identify which are required controls versus later hardening. Incorporate the verified OpenRouter benchmark and Data API documentation as evidence without making provider data approval authority. Reduce the result to bounded tasks with explicit owners, dependencies, allowed scope, budgets, acceptance tests, non-goals, recovery actions, and integration evidence. Mark every item requiring renewed human alignment, Sol decision, or later architectural decision.

**Required output:** A versioned plan with `decision`, `accepted-constraints`, `task-graph`, `review-disposition`, `human-approval-points`, `evaluation-protocol`, `rollback-or-recovery`, and `remaining-questions`. State whether the plan is ready for human approval.

## Durable handoff: Luna implementation

**Role:** Luna, only after the reconciled plan is explicitly approved.

**Mode:** Bounded implementation; no architectural redesign, silent scope expansion, or autonomous approval.

**Inputs:** One approved implementation task at a time, applicable repository guidance, the relevant approved design and decision records, and the approved validation/evaluation procedure. Backlogs and changelogs are context only unless an explicit task authority selects a specific item.

**Request:** Implement only the assigned task toward the overarching goal, and only after the user has explicitly aligned on the applicable human-facing design. Read the approved task description and necessary local context, avoid unrelated exploration, make the smallest safe change, reuse existing tools where possible, add or update tests, run the required deterministic checks, and report files read, changed, and verified. Do not implement backlog items merely because they are visible. Stop and escalate when design alignment is missing or revoked, or when a dependency, requirement, security boundary, or architectural assumption exceeds the approved task. Every implementation-agent result must be reviewed: deterministic checks are mandatory, Terra or the receiving builder reviews ordinary results, and Sol, a specialist, or a human reviews high-risk, architectural, security-sensitive, or otherwise escalated results. Luna is the current implementation example, not a mandatory target-system role; the approved task may be assigned to another purpose-specific agent and model.

**Required output:** A structured handoff containing `finding`, `evidence`, `changed-scope`, `verification`, `recommendation`, `residual-risk`, `recovery-checkpoint`, and `integration-needs`. A successful process exit is not completion; the receiving builder or orchestrator must review evidence and own integration.

## Current-session compaction protocol

This is an operating procedure for the present global orchestration session, not a requirement or feature of the target agentic system. When the current orchestrator's estimated remaining context capacity falls below 20% of its context window, pause the session and create a durable checkpoint before continuing. The 20% threshold is a practical pause signal, not exact provider token accounting.

At or before the threshold, stop launching new work, record the current owner, review stage, source and result references, decisions, unresolved questions, budget observations, next action, and active recovery obligations in this document or a linked durable handoff. Then compact or start a fresh orchestrator session and resume from the durable checkpoint. Do not rely on conversational context surviving compaction.

A child or reviewer may continue only when its bounded handoff is safely preserved. The checkpoint must distinguish completed, active, blocked, and merely recommended work, and must never infer approval from a process exit or model response. This protocol must not be copied into the target system's runtime requirements unless a later architecture decision independently establishes such a need.

## Handoff protocol for future compaction

When resuming after context compaction, read this document first and restore state from the following fields: `Handoff state`, `Next owner`, `Review sequence`, the latest completed durable handoff, its verdict, unresolved questions, and the next action. Re-read the relevant `as-is.md` records to reconstruct the existing setup, then consult backlog and changelog records only for historical context. Do not infer approval or implementation authority from conversation history, model output, process exit, a backlog item, or the existence of a branch commit.

The current setup is represented durably by the repository's `as-is.md` records. The prior manual rearchitecture attempt is represented by `drafts/design-realization-flows.md`. The current model-orchestration proposal is represented by `drafts/multi-model-development-orchestration.md`. These references must remain visible in every resumed handoff so compaction does not collapse current-state evidence, historical context, and proposed target design into one authority source.

The Terra result is durably recorded at `reviews/agentic-development-system/terra-refinement-report.md`, the Sol result at `reviews/agentic-development-system/sol-validation-report.md`, the reconciliation at `reviews/agentic-development-system/terra-reconciliation-report.md`, the Sol re-review at `reviews/agentic-development-system/sol-re-review-report.md`, the follow-up at `reviews/agentic-development-system/terra-follow-up-report.md`, and the final Sol review at `reviews/agentic-development-system/sol-final-re-review-report.md`. The latest expanded user direction is recorded in this brief. Terra's expanded re-plan is durably recorded at `reviews/agentic-development-system/terra-expanded-replan-report.md`, and Sol's expanded review at `reviews/agentic-development-system/sol-expanded-re-review-report.md`. After compaction, the resumed orchestrator's next substantive step is to delegate the Sol findings to Terra for blocker disposition and plan revision, then return the revised plan to Sol. Any later child must be launched through `skills/spawning-pi-subagents`, not directly invoking an arbitrary Pi process, and must receive the durable brief, applicable reports, relevant current-state records, and an explicit read-only planning instruction during this stage.

Each downstream handoff must cite the source document and report, preserve source/result scope, distinguish observations from recommendations, identify residual uncertainty, and name the receiving owner. A handoff is not complete until its output is durably recorded and its next owner is explicit.

## Current next action

Terra's advisory refinement report is preserved at `reviews/agentic-development-system/terra-refinement-report.md`, Sol's independent validation at `reviews/agentic-development-system/sol-validation-report.md`, Terra's reconciliation at `reviews/agentic-development-system/terra-reconciliation-report.md`, Sol's re-review at `reviews/agentic-development-system/sol-re-review-report.md`, Terra's follow-up at `reviews/agentic-development-system/terra-follow-up-report.md`, Sol's final re-review at `reviews/agentic-development-system/sol-final-re-review-report.md`, Terra's expanded re-plan at `reviews/agentic-development-system/terra-expanded-replan-report.md`, and Sol's expanded review at `reviews/agentic-development-system/sol-expanded-re-review-report.md`. Sol returned `revise`; the expanded target plan needs another Terra-Sol cycle. Delegate Sol's remaining blockers to Terra for explicit dispositions and revision, then send the revised plan back to Sol. Implementation must not proceed. The active candidate branch is the recovery/reversal boundary for this exercise; no separate rollback mechanism is planned unless a concrete need is demonstrated.
