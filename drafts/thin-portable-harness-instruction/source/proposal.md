# Draft Proposal: Explore a Thin Portable Harness Instruction

## Status and decision boundary

This is a temporary exploration proposal, not an adopted architecture, implementation plan, task record, runtime contract, or authority transfer.

**Decision for the human:** whether to authorize a bounded comparison of the current role-and-skill architecture with a thin portable instruction for projects that already provide a primary harness.

The proposal intentionally accepts model-dependent behavior and fewer formal contracts as a possible trade-off for portability and simplicity. It does not claim that model-only instructions can enforce runtime limits, permissions, isolation, budgets, task state, or completion guarantees.

## Recommended artifact type

Use a clearly labelled **draft/proposal**.

| Artifact type | Fit | Reason |
| --- | --- | --- |
| Temporary draft/proposal | Recommended | Preserves an exploratory comparison, alternatives, risks, and a human decision without changing current authority. |
| As-is record | Not appropriate | An `as-is.md` record describes current durable component architecture; this proposal must not represent a possible future consolidation as current fact. |
| Backlog item | Insufficient alone | A backlog item can index a later decision or experiment, but is too small to carry the representative flows, trade-offs, and evaluation design. |
| Task record | Premature | A task record would imply authorized implementation work before the required human alignment. |
| Design or decision document | Later possibility | This may become appropriate only after a human chooses a direction and identifies the decision, scope, owners, and consequences that need durable adoption. |

## Context

### Observations

- The current repository separates user-facing routing, component building, consultation, validation, evidence investigation, and bounded worker roles.
- The current skill catalog separates composition-authority skills from focused composable procedures.
- Current component and delegation paths deliberately preserve task, component, validation, recovery, and completion boundaries.
- The current architecture explicitly distinguishes role and skill prose from deterministic control-plane and launcher enforcement.

### Inference

A thin portable instruction could be useful for projects that already have a capable primary harness and prefer one reader-oriented behavioral guide over a repository-specific roster of roles and skills. It would trade explicit specialization, discoverable procedural contracts, and some repeatable control points for reduced setup and greater reliance on the selected model and host.

### Uncertainties

- “Primary harness” is not yet defined for this proposal: its tool model, permission checks, isolation, task representation, validation facilities, and delegation support may differ materially between projects.
- It is unknown whether a single instruction remains understandable and reliable across the representative flows without reproducing the complexity of the current architecture.
- It is unknown which current safeguards are essential in portable use and which are repository-specific elaboration.
- A successful model response in an experiment would be evidence of behavior under test conditions, not proof of a general guarantee.

## Scope

Explore a thin instruction that tells a capable model how to orient, choose a direct response or a routed path, preserve human authority, consult when useful, make bounded changes when authorized, validate results, and stop on missing authority or capability.

The exploration compares behavioral outcomes, not document count or prompt brevity alone.

## Explicit non-goals

- No current architecture changes.
- No consolidation, retirement, relocation, or rewriting of agents, skills, contracts, runtime controls, or records.
- No implementation task creation or implementation planning before human alignment.
- No authority transfer from humans, owners, task records, or runtime controls to a model instruction.
- No claim that model-only instructions enforce runtime guarantees, permissions, isolation, budgets, scope, delegation limits, validation, recovery, or completion.
- No requirement that all projects use component records, task records, subagents, commits, changelogs, or the current repository’s terminology.
- No replacement of deterministic harness controls where a project needs enforceable safety or reliability properties.

## Candidate thin-instruction posture

The candidate instruction would be intentionally small and portable. It would direct the model to:

1. Identify the requested outcome, applicable project context, and source of authority.
2. Answer directly only when the request is informational or safely bounded and needs no action.
3. Otherwise select the smallest appropriate path: request clarification, recommend a role, consult an advisor, perform an authorized bounded change, or stop.
4. Respect harness-enforced permissions, project-local records, explicit scope, and explicit approval over inferred intent.
5. Delegate only when the harness permits it and the handoff identifies scope, return conditions, and limits.
6. Validate changed behavior with available relevant evidence.
7. Report what was done or observed, evidence, unresolved assumptions, and the next required decision.
8. Stop rather than inventing authority, capabilities, success, or recovery facts.

