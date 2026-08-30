# Agentic Development System — High-Level Target Design Proposal

## Contents

- [1. Executive orientation](#1-executive-orientation)
- [2. Provenance, status, and limitations](#2-provenance-status-and-limitations)
  - [Observations](#observations)
  - [Assumptions used in this proposal](#assumptions-used-in-this-proposal)
  - [Limitation](#limitation)
- [3. Current system versus planned target](#3-current-system-versus-planned-target)
- [4. Proposed target architecture](#4-proposed-target-architecture)
  - [Human-readable system view](#41-human-readable-system-view)
  - [Architectural planes](#42-architectural-planes)
  - [Component hierarchy and realization ownership](#43-component-hierarchy-and-realization-ownership)
- [5. Human-facing design and representation](#5-human-facing-design-and-representation)
  - [Proposed design package](#51-proposed-design-package)
  - [Workflow benchmark and evaluation](#workflow-benchmark-and-evaluation--advisory-not-authority)
  - [Required human-facing views](#52-required-human-facing-views)
  - [Human status and interaction needs](#53-human-status-and-interaction-needs)
- [6. Lifecycle and control points](#6-lifecycle-and-control-points)
- [7. Authority, orchestration, and escalation](#7-authority-orchestration-and-escalation)
  - [Authority model](#71-authority-model)
  - [Escalation](#72-escalation)
- [8. Proposed agent disposition](#8-proposed-agent-disposition)
- [9. Proposed skill disposition](#9-proposed-skill-disposition)
  - [Current catalog](#91-current-catalog)
  - [Proposed introductions](#92-proposed-introductions)
  - [Proposed compositions](#93-proposed-compositions)
  - [Planned deprecations, replacements, and drops](#94-planned-deprecations-replacements-and-drops)
- [10. Target workflows](#10-target-workflows)
  - [Design and alignment workflow](#101-design-and-alignment-workflow)
  - [Workflow-family disposition](#102-workflow-family-disposition)
  - [Implementation packet and task workflow](#103-implementation-packet-and-task-workflow)
  - [Parent/child implementation and integration](#104-parentchild-implementation-and-integration)
  - [Unresolved-question workflow](#105-unresolved-question-workflow)
  - [Failure and recovery workflow](#106-failure-and-recovery-workflow)
- [11. Tools, capabilities, context, and boundaries](#11-tools-capabilities-context-and-boundaries)
  - [Tool model](#111-tool-model)
  - [Context model](#112-context-model)
  - [Retained deterministic and host boundaries](#113-retained-deterministic-and-host-boundaries)
- [12. Installation and consumption](#12-installation-and-consumption)
- [13. First proof and setup-inclusive evaluation](#13-first-proof-and-setup-inclusive-evaluation)
- [14. Migration and recovery strategy](#14-migration-and-recovery-strategy)
- [15. Risks and mitigations](#15-risks-and-mitigations)
- [16. Non-goals](#16-non-goals)
- [17. Decisions requiring the user](#17-decisions-requiring-the-user)
- [18. Unresolved design questions](#18-unresolved-design-questions)
- [19. Provisional contract questions for target roles](#19-provisional-contract-questions-for-target-roles)
- [20. Recommended next design action](#20-recommended-next-design-action)

## 1. Executive orientation

**Recommendation:** Evolve the existing system through a staged heavy refactor rather than assuming either continuity or a rewrite. Retain the deterministic task-control, context, delegation, validation, setup, and evidence foundations; redesign the human-facing design lifecycle, agent responsibilities, skill composition, model routing, and current-versus-planned representation around them.

The proposed target has five cooperating planes:

1. **Human intent and design** — goals, prototypes, approved target designs, feedback, issues, and decisions.
2. **Orchestration and control** — authority-bearing agents, task admission, escalation, budgets, and recovery.
3. **Realization** — parent-owned bounded component work and authorized task implementation.
4. **Assurance** — deterministic checks, semantic review, evidence, and supplementary observability.
5. **Host and consumption** — canonical agent/skill resources, host adapters, project-local state, compatibility, setup, and provider isolation.

The target lifecycle is intentionally simple:

```text
Interactive Design / Prototyping Phase → Human Review → Near-full-autonomous Implementation
```

During Interactive Design / Prototyping, the design owner and human may iterate on goals, prototypes, component hierarchy, detailed implementation instructions, acceptance, protected inputs, and unresolved-question dispositions. Human Review decides whether the exact design-and-implementation envelope is accepted, revised, deferred, or rejected. After acceptance, implementation proceeds near-autonomously inside that envelope through deterministic task admission, bounded parent/child delegation, validation, integration, recovery, and escalation controls.

The human-facing design must clearly state what is presented to each child component-builder: a detailed, bounded implementation packet intended to be followed substantially blindly. The child need not rediscover the architecture or negotiate requirements, but it must preserve safety boundaries and stop rather than invent an answer when the packet is contradictory, incomplete, or outside its authority.

Implementation remains unauthorized until the human accepts one exact, frozen design-and-implementation envelope and the responsible orchestrator admits a task within that envelope. This is a design proposal only. It does not adopt contracts, retire current artifacts, create tasks, or authorize implementation.

---

## 2. Provenance, status, and limitations

### Observations

- The named current records describe a working system with seven configured agent roles, seventeen reusable skills, deterministic host-neutral modules, Pi-facing adapters, and bounded tools.
- Current `as-is.md` records are the current-architecture authority. Existing design drafts, review reports, and model assignments are planning evidence only.
- The current records explicitly separate agents, skills, tools, deterministic modules, adapters, task authority, and supplementary telemetry.
- The composable-skills draft proposes useful composition direction but explicitly does not authorize wholesale skill replacement.
- **Artifact disposition:** The composable-skills draft is retained as non-authoritative design input and provenance. Its composition principles are selectively incorporated, but its proposed catalog is not adopted and wholesale capability creation or skill replacement is rejected as a mandate. It is not a target contract or an artifact scheduled for removal by this design.
- The named context does not contain an implementation-level consumer inventory, migration trial, benchmark run, or proof of installed-package operation.

### Historical exercise provenance — non-normative

Earlier design exercises used named author and reviewer profiles, packet manifests, and bounded review rounds. Those records are retained only to explain how this proposal was developed. They do not define target roles, model selection, reviewer admission, lifecycle sequencing, approval criteria, task admission, or implementation authority. The target system neither requires nor evaluates alternate-model or alternate-family review. Historical reports remain evidence records outside the target-system contract.

### Assumptions used in this proposal

- The current `as-is.md` records are representative of the present architecture.
- The then-current user remains the decision holder for the exact design-and-implementation envelope.
- The first proof can be repository-local and credential-free.
- The active candidate branch can serve as the design and implementation recovery boundary, but does not provide process, network, credential, or security isolation.
- Purpose-based agent roles should remain separate from model identities.
- Existing tool implementations should be retained unless later evidence establishes a deficiency.

### Limitation

Only the named documents and relevant current `as-is.md` records were used. Implementation source, operational skill bodies, backlogs, changelogs, and live consumer behavior were not inspected. Therefore, detailed source-to-target removals, compatibility claims, and enforcement claims remain provisional.

---

# 3. Current system versus planned target

| Concern | Current implementation | Planned target |
| --- | --- | --- |
| Human entry point | `as-is` primarily routes requests and answers bounded questions. | `as-is` becomes the project-level human and orchestration front face while remaining non-implementing. Root lifecycle authority is explicit rather than inferred from routing. |
| Design lifecycle | Durable component records describe architecture; no complete target design lifecycle is established in the current catalog. | A simple three-phase lifecycle covers interactive design/prototyping, one human review decision, and near-full-autonomous implementation inside the accepted envelope. |
| Current/target state | Current records are canonical architecture context; draft proposals remain separate. | Every design representation explicitly labels **current**, **accepted target**, **relationship/migration**, and **realization status**. |
| Agent roster | Seven roles with some consultation and implementation overlap. | Purpose-based orchestrators, design/prototyping, task implementation, validation, and optional advisory roles; model assignments remain replaceable. |
| Skill organization | Seventeen operational skills, with some broad workflows and adjacent responsibilities. | Master-first composition over reusable capabilities, introduced incrementally rather than by replacing every skill at once. |
| Tool availability | Agents declare tools; launch admission validates and forwards them. | Tools are globally catalogued by the platform but admitted per agent, task, host profile, and risk. Skills declare capability needs but never grant tools. |
| Task control | Durable deterministic task state, budget, recovery, validation, and handoff eligibility already exist. | Retained as the control spine, extended only where design, implementation packets, parent/child integration, feedback, and migration states require explicit contracts. |
| Verification | Deterministic checks plus receiving-builder or expert review. | Acceptance-to-evidence mapping is mandatory; semantic review and integration ownership are explicit for every implementation result. |
| Setup | Canonical resources can be wired to detected clients; independent installed-package operation is unproven. | First prove repository-local consumption and isolation; choose a distribution model only after setup-inclusive evaluation. |
| Recovery | Task records, child worktrees, checkpoints, and branch separation support recovery. | Preserve these mechanisms; add design-revision, plan-injection, child-integration, and closure checkpoints without building an unsupported rollback subsystem. |
| Future workloads | Software development is primary; content and general tasks are future concerns. | Stable goal/design/task/evidence extension points accommodate future workloads, but their workflows remain backlog scope. |

---

# 4. Proposed target architecture

## 4.1 Human-readable system view

The current baseline is shown separately from the planned target so that the diagram does not imply that the target architecture already exists.

```mermaid
flowchart TB
    subgraph CURRENT["Current system - reported baseline"]
        direction LR
        C1["Canonical current records"]
        C2["Deterministic task, context,<br/>budget, recovery, and handoff control"]
        C3["Configured agents, skills,<br/>and bounded tools"]
        C4["Deterministic checks and<br/>supplementary evidence paths"]
        C5["Host-neutral modules,<br/>Pi adapters, and setup"]
    end

    subgraph TARGET["Planned target - design proposal only, not realized"]
        direction TB
        H["Interactive design / prototyping<br/>intent, prototypes, target envelope,<br/>questions, and human review"]
        O["Orchestration and control<br/>authority, admission, escalation,<br/>budgets, recovery, and closure"]
        R["Realization<br/>parent-owned components and<br/>bounded task implementation"]
        A["Assurance<br/>deterministic checks, semantic review,<br/>integration, and evidence"]
        X["Host and consumption<br/>core modules, adapters, setup,<br/>project-local state, and isolation"]

        H -->|"human acceptance of exact envelope"| O
        O -->|"admitted bounded tasks"| R
        R -->|"results and evidence"| A
        A -->|"status, findings, residual risk"| H
        X -.-> O
        X -.-> R
        X -.-> A
    end

    C1 -->|"baseline for explicit current and target views"| H
    C2 -->|"retain as the control spine"| O
    C3 -->|"adapt purpose-based roles and skill composition"| R
    C4 -->|"retain and strengthen assurance boundaries"| A
    C5 -->|"retain host-neutral and adapter boundaries"| X
```

## 4.2 Architectural planes

### A. Human intent and design plane

Owns human goals and feature intent, visual prototypes and structured design views, current-versus-target architecture, component hierarchy, implementation packets, decisions, assumptions, unresolved questions, feedback, and exact design revision identity and acceptance evidence. It does not authorize implementation without the human acceptance decision.

### B. Orchestration and control plane

Owns lifecycle phase transitions, agent admission and task authority, dependency and budget controls, escalation state, cancellation, retries, recovery, handoff, integration eligibility, and descendant closure. Probabilistic agents propose work; deterministic task control admits or rejects consequential transitions.

### C. Realization plane

Owns parent planning and plan injection, fresh child-scoped component-builder execution, child-level verification, child integration into the parent worktree, and parent status accounting. A child cannot redefine the accepted design, widen scope, edit sibling scope, or declare parent completion.

### D. Assurance plane

Owns acceptance-to-evidence mapping, deterministic checks, semantic review, integration review and post-integration revalidation, residual-risk reporting, and bounded execution-evidence analysis. Telemetry remains supplementary and cannot become task or completion authority.

### E. Host and consumption plane

Owns host-neutral core modules, host-specific adapters, canonical role and skill resources, bounded tool registration, project-local configuration/records/state, version and compatibility concerns, and setup. Provider credentials remain environmental inputs and must not enter prompts, records, traces, or artifacts.

## 4.3 Component hierarchy and realization ownership

A parent component owns planning of work within its accepted scope. When planning a parent backlog item, the parent reads its own `as-is.md` and the accepted envelope to identify impacted immediate children and the required change for each child. The parent records each assigned change in the particular child’s durable planned section or equivalent child-scoped planning artifact. The parent verifies that plan injection is complete, attributable to the accepted envelope, limited to impacted children, and does not alter a child’s current-state purpose, protected inputs, or active task authority.

Each impacted child is executed by a newly created `component-builder` instance scoped from that child’s own record. The child reads its record and assigned plan, implements only that plan within its component boundary, performs child-level verification, and integrates its own bounded result with the parent worktree through the admitted integration mechanism.

The parent does not inspect, semantically approve, revalidate, cherry-pick, or otherwise verify the child’s implementation result. It remains responsible for plan decomposition, plan-injection verification, dependency ordering, and recording whether each planned child reached a terminal reported disposition. A child’s implementation evidence, child-level validation, integration evidence, blocker, and recovery state remain child-owned.

A child returns a structured status handoff after its own implementation and integration attempt. The handoff identifies the child record and plan revision, changed artifacts or result identity, child-level validation evidence, integration evidence or blocker, deviations, unresolved questions, residual risks, and recovery next action. The handoff is evidence for parent lifecycle accounting; it is not a request for the parent to semantically review or integrate the child implementation.

A child integration mechanism must preserve scope and recovery: it may apply only the child’s assigned result to the parent worktree, must avoid unrelated modifications, must serialize or reject conflicting simultaneous integrations, and must preserve a recoverable checkpoint on failure. These safeguards control the integration operation; they do not create a parent semantic-verification role.

**Descendant closure** means that every admitted child is integrated, explicitly rejected, cancelled, or escalated with a recorded disposition; no unresolved blocking dependency, child-reported validation failure, or ownership conflict remains hidden beneath a parent planning-completion claim.

Work affecting more than one child is planned by the nearest common parent. That parent assigns the cross-child contract and injects a bounded plan into each affected child. It does not take over child implementation verification. If the cross-child contract changes an accepted component boundary, protected concern, acceptance condition, or authority allocation, the change returns to Interactive Design / Prototyping and, when material, Human Review.

**Current-state difference:** Current component-builder records assign receiving-builder integration and parent-side validation to the parent. The flow in this target section is a proposed target difference, not a claim about current behavior. Any realization would require separately accepted changes to role contracts, task-control/worktree controls, durable record structure, recovery rules, and behavioral validation.

---

# 5. Human-facing design and representation

## 5.1 Proposed design package

The normal human review unit is one revisioned `target-design.md`, containing the core design followed by appendices for component hierarchy and deltas, implementation packets, migration, setup and benchmark protocol, decision history, and unresolved questions. A minimal `review-manifest.md` identifies the exact revision and attachments but does not duplicate the design narrative. Separate files are used only where an independently owned canonical base record, machine-consumed artifact, or lifecycle boundary requires them; each attachment is frozen and referenced from the combined document.

Current `as-is.md` records are the baseline. Every target change is classified as retained, adapted, introduced, deprecated, replaced, dropped, or deferred. An extension beyond current records must identify the unmet capability, owner, consumers, authority and tool implications, compatibility path, validation evidence, and migration or removal gate. Unjustified extensions remain deferred.

Each frozen revision should identify its revision and predecessor, exact file set or manifest, author, current-state baseline, accepted target envelope, assumptions, unresolved-question dispositions, human decision state, and whether it is a draft, human-reviewed design, accepted envelope, or superseded revision. Historical author/reviewer exercise provenance may be linked as context, but it is not a target-system requirement.

## 5.2 Required human-facing views

| View | Human question answered |
| --- | --- |
| One-page system map | What are the major parts and how do they cooperate? |
| Three-phase lifecycle view | How does interactive design become human acceptance and then near-autonomous implementation? |
| Authority and escalation ladder | Who can decide, authorize, implement, review, integrate, or escalate? |
| Current-versus-target map | What exists now, what is accepted, and what changes? |
| Component hierarchy and dependency view | Which parent owns each child, and how are cross-component results integrated? |
| Implementation-packet example | What detailed instructions does the task implementer receive? |
| Unresolved-question view | Which questions are blocking, who decides them, and what work is stopped or allowed to continue? |
| Agent and skill disposition tables | What is retained, modified, introduced, replaced, deprecated, or dropped? |
| Setup and project-isolation view | What is installed globally, project-local, host-specific, or credential-bearing? |
| First-proof scorecard | How will current and candidate workflows be compared? |
| Migration map | How does each current consumer reach its target replacement safely? |
| Decision brief | What does the human need to decide, and what happens under each option? |

Mermaid is appropriate for architecture and lifecycle diagrams. UI mockups, rendered component views, tables, examples, and screenshots may be used when they communicate intent better. No user-interface implementation is implied.

### Workflow benchmark and evaluation — advisory, not authority

The benchmark discussion concerns the workflow, not reviewer or model selection. The proposed evaluation compares the pinned current workflow and the candidate workflow on the same controlled feature, using the same separately owned seed, setup conditions, primary model settings, budget, retry policy, deterministic checks, protected fixtures, rubric, and scorer. **No project-specific workflow benchmark has run.** This is a proposed evaluation protocol, not a target lifecycle gate or adoption result.

The benchmark should measure setup, correctness, scope discipline, human effort, agent operation, integration, evidence quality, design alignment, and recovery. Before execution, record the exact seed, pinned baseline revision, candidate revision, feature, settings, budget, retry policy, checks, protected inputs, rubric, scorer, safety-critical failures, thresholds, and advancement rule. A model or reviewer-selection experiment must be labelled separately; it must not be presented as evidence that one workflow is superior. Human approval remains required for the benchmark protocol and any advancement decision.

## 5.3 Human status and interaction needs

Without prescribing a UI, the system should make inspectable: current lifecycle phase; exact design/envelope revision; pending human decisions; active, blocked, and stopped bounded units; responsible orchestrator and receiving owner; task scope, budget, dependencies, and elapsed status; deterministic check results; integration and recovery state; differences from the accepted design; unresolved questions and their dispositions; cost and model usage; residual risks; and the next safe action.

Human feedback should be classified as editorial clarification, defect report, design-changing feedback, or new request. Design-changing feedback and new requests return to Interactive Design / Prototyping. They must not be appended silently to an active implementation task.

---

# 6. Lifecycle and control points

The target system has three phases and one human decision point. The phases are intentionally simple; task admission, parent plan-injection verification, child-level verification, integration, and recovery are operational controls inside Near-full-autonomous Implementation, not additional human lifecycle gates.

```mermaid
flowchart LR
    D["Interactive Design / Prototyping<br/>goal, prototype, hierarchy,<br/>implementation envelope, questions"]
    H{"Human Review<br/>accept exact design-and-implementation envelope?"}
    R["Revise, defer, or reject<br/>no implementation authority"]
    A["Near-full-autonomous Implementation<br/>parent plan injection, child builders,<br/>child verification, integration, recovery"]
    C["Completion handoff or bounded escalation"]

    D --> H
    H -->|"revise, defer, or reject"| R
    R --> D
    H -->|"accept"| A
    A --> C
```

### Interactive Design / Prototyping Phase

The design owner and human may interactively clarify goals, inspect current records, produce prototypes, define the parent/child component hierarchy, derive detailed implementation packets, identify dependencies, set acceptance and protected-input rules, classify risks, and record unresolved questions. Optional advisory or specialist input may be used when justified, but alternate-model or alternate-family review is not a target-system requirement.

The phase ends when one exact, frozen design-and-implementation envelope is presented for Human Review. The envelope includes goals, accepted outcomes, component boundaries and parent ownership, parent plan-injection rules, implementation packets or the method for deriving them, permitted capabilities, protected inputs, dependencies, acceptance, validation, recovery, escalation, and explicit non-goals.

### Human Review

The human reviews the exact frozen envelope and chooses one outcome: **accept**, **request revision**, **defer**, or **reject**. Human acceptance establishes the goals, component boundaries, authorized change envelope, protected inputs, acceptance conditions, validation expectations, escalation path, and stop conditions. It enables deterministic task admission within that envelope; it does not permit changes outside it.

A revised or materially changed envelope returns to Interactive Design / Prototyping. A deferred or rejected envelope has no implementation authority. Editorial clarification may update presentation without changing the accepted envelope, but it must remain traceable to that revision.

### Near-full-autonomous Implementation Phase

After acceptance, the project orchestrator and parent component builders operate near-autonomously within the accepted envelope. The parent reads its own `as-is.md`, identifies impacted children, injects child-specific plans into their planned sections, and verifies plan injection. Fresh child-scoped `component-builder` instances then implement their assigned plans, perform child-level verification, and integrate their own results with the parent worktree through the admitted mechanism. Deterministic task admission, budgets, protected controls, recovery, and escalation constrain model output. The human is not required for routine implementation choices already made by the envelope, but consequential deviations and blocked decisions return to the appropriate human decision holder.

Operational controls:

- **Parent plan injection:** Before child launch, the parent verifies that each impacted child and assigned plan is derived from the accepted envelope, scoped to that child, attributable, complete, and recorded in the child’s planned section or equivalent artifact.
- **Child admission:** A fresh child-scoped component-builder may begin only when its own record, assigned plan, allowed scope, dependencies, budget, protected inputs, child-level validation, recovery, and parent-worktree integration mechanism are admitted.
- **Child verification and integration:** The child verifies its own implementation and integrates only its bounded result with the parent worktree through the admitted mechanism.
- **Parent closure accounting:** The parent records terminal child reports and unresolved blocking dependencies. It does not semantically verify, revalidate, cherry-pick, or approve the child’s implementation or integration result.

---

# 7. Authority, orchestration, and escalation

## 7.1 Authority model

| Actor or mechanism | Proposed authority | Explicit limits |
| --- | --- | --- |
| Human | Goal, feature intent, acceptance or revision of the exact design-and-implementation envelope, consequential exceptions, and decisions on blocking unresolved questions. | Does not need to perform routine implementation. |
| `as-is` project orchestrator | Root lifecycle coordination, human interaction, status synthesis, routing, and escalation. | Does not implement component work or infer human acceptance. |
| Design/prototyping agent | Produces prototypes, target designs, component hierarchies, and implementation packets within design scope. | Cannot accept its own envelope or authorize implementation. |
| Parent component builder / parent planner | Reads its own record, identifies impacted children, writes child-scoped planned changes, verifies plan injection, orders planning dependencies, and records child dispositions. | Does not implement, semantically review, validate, approve, cherry-pick, or integrate a separately owned child’s implementation. |
| Child component builder | A fresh instance scoped from one child record; implements the injected plan, performs child-level verification, integrates its bounded result with the parent worktree using the admitted mechanism, and reports evidence or a blocker. | Cannot change the parent plan, sibling scope, accepted envelope, parent task state, or protected parent artifacts outside the admitted integration operation. |
| Evidence validator | Evaluates supplied evidence against acceptance. | No mutation, task admission, parent integration, or human acceptance authority. |
| Optional expert or specialist | Provides bounded advisory or externally required domain judgment when separately justified. | Not an alternate-model/family gate; does not gain authority merely by reviewing. |
| Skills | Provide reusable procedures and composition. | Never select, authorize, admit, launch, integrate, or complete work. |
| Tools | Provide bounded operations. | Never grant role, scope, or transition authority. |
| Task-control module | Owns deterministic task-state transitions, budget admission, checkpoints, cancellation, and handoff eligibility. | Does not implement, review semantics, or execute host operations. |
| Observability | Supplies bounded supplementary evidence. | Never defines task status, budget, recovery, or completion. |

The repository authority order remains applicable: fixed safety invariants → external and governance constraints → component policy → explicit human/project overrides → installed defaults.

## 7.2 Escalation

Escalation travels upward through callers:

```mermaid
flowchart TB
    U["Human<br/>goal, exact-envelope review,<br/>and consequential decisions"]
    P["Project orchestrator - as-is<br/>root lifecycle, interaction,<br/>status, and routing"]
    C["Parent component builder<br/>plan decomposition, plan injection,<br/>dependency ordering, and accounting"]
    T["Fresh child component-builder<br/>child implementation, verification,<br/>and parent-worktree integration"]

    U -->|"direction and envelope decision"| P
    P -->|"accepted parent scope"| C
    C -->|"child record + injected plan"| T

    T -->|"stop, preserve state and evidence,<br/>and report blocker or integration status"| C
    C -->|"outside planning authority"| P
    P -->|"consequential envelope decision"| U

    D["Design/prototyping agent<br/>authors proposals and packets"]
    D -.->|"design proposal"| P

    V["Validator or specialist<br/>findings and evidence"]
    V -.->|"bounded assessment"| C

    M["Task-control module<br/>enforces admission, budgets,<br/>recovery, and handoff"]
    M -->|"admit or reject against recorded authority"| T
```

Each caller should resolve an issue within authority, stop affected work when it cannot, preserve state and evidence, bubble a bounded question upward, and avoid forwarding irrelevant implementation detail. No automatic restart or retry should acquire new authority.

The child escalates a contradiction, blocked integration, protected-input conflict, validation failure, missing dependency, or scope change. The parent may resolve only a planning or dependency matter already determined by the accepted envelope. It does not replace child-level implementation verification with its own review.

---

# 8. Proposed agent disposition

Names are provisional and require naming review before adoption.

| Current agent | Proposed disposition | Planned responsibility | Migration note |
| --- | --- | --- | --- |
| `as-is` | **Modify** | Project-level human front face and root orchestrator: intent interpretation, status, lifecycle coordination, root escalation, and routing. | Its present “router only” boundary must be changed explicitly; it must remain non-implementing. |
| `component-builder` | **Retain and adapt** | Parent planner for its own component and fresh child-scoped builder for a particular child: plan injection, child-local implementation, child-local verification, bounded integration into the parent worktree, recovery, and status handoff. | This is a proposed target difference from current parent-side integration/validation; preserve current behavior until separately accepted and validated. |
| `evidence-validator` | **Retain and adapt** | Read-only acceptance-to-evidence review across implementation packets, implementations, and controlled checks. | Keep fixed safety profiles; broaden only through explicit code-owned checks. |
| `execution-advisor` | **Retain** | Bounded trace/session analysis, process improvement, and budget evidence. | Continue treating telemetry as supplementary. |
| `expert` | **Retain and compose** | Generic read-only advisory or specialist shell when a project separately requires it. | Not an alternate-model/family target gate. |
| `thinking-companion` | **Deprecate, then replace** | General consultation moves to the human-facing orchestrator and consulting skill; design facilitation moves to the design/prototyping role. | Remove only after direct consumers and behavior tests migrate. |
| `worker` | **Defer replacement decision** | The corrected target uses a fresh child-scoped `component-builder` for separately owned child work. A distinct leaf task-implementer remains a future design question. | Do not replace the role solely to represent parent/child component work; preserve current behavior until a consumer-backed decision exists. |
| — | **Introduce** a design/prototyping agent | Produce interactive prototypes, target-design revisions, component hierarchies, implementation packets, alternatives, and decision briefs. | Separate authorship from human acceptance. |

Model assignments are replaceable implementation choices, not target role names or lifecycle stages. The target system does not require alternate-model or alternate-family review.

---

# 9. Proposed skill disposition

## 9.1 Current catalog

| Current skill | Disposition | Planned treatment |
| --- | --- | --- |
| `as-is-setup` | **Retain and adapt** | Setup/consumption master for project-local adoption, host checks, compatibility, and setup evidence. |
| `integrate-as-is-documentation` | **Compose, then deprecate standalone form** | Fold decomposition and record-adoption path into setup and design workflows after behavior parity is proven. |
| `managing-as-is-document` | **Modify substantially** | Support explicit current, accepted-target, design-relationship, revision, and realization semantics. |
| `context-building` | **Retain and adapt** | Add explicit decision question, stopping condition, provenance, and current-versus-target labels. |
| `exploring-execution-evidence` | **Retain** | Continue bounded read-only evidence analysis. |
| `designing-mermaid-diagrams` | **Retain and compose** | Remain the Mermaid-specific capability underneath broader design and prototype procedures. |
| `naming-software-concepts` | **Retain** | Apply to new roles, skills, records, and lifecycle terms before migration. |
| `implementing-component-tasks` | **Adapt; consider rename to `implementing-tasks`** | Preserve task authority and recovery while allowing project-specific completion and history policies. |
| `maintaining-components` | **Retain** | Continue evidence-based bounded maintenance. |
| `deterministic-skills` | **Retain** | Continue advising where deterministic behavior should replace repetition. |
| `managing-backlog` | **Retain and adapt** | Remain a planning index, clearly downstream of accepted design and separate from active task authority. |
| `spawning-pi-subagents` | **Retain and adapt** | Remain the canonical Pi delegation path; add accepted-envelope traceability and setup/compatibility evidence. |
| `structuring-content` | **Retain** | Shape design packages, component records, and human-facing representations. |
| `verification-discipline` | **Retain and strengthen** | Require acceptance-to-evidence matrices, negative cases, semantic review, and residual-risk classification. |
| `building-components` | **Retain and adapt** | Remain the component-builder’s master workflow, now consuming accepted envelopes and implementation packets. |
| `committing-completed-work` | **Adapt** | Preserve scoped durable handoff without making repository-specific commit conventions universal. |
| `human-centered-consulting` | **Retain and broaden composition** | Used by orchestrator, designer, optional expert, and decision presentations while preserving human authority. |

## 9.2 Proposed introductions

Introduce these only through bounded pilots with identified consumers:

| Proposed master skill | Purpose |
| --- | --- |
| `developing-target-designs` | Compose goal clarification, interactive prototypes, structured target-design revisions, implementation-envelope preparation, decision presentation, human-review recording, and design-change feedback. It supports human acceptance but does not determine or record it. |
| `making-changes` | Resolve component versus non-component scope, ownership, method, validation, and applicable history. |
| `planning-realization` | Derive detailed implementation packets from accepted design without changing that design. |

Candidate reusable capabilities include resolving scopes, identifying owners, drafting bounded content, choosing change methods, writing code, applying bounded edits, writing tests, running tests, recording evidence, presenting decisions, delegating bounded work, observing delegated work, locating history, and drafting history entries. Each needs an independent consumer, owner, tool requirements, compatibility route, and focused validation.

## 9.3 Proposed compositions

The following view shows representative agent-to-skill relationships. Dashed arrows mean that a role may use or compose a reusable procedure; they do not grant tools, scope, task admission, human acceptance, integration, or completion authority.

```mermaid
flowchart LR
    subgraph Agents["Purpose-based agent roles"]
        O["Project orchestrator<br/>(as-is, adapted)"]
        D["Design/prototyping agent"]
        P["Parent component builder"]
        C["Child component builder<br/>(fresh per child)"]
        V["Evidence validator<br/>(current, adapted)"]
        X["Optional expert / specialist"]
    end

    subgraph Skills["Reusable skills and master procedures"]
        CB["context-building"]
        HC["human-centered-consulting"]
        SC["structuring-content"]
        MD["designing-mermaid-diagrams"]
        MA["managing-as-is-document"]
        DA["developing-target-designs<br/>(proposed master)"]
        PR["planning-realization<br/>(proposed master)"]
        BC["building-components"]
        IT["implementing-component-tasks"]
        VD["verification-discipline"]
        SP["spawning-pi-subagents"]
    end

    O -.-> CB
    O -.-> HC
    O -.-> SP
    D -.-> DA
    D -.-> SC
    D -.-> MD
    D -.-> MA
    X -.-> CB
    X -.-> HC
    P -.-> CB
    P -.-> SC
    P -.-> PR
    P -.-> BC
    P -.-> SP
    P -.-> VD
    C -.-> CB
    C -.-> BC
    C -.-> PR
    C -.-> IT
    C -.-> VD
    V -.-> VD
```

```text
developing-target-designs
  = context building
  → human consultation
  → interactive prototyping
  → structuring content
  → implementation-envelope preparation
  → human decision presentation
  → revision recording
```

```text
building-components
  = context building
  → parent plan injection or child plan intake
  → child-local implementation
  → child-level verification
  → child integration with parent worktree
  → status handoff
  → parent planning accounting
```

## 9.4 Planned deprecations, replacements, and drops

| Item | Planned treatment |
| --- | --- |
| Standalone documentation-integration workflow | Deprecate after setup/design compositions prove parity. |
| `thinking-companion` role | Replace with orchestrator consultation plus the design/prototyping agent. |
| `worker` role name and broad identity | Defer replacement; the corrected parent/child target uses fresh child-scoped `component-builder` instances. |
| Alternate-model or alternate-family review as a target control | Remove from target lifecycle and contract; historical exercise records remain non-normative provenance only. |
| Fixed model names as architecture roles | Drop from target architecture. Retain only as replaceable assignments where useful. |
| Skill-granted authority or tool access | Explicitly reject. |
| Path B as normal design lifecycle | Drop from the normal flow; retain only as an explicitly approved contingency. |
| Universal `master` working-branch assumption | Drop. A pinned `master` revision remains an evaluation baseline where applicable. |
| Universal two-commit cross-project lifecycle | Drop as a target-system invariant; retain where the consuming project’s contract requires it. |
| Wholesale replacement of all current skills | Reject absent consumer and migration evidence. |
| Current artifacts without migration evidence | Do not drop. |

---

# 10. Target workflows

## 10.1 Design and alignment workflow

1. Human supplies a goal, feature idea, feedback, or issue.
2. The project orchestrator identifies the responsible parent component and design scope.
3. The design/prototyping agent and human interactively clarify the goal, inspect the parent’s current `as-is.md`, identify impacted children, build prototypes or structured views, define parent ownership, and derive the implementation envelope.
4. The design owner records child-specific plans or enough exact detail to derive them, including outcomes, ordered instructions, scope, protected inputs, acceptance, validation, dependencies, recovery, escalation, and stop conditions.
5. The exact frozen design-and-implementation envelope is presented to the human.
6. The human accepts, requests revision, defers, or rejects that exact envelope.
7. Acceptance enters Near-full-autonomous Implementation. Revision, deferral, or rejection returns to design and gives no implementation authority.

No alternate-model or alternate-family review is required by this workflow. Optional advisory or specialist input may be used during Interactive Design / Prototyping when a project or external governance requires it, but it is not a generic target gate.

## 10.2 Workflow-family disposition

| Workflow family | Successor disposition |
| --- | --- |
| Interactive design and prototyping | **Introduce** the revisioned human-facing flow; the inspected current catalog does not establish one. |
| Human review of exact implementation envelope | **Introduce/formalize** as the single human lifecycle decision. |
| Parent planning and child plan injection | **Retain and strengthen** current hierarchy with explicit planned-section injection and parent-level injection verification. |
| Child-scoped component implementation and integration | **Retain and strengthen** child ownership with child-level verification and scope-preserving integration into the parent worktree. |
| Task control, delegation, recovery, and bounded implementation | **Retain and adapt** the existing deterministic control spine and ownership boundaries. |
| Validation and evidence | **Retain and strengthen** through explicit child-level acceptance-to-evidence mapping. |
| Setup and consumption | **Retain and adapt**, with repository-local proof before broader distribution claims. |
| Alternate-model/family review loop | **Remove from target system; retain only as historical exercise provenance.** |
| Path B planning-branch lifecycle | **Drop as the normal path; retain only as an explicitly approved contingency.** |

## 10.3 Implementation packet and child task workflow

Each fresh child-scoped component-builder receives a detailed bounded implementation packet. The packet is intended to permit implementation substantially blindly with respect to broader design discovery: the child should be able to carry out the stated steps and validations without independently reconstructing architecture, selecting requirements, negotiating ownership, or exploring unrelated repository context.

“Substantially blindly” never removes task authority or safety boundaries. The child must still read applicable instructions, preserve protected inputs, obey tool and scope restrictions, perform child-level validation, report evidence honestly, and stop on a contradiction, missing dependency, prohibited access, failed required validation, or condition outside the packet.

Every packet contains:

1. immutable task identifier and accepted design/envelope revision;
2. parent component, particular child component, parent planner, and escalation recipient;
3. one bounded outcome and explicit non-goals;
4. affected child component, allowed paths/interfaces, and prohibited paths/interfaces;
5. ordered implementation instructions and required dependency assumptions;
6. permitted tools/capabilities and prohibited external, credential, or destructive actions;
7. protected inputs, fixtures, baselines, validators, secrets, authority-bearing records, and parent-worktree integration target;
8. exact acceptance conditions and child-level validation instructions;
9. required implementation and integration evidence;
10. budget, recovery/checkpoint expectations, cancellation conditions, and conflict handling; and
11. explicit stop conditions.

The child may make only local discretionary choices necessary to execute unambiguous instructions and preserve stated constraints. It must not resolve a design ambiguity by invention, relax acceptance, substitute a dependency or validation method, reinterpret a protected input as editable, modify sibling scope, or convert an unresolved question into a requirement.

The parent admits a child task only after verifying the packet is within the accepted envelope, the child record and planned section are present, the named child builder is available, dependencies and protected controls are present, and deterministic task control has admitted the child.

## 10.4 Parent planning, child implementation, and child integration

When a parent backlog item is planned, the parent component builder reads the parent’s `as-is.md` and accepted envelope to identify each impacted immediate child and the required change. For each impacted child, the parent writes a bounded assigned plan into that child’s planned section or equivalent child-scoped planning artifact. The parent verifies plan injection before launching children: each assignment identifies its source parent plan, child scope, intended outcome, dependencies, protected inputs, acceptance conditions, validation, recovery, escalation route, and allowed integration mechanism.

Each impacted child is handled by a newly created `component-builder` instance scoped to that particular child from the child’s own record. The child reads its own record and injected plan; parent or sibling context is not ambient authority. The child implements only its assigned plan, performs specified child-level validation, and integrates only its assigned result with the parent worktree through the admitted, scope-preserving integration mechanism.

The child must preserve its component scope and protected inputs, perform and record child-level validation before claiming a successful integration, integrate only its own bounded result without overwriting unrelated parent or sibling work, stop and escalate conflicts or out-of-scope requirements, and return a structured report of plan revision, changed result, validation, integration evidence or blocker, residual risks, unresolved questions, and recovery next action.

The parent must identify impacted children, inject and verify child-specific plans, coordinate planning dependencies and safe integration ordering, preserve child reports, and record terminal, blocked, cancelled, or escalated child disposition. The parent does not semantically review, validate, revalidate, cherry-pick, or approve the child’s implementation or integration result.

For work affecting multiple children, the nearest common parent owns planning of the cross-child contract and injects a bounded plan into each affected child. It does not take over child implementation verification. A requirement that changes an accepted component boundary, protected concern, acceptance condition, or authority allocation returns to Interactive Design / Prototyping and, when material, Human Review.

```mermaid
flowchart TB
    PB["Parent backlog item"]
    PR["Parent reads parent as-is.md<br/>and accepted envelope"]
    IC["Identify impacted children<br/>and required changes"]
    PI["Write each assigned plan into<br/>the particular child's planned section"]
    PV["Parent verifies plan injection<br/>and child launch readiness"]
    CB1["Fresh component-builder<br/>scoped from Child A record"]
    CB2["Fresh component-builder<br/>scoped from Child B record"]
    CI1["Child A implements, verifies,<br/>and integrates its result<br/>with the parent worktree"]
    CI2["Child B implements, verifies,<br/>and integrates its result<br/>with the parent worktree"]
    SH["Child status handoffs:<br/>evidence, integration result,<br/>blocker, recovery"]
    PC["Parent records dispositions<br/>and closes only when accounted for"]

    PB --> PR --> IC --> PI --> PV
    PV --> CB1 --> CI1 --> SH
    PV --> CB2 --> CI2 --> SH
    SH --> PC
```

In this diagram, “parent verifies” means verification of impacted-child identification and plan injection before child execution. “Child verifies” means verification of that child’s implementation and integration result. No arrow represents parent semantic verification or parent integration of a child implementation.

## 10.5 Unresolved-question workflow

Every unresolved question is recorded with its question, affected design/task revision, owner, dependencies, deadline or decision point where relevant, proposed options if known, and status: **resolved**, **non-blocking**, or **blocking**.

A question is **blocking** when its answer could change task scope, component ownership, interface behavior, protected inputs, authority, acceptance, validation, budget, risk classification, recovery, or the parent/child integration mechanism. The affected child task and dependent descendants stop at the safe checkpoint; unrelated siblings may continue only when the parent records that they are independent.

A parent may resolve a question only when the answer is already determined by the accepted envelope and does not alter a protected concern. Otherwise it escalates through its caller to the human decision holder. The parent records the escalation and does not silently choose an answer.

A **non-blocking** question may remain open only when the accepted envelope explicitly permits the stated default and the question cannot alter acceptance, safety, authority, another component’s contract, or integration scope. It remains visible in the child handoff and parent planning accounting.

An unresolved blocking question prevents affected child closure and prevents the parent from claiming its planned work is fully accounted for. Escalation, deferral, cancellation, or an accepted design revision supplies its disposition; retry alone does not create an answer or new authority.

## 10.6 Failure and recovery workflow

- Preserve partial work in the child record and isolated worktree.
- Report failed, blocked, budget-exhausted, conflict, or recovery-candidate states explicitly.
- Do not infer completion from process exit, model output, telemetry, or a child commit.
- Do not restart or retry automatically without caller or human authority.
- Do not silently widen scope to obtain a missing dependency.
- Preserve prior design, parent-plan, child-plan, and implementation-packet revisions when producing successors.
- Preserve child integration checkpoints and evidence; a failed integration remains a child-owned recoverable blocker.
- Escalate persistent correctness failures, integration conflicts, or architectural contradictions.

---

# 11. Tools, capabilities, context, and boundaries

## 11.1 Tool model

Interpret “globally available tools” as a globally discoverable platform catalog, not universal runtime permission. Agents declare or are admitted to capability classes; tasks may narrow them; hosts may impose stronger profiles; skills identify capability requirements but cannot grant, register, or widen tools; missing or denied capabilities fail closed before work starts.

## 11.2 Context model

For the first slice, use separate worktrees and working directories, provide only the implementation packet, applicable instructions, accepted design, and named dependencies, ask children not to explore unrelated context, require them to stop on a missing dependency, and treat reported reads as evidence rather than proof of isolation.

| Risk | Boundary |
| --- | --- |
| Low | Separate worktree/CWD plus packet-guided context discipline. |
| Medium | Read auditing, protected fixtures, and stronger independent validation. |
| High or security-sensitive | Enforced filesystem/network/credential boundary or explicit human decision. |

## 11.3 Retained deterministic and host boundaries

Retain task-control, context resolution, agent resolution, supplementary observability, bounded process supervision, host setup, and agent/context/evidence tools. Modify these only to support accepted contracts or demonstrated consumers. Do not merge them merely because they participate in the same workflow.

---

# 12. Installation and consumption

| Layer | Planned ownership |
| --- | --- |
| Canonical reusable resources | Versioned bundle of agents, skills, and host adapters. |
| Project design and task records | Consuming project, not global package state. |
| Project policy and overrides | Project-local configuration. |
| Provider credentials | Environment or host secret mechanism only. |
| Runtime sessions and traces | Host-local bounded state with explicit retention. |
| Tool implementations | Platform or bundle implementation, admitted per agent/task. |
| Compatibility and upgrades | Versioned resource and adapter contract with migration evidence. |

The first proof claims only repository-local setup, deterministic detection and wiring, no overwrite of unrelated configuration, separate project-local state, candidate and baseline operation in different directories, and no credential or external-effect requirement. It does not claim independent package installation, untrusted-project operation, network/filesystem sandboxing, upgrade/downgrade support, multi-project production isolation, uninstall correctness, or provider portability.

---

# 13. First proof and setup-inclusive evaluation

Use a separately owned mock project seed and one simple feature that requires setup, component or scope resolution, a small human-facing design, one bounded code change, focused tests, deterministic validation, implementation review, integration, and status reporting.

Create from the same seed one baseline consumer using a pinned `master` revision and one candidate consumer using the active candidate revision, in separate directories and worktrees, with identical feature request, model settings, budget, retry policy, deterministic checks, protected fixture, rubric, validators, and scorer outside worker write scope.

Measure setup, correctness, scope discipline, human effort, agent operation, integration, evidence, design alignment, and recovery. **No project-specific workflow benchmark has run.** Pre-register the exact seed, revisions, feature, settings, budget, retry policy, checks, protected inputs, rubric, scorer, safety-critical failures, thresholds, and advancement rule before execution. Workflow comparison is distinct from any model-selection or reviewer-selection experiment.

---

# 14. Migration and recovery strategy

1. **Baseline and inventory:** Freeze current and candidate revisions; identify current consumers for every agent, skill, adapter, and tool.
2. **Approve target envelope:** Complete the interactive design package, human review, decision log, and migration ledger without implementation.
3. **Pilot composition:** Add one master workflow and the smallest supporting reusable capabilities while retaining existing skill paths.
4. **Run setup-inclusive proof:** Compare baseline and candidate on the same mock project and feature.
5. **Migrate agent responsibilities:** Introduce the design role and task implementer; adapt `as-is` and `component-builder`; retain aliases and old paths temporarily.
6. **Migrate workflow consumers:** Move each proven consumer to the target composition with compatibility and behavioral tests.
7. **Broaden adoption:** Apply the candidate to additional representative software-development tasks.
8. **Retire superseded artifacts:** Deprecate or drop only when consumer inventory, replacement parity, recovery value, and migration evidence are complete.

For every source artifact, record source identity, current purpose and consumers, target identity/composition, disposition, compatibility mechanism, migration owner, dependencies, evidence required, recovery path, removal gate, and unresolved authority. Staged heavy refactoring is the default; a total rewrite remains available if controlled evidence shows lower total risk or cost while considering compatibility, migration, maintenance, safety, isolation, recoverability, correctness, setup, and benchmark results.

The active candidate branch and isolated worktrees preserve comparison and reversal boundaries. Prior design and implementation-packet revisions remain immutable evidence. Failed migration stages stop before retiring source behavior. No separate rollback subsystem is recommended without demonstrated need.

---

# 15. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Current and accepted target designs become conflated | Explicit sections, revision identity, migration relationship, and realization status. |
| `as-is` becomes an overpowered universal agent | Limit it to root orchestration and human interaction; component and task authority remain delegated and recorded. |
| Skills become hidden authority or permission boundaries | Agent/task admission remains authoritative; skills only provide procedures and capability requirements. |
| Near-full autonomy silently widens scope | Provide detailed packets, protected inputs, explicit stop conditions, deterministic admission, and escalation. |
| Parent/child work is incomplete or conflicts | Define nearest-common-parent ownership, structured handoffs, parent integration, sibling boundaries, and descendant closure. |
| Unresolved questions silently become implementation assumptions | Classify questions, stop affected work for blocking questions, preserve non-blocking defaults, and escalate consequential decisions. |
| Over-splitting skills creates unusable ceremony | Require independent consumers and pilot evidence before extracting a capability. |
| A wholesale rewrite discards working safety boundaries | Preserve deterministic modules and adapters unless evidence justifies replacement. |
| Human review becomes a rubber stamp | Present visual views, implementation packets, explicit choices, residual risks, and exact envelope identity. |
| Passing tests creates false confidence | Require semantic review, negative cases, integration checks, and design traceability. |
| Telemetry becomes de facto authority | Keep task records and deterministic control authoritative. |
| Prompt-guided isolation is mistaken for enforcement | State limitations and use stronger boundaries for higher-risk work. |
| Setup works only in this repository | Include a separately owned mock consumer and setup in the first evaluation. |
| Migration silently removes consumers | Use a sole migration ledger and evidence-gated retirement. |
| Specialist concerns are treated as solved | Keep legal, security, financial, and operational requirements as explicit project or external-governance decisions. |

---

# 16. Non-goals

- Implementing this proposal.
- Designing a user interface.
- Authorizing a branch, task, commit, or release.
- Selecting a permanent distribution model.
- Claiming production-grade package installation or multi-project isolation.
- Implementing content-generation or general-task workflows in the first slice.
- Solving specialist legal, financial, security, privacy, or operational review with generic orchestration.
- Creating a universal workflow abstraction before multiple consumers demonstrate it.
- Replacing all current tools or skills.
- Treating model confidence, benchmark rank, process exit, or telemetry as completion authority.
- Enforcing filesystem or network isolation without a risk or evidence basis.
- Requiring every change to use a component task or update a changelog regardless of project policy.
- Requiring alternate-model or alternate-family review in the target system.
- Requiring `master` to be the working branch.

---

# 17. Human Review decision and explicit human exceptions

Human Review has one ordinary lifecycle decision: for the exact frozen design-and-implementation envelope, the human may **accept**, **request revision**, **defer**, or **reject**. Acceptance covers the envelope as a whole; it does not require the human to answer every design, contract, migration, setup, or evaluation-detail question individually.

The decision brief must identify only unresolved choices that materially change the accepted goal, component boundary, protected inputs, authority allocation, acceptance conditions, risk posture, or permitted external effect. Each such choice states the available options, recommended disposition, consequence of each option, and whether acceptance is blocked.

The following are human decisions only when unresolved and consequential:

| Decision area | Human decision needed only if unresolved or consequential |
| --- | --- |
| Goal and accepted outcome | The outcome, non-goals, or success conditions materially differ. |
| Component ownership or boundary | The change alters which component owns work or crosses an accepted boundary. |
| Authority and protected controls | The proposal changes who may authorize, integrate, access protected inputs, or cause external effects. |
| Acceptance and risk | The proposal changes required evidence, safety posture, or permitted residual risk. |
| Blocking product or policy choice | No envelope-preserving default exists. |

Role names, skill extraction, record-field mechanics, benchmark mechanics, migration fields, and similar operational details are not separate human decisions unless their unresolved alternatives change one of the areas above. The human may still explicitly require a decision on any item; that is an exception to the ordinary minimal decision surface and must be recorded as such.

# 18. Author/open design questions and admission blockers

These questions are owned design or operational questions, not a request for the human to answer every listed item. Each question is resolved, deferred with a permitted default, or classified as a blocker before the transition that depends on it.

| Question | Default owner | Must be resolved by | Blocks |
| --- | --- | --- | --- |
| What target record set or equivalent design artifacts constitute the accepted envelope? | Design owner | Human Review | Envelope acceptance |
| How is plan injection represented in a child’s planned section? | Record-contract owner | Child planning admission | Affected child launch |
| Which children are impacted by a planned parent backlog item? | Parent planner | Parent plan-injection verification | Affected child launch |
| What worktree access and serialization model lets a child integrate only its result into the parent worktree? | Task-control/host owner | Child integration admission | Affected child integration |
| Which current consumers depend on legacy roles or integration behavior? | Migration owner | Relevant migration task | Consumer migration only |
| Which task classes require enforced isolation? | Risk/host owner | Relevant task admission | Affected task only |
| What distribution, upgrade, downgrade, and uninstall promise is supportable? | Setup/migration owner | Distribution commitment | Distribution release only |

An unresolved §18 question becomes a Human Review question only when its answer changes the frozen envelope and cannot safely be deferred behind a stated admission control. Otherwise it remains an author or operational blocker with its owner and blocking transition visible.

# 19. Provisional operational-contract questions

These are questions, not adopted contracts or requests for individual human answers. They are owned design and implementation-discovery questions. Each answer must be established before the task or transition that depends on it is admitted. If resolving one would change the accepted envelope, it returns to Interactive Design / Prototyping and, where material, Human Review.

## Design and revision

- What uniquely identifies a design/envelope revision and its exact file set?
- How are current, accepted target, superseded target, and realization status represented?
- What constitutes attributable human acceptance?
- How are component hierarchies and derived implementation packets linked to the accepted envelope?
- Which design changes reopen Human Review?

## Plan injection, child execution, and integration

- What exact durable `planned` section or equivalent planning field exists in a child record, and which parent-planning evidence does it reference?
- What may a parent write into a child’s planned section without changing the child’s durable current-state purpose, authority, or active task state?
- What establishes that the parent identified all and only impacted immediate children from the parent record and accepted envelope?
- What creates a fresh `component-builder` instance scoped to one identified child and its own record?
- What child-level evidence proves implementation against the injected plan?
- What constrained operation permits the child to integrate only its assigned, validated result into the parent worktree?
- How are concurrent child integrations serialized or rejected to avoid overwriting unrelated work?
- What child report proves attempted integration, resulting revision or artifact identity, validation, unresolved questions, and recovery state?
- What non-semantic status evidence may a parent use for descendant closure without revalidating or approving the child’s implementation?

## Feedback and issues

- What fields distinguish clarification, defect, design change, and new request?
- Who may classify feedback, dispute a classification, or reopen design?
- How is post-implementation feedback linked to relevant design and task evidence?

## Agent admission and tools

- What capability classes must an agent declare?
- How do role, task, host, and project restrictions combine?
- How does admission fail closed?
- How are model assignment and agent identity kept separate?

## Validation and completion

- How are child-level acceptance conditions mapped to evidence?
- Which checks are deterministic, semantic, specialist, or human?
- What evidence remains required after a no-change result or failed integration?

## Escalation and questions

- What information must each escalation contain?
- When may a caller resolve an unresolved question versus bubble it upward?
- Which risks require a human or domain expert?
- What happens to active siblings while an ancestor decision is pending?
- How are blocking and non-blocking statuses represented and propagated to descendants?

## Setup, migration, and evaluation

- What is canonical bundle identity and version, and which records/configuration are project-local?
- What compatibility and migration evidence is required for upgrades, alias removal, deprecation, or drop?
- What identifies the seed, baseline, candidate, task, model settings, rubric, and protected scorer?
- What constitutes a safety-critical failure and how are missing-dependency failures distinguished from implementation failures?

## Risk and isolation

- What risk classification controls context, filesystem, network, credential, review, and approval requirements?
- Which protections are prompt-guided, audited, or enforced?
- How is an unsupported isolation claim prevented?

# 20. Recommended next design action

Present this exact frozen design-and-implementation envelope for Human Review. The human may accept, request revision, defer, or reject it. Do not create tasks, request kick-off, or implement before that decision. Alternate-model or alternate-family review is not required by the target system.

If the human accepts the envelope, the project orchestrator should ask the parent component builder to read its own `as-is.md`, identify impacted children, inject child-specific plans into their planned sections, and verify plan injection. A fresh child-scoped `component-builder` is then admitted from each particular child’s own record and receives the detailed implementation packet. The child implements substantially blindly within that packet, performs child-level verification, integrates only its assigned result into the parent worktree, and reports evidence, unresolved questions, and recovery state. The parent records child dispositions and plan-accounting status; it does not independently verify or integrate the child implementation.

A suitable first design/implementation envelope would define the current-versus-accepted-target record model, component hierarchy, child planned-section and implementation-packet schema, scope-preserving parent-worktree integration mechanism, and one repository-local mock feature. No implementation, artifact retirement, task creation, target-contract adoption, or release authorization is implied by this proposal.