This is a behavioral hypothesis, not a proposed enforcement mechanism.

## Representative flows for evaluation

The table below specifies the minimum behavior to compare. “Minimal model behavior” is the smallest expected instruction-following behavior. “Model judgment” identifies intentional discretion that would not be formalized in the thin version.

| Flow | Intent and inputs | Decision points | Minimal model behavior | Optional delegation | Expected output | Deliberately left to model judgment |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Process and route a user query | Intent: understand a user request and choose the smallest safe response. Inputs: request, available project guidance, harness capability summary, and explicit authority context. | Is the request informational, actionable, ambiguous, out of scope, or missing authority? Is a project-local route available? | Classify the request without inferring approval; answer bounded informational questions or identify the next route or blocker. | None by default; a harness-supported router or role may be selected when available. | Direct answer, route recommendation, clarification request, or bounded blocker. | Interpretation of ordinary language, relevance of nearby context, and which available route best fits when several are acceptable. |
| 2. Decide direct answer versus role or subagent | Intent: avoid unnecessary routing while preserving boundaries for consequential work. Inputs: request type, risk, scope, available roles, and harness permissions. | Does the response require mutation, specialist expertise, independent review, persistent state, or substantial investigation? Is direct handling permitted? | Answer directly only when no protected action or specialized path is needed; otherwise recommend or use an explicitly available path. | A named role or subagent only when the harness supports it and authority is explicit. | Concise answer or a stated route with rationale and unmet prerequisites. | Risk calibration for ordinary requests and whether a specialist would materially improve a non-critical answer. |
| 3. Consult a specialist or advisor | Intent: obtain a bounded second perspective without outsourcing human choice. Inputs: focused question, relevant facts, uncertainty, advisor availability, and read-only constraints. | Is the question materially complex, high-risk, or outside the acting model’s confidence? Is consultation available and within scope? | Formulate a focused consultation question; preserve the advisor’s advisory status; present observations, uncertainty, alternatives, and recommendation to the human or receiving owner. | One or more harness-approved read-only specialists where justified. | Attributed advisory finding, limitations, and a recommended next decision or stop. | Whether the expected value of consultation justifies latency or cost, and the choice of a qualified available advisor. |
| 4. Build a component from a routed request | Intent: realize an authorized bounded component change. Inputs: explicit task or approval, component boundary, acceptance conditions, local guidance, and available tools. | Is the component and owner clear? Is the request authorized? Does it cross a child, parent, sibling, or external boundary? Is a task lifecycle required by the project? | Inspect the bounded context; make only authorized in-scope changes; preserve separately owned boundaries; validate against stated acceptance conditions; stop on missing prerequisites. | A restricted worker may implement an isolated subproblem if the harness and project permit it. | Scoped change report with files affected, validation evidence, unresolved issues, and handoff state. | Implementation details, change method, and test selection where project guidance does not prescribe them. |
| 5. Make a non-component change | Intent: handle a bounded project, repository, documentation, configuration, or other non-component change without fabricating component-task machinery. Inputs: requested artifact, applicable owner or project guidance, scope, and acceptance conditions. | Is the target governed by a component contract or another project/root rule? Is durable history required? | Resolve the applicable owner and scope; avoid creating a component task merely because one exists elsewhere; make and validate only the necessary change when authorized. | Generally none; use a restricted helper only for a bounded, permitted task. | Scoped result and validation evidence, or a blocker naming the unresolved owner or rule. | Whether tests add useful evidence for a simple non-code or non-behavioral change. |
| 6. Handle ambiguity or missing authority | Intent: prevent unsupported assumptions from becoming action. Inputs: ambiguous request, contradictory guidance, absent owner, unavailable capability, or incomplete scope. | Would clarification change the outcome or safety? Is there an explicit authoritative source that resolves the issue? | State the specific ambiguity, missing authority, contradiction, or unavailable capability; ask the smallest material question or stop. | An advisor may clarify technical implications but cannot create authority. | Clarification request or bounded blocker with the facts needed to resume. | Whether an ambiguity is immaterial enough to record as an assumption rather than block, provided no authority or safety boundary is affected. |
| 7. Delegate to restricted transient subagents | Intent: use bounded assistance without losing parent accountability. Inputs: authorized parent work, worker capability, scope, return conditions, available budget or limits, and harness admission. | Is delegation permitted by the harness and project? Does the worker have the necessary capabilities? Is the work independently bounded? | Supply explicit scope, inputs, prohibited actions, return format, and acceptance evidence; retain integration and completion responsibility; do not substitute unavailable workers or broaden permissions. | A single restricted transient worker or other harness-approved worker. | Worker finding and evidence; parent-side decision to integrate, recover, seek clarification, or stop. | Task decomposition and whether isolation provides enough value to justify delegation overhead. |
| 8. Validate and preserve evidence | Intent: determine whether a result meets applicable acceptance conditions. Inputs: stated acceptance, changed artifacts, available checks, and project validation rules. | Which checks are relevant and available? Did they pass? Is the evidence sufficient for the claimed outcome? | Run or request the smallest relevant available checks when action is authorized; distinguish passed, failed, unrun, and unavailable checks; never equate prose, process exit, or telemetry with semantic completion. | An independent validator or reviewer if available and material to risk. | Evidence summary, failed-check details, residual risk, and any required next step. | Choice of proportionate tests and reviewer depth when no fixed validation matrix applies. |
| 9. Fail, recover, or stop | Intent: keep partial, failed, unavailable, stale, or cancelled work understandable and bounded. Inputs: error details, partial outputs, task or request state, available recovery path, and authority. | Is the failure local and safely retryable? Is prior work recoverable? Has scope, budget, authority, or capability changed? | Preserve relevant facts; do not silently retry indefinitely, substitute capabilities, claim completion, or discard necessary recovery information; retry only where authorized and bounded, otherwise stop and escalate. | A specialist may diagnose a focused failure; a new worker attempt only when allowed by the harness and owner. | Failure report with attempted action, evidence, recoverable state, recommended next action, and stop reason if applicable. | Whether a single bounded retry is proportionate and whether failure signals a local defect or an architectural question. |
| 10. Complete and hand off | Intent: communicate a bounded outcome to the correct receiving human or owner. Inputs: scope, change or answer, acceptance evidence, unresolved items, and applicable history or handoff rules. | Are acceptance conditions met? Are delegated results accounted for? Is a durable handoff required? Who owns the next decision? | Report completed work only to the evidence-supported extent; identify what remains; leave final authority and integration with the designated owner; stop after handoff. | Optional reviewer or validator for material risk, if permitted. | Reader-oriented summary of outcome, evidence, limitations, residual risk, and next owner decision. | The most useful summary order and level of detail for the receiving audience. |

## Human-alignment decision

Before any consolidation implementation planning, the human should choose one of these outcomes:

1. **Do not explore consolidation:** retain the current architecture and revisit only if a real portability need emerges.
2. **Run a document-only comparison experiment:** evaluate the thin instruction without changing live roles, skills, contracts, or runtime behavior.
3. **Authorize a narrowly defined portability design decision:** identify supported harness assumptions, non-negotiable controls, and target project class before any implementation planning.
4. **Defer:** retain this proposal as a non-authoritative draft with the unanswered questions below.

No option authorizes implementation merely by being described here.

## Acceptance questions for the human

- Is the intended target a project with an existing harness that already enforces permissions and tool access, or must the instruction compensate for a weak or absent harness?
- Which properties must remain enforceable rather than model-guided: tool permissions, file scope, delegation limits, budgets, isolation, task state, validation, recovery, or completion?
- Is portability across several harnesses a primary goal, or is reduced maintenance within one harness the primary goal?
- Is the acceptable trade-off explicitly reduced repeatability and stronger model dependence, or are there minimum consistency and audit requirements?
- Which representative flows are mandatory for an initial comparison, and which may be deferred?
- What class of project is in scope for the first experiment: low-risk documentation, ordinary application changes, security-sensitive work, or another bounded class?
- Who may decide that experiment evidence is sufficient to begin a later design decision?
- What outcome would falsify the thin-instruction hypothesis rather than trigger more prompt refinement?

## Risks

| Risk | Consequence | Mitigation for exploration |
| --- | --- | --- |
| Prompt text is mistaken for enforcement | Unauthorized or unsafe actions may be possible when the harness does not independently constrain them. | State the enforcement boundary in every candidate instruction; test only under known harness permissions; exclude high-risk work. |
| Thin instruction recreates the current architecture in prose | Portability benefit disappears while explicit contracts become less discoverable. | Set a size and reader-comprehension threshold; stop if required exceptions make the instruction materially equivalent to the existing system. |
| Model behavior varies by model, context, or prompt order | Results may not transfer between projects or model revisions. | Use repeated paired trials across selected models and contexts; report variance rather than a single success rate. |
| Current safeguards are removed without equivalent evidence | Reliability, recovery, or audit regressions may be discovered only after real work. | Keep the experiment document-only or isolated; do not retire any current artifact during evaluation. |
| Routing becomes opaque | Users may not understand why work was answered, routed, blocked, or delegated. | Require concise stated rationale, authority source, and next decision in trial outputs. |
| Delegation limits are not genuinely enforceable | A model may attempt unapproved subagent use or overstate worker results. | Treat harness admission as required; measure attempted and actual delegations separately; stop when unsupported. |
| Evaluation rewards speed over safe outcomes | The thin option may appear favorable despite weaker validation and handoff. | Score validation quality, blockers, scope discipline, recovery, and review defects alongside latency and cost. |

## Alternatives

| Alternative | Benefits | Costs |
| --- | --- | --- |
| Retain the current architecture unchanged | Preserves explicit boundaries, specialist roles, reusable procedures, and existing runtime/control-plane distinctions. | Maintains a larger repository-specific surface and onboarding burden. |
| Add a reader-oriented index to the current architecture | Improves portability and discoverability without removing current contracts. | Does not provide a single thin instruction and may add another maintained artifact. |
| Define a thin instruction as an optional front door only | Lets primary-harness projects use a concise entry point while routing to existing detailed contracts when present. | May create two behavioral layers and require careful language about precedence. |
| Create a harness adapter profile rather than a universal instruction | Makes actual available controls explicit per host. | Reduces portability and may require host-specific maintenance. |
| Consolidate only selected low-risk procedures | Reduces surface area where evidence supports it while retaining formal paths for components and delegation. | Requires a separate evidence-based consolidation decision for each selected area. |
| Pursue full consolidation after alignment | Maximizes simplicity if the target environment truly supplies the missing controls. | Highest risk of losing explicit authority, recovery, validation, and delegation semantics. |

## Comparison experiment

### Hypothesis

For a defined class of low- to medium-risk work in projects with an adequate primary harness, a thin portable instruction can produce outcomes comparable to the current architecture on routing clarity, scope discipline, validation, recovery, and handoff, while reducing setup and reading burden.

### Baselines

- **Current-architecture baseline:** the existing roles, skills, records, and harness controls applicable to the selected scenario.
- **Thin-instruction candidate:** one clearly bounded instruction used with the same primary harness capabilities and the same project guidance, without claiming to reproduce or bypass unavailable controls.

### Experimental controls

- Use paired representative requests covering all ten flows where safely simulable.
- Keep task descriptions, repository state, harness permissions, available tools, model settings, time or token budget, and validation commands equivalent for each pair where possible.
- Use fresh or resettable workspaces for action-capable scenarios.
- Run multiple trials and, if portability is a goal, selected model variants.
- Exclude production, destructive, credential-bearing, external-service, and security-sensitive changes unless a later human decision explicitly defines safe controls.
- Preserve current architecture unchanged throughout the experiment.

### Measures

- Correct direct-answer, route, clarification, and stop decisions.
- Explicit identification of authority source, scope, and unavailable capabilities.
- Unauthorized-action attempts and actual actions prevented by the harness.
- Scope violations, irrelevant exploration, and invented task or completion claims.
- Delegation admission, bounded handoff quality, and parent-side accounting of results.
- Relevant validation attempted, passed, failed, unavailable, or omitted with rationale.
- Failure recognition, retry behavior, preservation of recoverable facts, and appropriate stops.
- Human or independent reviewer assessment of handoff clarity and residual risk.
- Latency, cost, prompt size, setup effort, and reader comprehension.
- Later integration defects or corrections attributable to the chosen approach.

### Success, warning, and stop criteria

- **Promising:** the candidate performs comparably on the selected safety and outcome measures, clearly identifies its model-dependent limits, and offers a meaningful portability or simplicity benefit.
- **Warning:** the candidate succeeds only through prompt-specific exceptions, produces materially variable behavior, or needs undocumented human correction to match the baseline.
- **Stop:** the candidate repeatedly invents authority, bypasses or misunderstands harness boundaries, loses recoverable state, materially weakens validation or handoff, or must reproduce the current architecture’s detail to remain safe.

Experiment results should support a human decision; they do not themselves authorize consolidation.

## Later path only after human alignment

If, and only if, the human authorizes a portability direction after reviewing the experiment:

1. Define the supported primary-harness assumptions and the controls that must remain external and enforceable.
2. Decide whether the thin instruction is a front door, an optional profile, or a replacement for a specifically bounded subset of current behavior.
3. Identify affected owners, consumers, records, validation obligations, migration risks, and rollback or coexistence needs.
4. Produce a separate design or decision document that records the adopted scope and non-negotiable boundaries.
5. Only then authorize a separate implementation-planning activity with explicit tasks, acceptance criteria, and evidence requirements.
6. Do not retire, merge, or rename existing roles, skills, records, contracts, or runtime controls until that later work has evidence-supported approval.

## Recommended next decision

Approve or decline the document-only paired comparison experiment. If approved, first answer the acceptance questions that define the target harness, project class, non-negotiable safeguards, and decision owner.

## Evidence

- `drafts/as-is.md` defines drafts as the repository home for bounded proposals that are not current authority, tasks, or runtime configuration.
- `agents/as-is/as-is.md` states that routing recommendations do not authorize work and that inferred intent must not create tasks or start work.
- `agents/component-builder/as-is.md` and `skills/building-components/SKILL.md` preserve component ownership, semantic integration, explicit validation, recovery, and completion boundaries.
- `skills/making-changes/SKILL.md` distinguishes component and non-component changes rather than requiring component-task machinery universally.
- `skills/spawning-subagents/SKILL.md` states that runtime and control-plane implementation, not skill prose, enforce delegation limits.
- `agents/as-is.md` states that role or skill text does not itself enforce runtime limits and that unsupported capability stops with a bounded blocker.

## Recommendation

Use this proposal as a clearly labelled temporary draft at `drafts/thin-portable-harness-instruction-proposal.md` if it is later promoted into the repository. Seek human alignment on the acceptance questions and the document-only experiment before creating any consolidation design, task, or implementation plan.

## Residual risk

The proposal is based on the repository’s current documented architecture and does not establish what a future primary harness can enforce, what external consumers require, or whether the thin-instruction behavior will generalize across models and projects.
