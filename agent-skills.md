# Skills Architecture for Knowledge-Work Agents

This document is a conceptual catalog for a knowledge-work automation system.
It is intentionally comprehensive at the level of capability domains, not an
exhaustive list of every technique, domain practice, or tool integration.

## Core Terms

- **Capability domain:** A stable area of competence, such as direction,
  understanding, decision-making, or coordination.
- **Skill family:** A navigational grouping of related atomic skills. A family
  is not necessarily an executable unit.
- **Atomic skill:** A reusable capability with one primary purpose that can be
  independently invoked, assessed, improved, permissioned, and reused.
- **Operational skill:** A concrete procedure that applies one or more atomic
  skills to a recurring type of work.
- **Component-maintenance skill:** An operational skill that reviews a bounded
  component for housekeeping and improvement opportunities, then composes the
  smallest relevant skills and validation to address them.
- **Domain playbook:** An organization- or domain-specific workflow that
  combines operational skills, tools, policies, and local knowledge.
- **Agent role:** A configured role bundle of tools, permissions, model
  characteristics, and instructions. Agents use globally available skills;
  skills are not selected, allowlisted, or added through agent front matter,
  and agents do not own skill definitions.
- **Workflow or orchestrator:** The mechanism that directs work across agents,
  preserves state, applies policy, and coordinates human input.

## Skill Design Principles

- Define canonical skills at an atomic level, then group and bundle them for
  navigation and use.
- Do not create a skill for every tool operation. A skill is useful when it is
  worth assigning, testing, improving, observing, or governing independently.
- Keep skills reusable across roles. For example, define prioritization once;
  do not duplicate it in every planning, research, or implementation agent.
- Use component-maintenance skills for bounded housekeeping and improvement work
  that crosses individual artifacts while remaining within one component.
- Specify operational skills with inputs, constraints, method, output, checks,
  and stopping or escalation conditions when they are implemented.
- A maintenance skill may recommend a deterministic replacement for a
  nondeterministic flow, but only when the component's requirement and evidence
  establish a concrete correctness, cost, recovery, or repeatability benefit.
- Keep the catalog extensible. Domain playbooks and tool adapters will expand;
  foundational capability domains should remain relatively stable.

See [Design Principles](docs/design-principles.md) for the project-wide principles
that govern this catalog and its implementation.

## Layers of Reuse

1. **Foundational capabilities** are the atomic reasoning, execution, and
   coordination abilities listed below.
2. **Operational skills** define repeatable procedures such as a feasibility
   prototype, research brief, incident analysis, or document review.
3. **Domain playbooks** adapt those procedures to a particular organization,
   business process, system, policy regime, or customer context.

## Direction

- **Problem framing:** State the problem to solve and the decision or outcome
  it should support.
- **Requirement extraction:** Separate explicit requirements, implied
  expectations, assumptions, and unknowns.
- **Constraint definition:** Identify hard constraints, preferences,
  non-goals, acceptance criteria, and relevant invariants; surface conflicts.
- **Acceptance design:** Translate objectives into observable conditions that
  establish sufficient completion.
- **Scope control:** Distinguish required current work from deferred work and
  prevent unapproved expansion.
- **Clarification design:** Ask only questions whose answers could materially
  change the direction, constraints, or result.
- **Prioritization:** Order goals, risks, investigations, and tasks using value,
  urgency, dependencies, uncertainty reduction, risk reduction, effort, and
  reversibility.

## Understanding and Evidence

- **Context building:** Assemble the smallest authoritative, decision-ready
  context set with provenance, constraints, assumptions, unknowns, and a safe
  next action. See [`skills/context-building/SKILL.md`](skills/context-building/SKILL.md)
  for the operational contract.

- **Execution-evidence exploration:** Use bounded trace and readable session
  metadata evidence for debugging, process improvement, and budget analysis
  without granting execution or task authority. See
  [`skills/exploring-execution-evidence/SKILL.md`](skills/exploring-execution-evidence/SKILL.md)
  for the operational contract.

- **Evidence gathering:** Collect relevant facts from records, systems,
  documentation, observations, tests, logs, and authoritative sources.
- **Source evaluation:** Judge authority, freshness, applicability, provenance,
  and contradictions between sources.
- **Evidence extraction:** Separate supported claims, observations, inferences,
  and unresolved questions.
- **Context compression:** Summarize information without losing
  decision-relevant details or provenance.
- **Knowledge structuring:** Convert facts into inventories, maps, timelines,
  tables, dependency graphs, and other useful representations.
- **Durable record structuring:** Create and maintain `as-is.md` architecture
  records with stable sections, explicit links, diagrams, and parent-to-child
  context handoff. See [`skills/structuring-as-is-records/SKILL.md`](skills/structuring-as-is-records/SKILL.md).
- **Assumption tracking:** Make uncertainty explicit and validate consequential
  assumptions.
- **System modeling:** Map data flow, state, control flow, ownership, and
  internal and external boundaries.

## Analysis and Experimentation

- **Hypothesis formation:** Express a testable explanation or prediction.
- **Hypothesis-driven investigation:** Select checks that distinguish plausible
  explanations rather than merely gathering more information.
- **Root-cause analysis:** Distinguish symptoms from causes through evidence and
  falsification.
- **Invariant identification:** Identify conditions that must remain true,
  especially for integrity, safety, compatibility, and security.
- **Edge-case analysis:** Consider boundaries, invalid states, concurrency, and
  failure paths.
- **Impact analysis:** Identify affected users, callers, systems, tests,
  documentation, operations, and deployment behavior.
- **Prototype design:** Create the smallest bounded and falsifiable experiment
  that can resolve a consequential feasibility, behavior, usability, or
  performance uncertainty.
- **Measurement design:** Define the observations and thresholds that make an
  experiment informative.
- **Experiment interpretation:** Separate evidence from incidental results and
  decide whether to discard, repeat, expand, or productionize an experiment.
- **Promotion or discard decision:** Explicitly decide whether a prototype is
  disposable, should become a durable artifact, or requires further work.

## Decision-Making

- **Option generation:** Produce practical alternatives before selecting one.
- **Decision-criteria definition:** Establish the criteria and weighting used
  to compare alternatives.
- **Trade-off analysis:** Compare correctness, value, complexity, risk, cost,
  time, and maintainability.
- **Risk assessment:** Estimate likelihood, impact, detection, and mitigation.
- **Reversibility analysis:** Prefer decisions and experiments that are cheap
  to undo when uncertainty is high.
- **Decision recording:** Preserve the choice, rationale, rejected options,
  evidence, constraints, and assumptions.
- **Escalation judgment:** Identify decisions that require human input,
  additional authority, or domain expertise.

## Planning and Execution

- **Task decomposition:** Break work into independently executable units with
  clear outputs and boundaries.
- **Dependency analysis:** Identify prerequisites, blockers, ordering, and
  shared interfaces.
- **Implementation planning:** Choose an ordered change and verification
  sequence.
- **Resource management:** Allocate available time, budget, context, tools, and
  parallel capacity according to priority and risk.
- **Progress tracking:** Maintain durable task status, results, blockers, and
  next actions.
- **Recovery planning:** Preserve useful findings from failed or interrupted
  work and select a safe continuation or fallback.
- **Adaptation:** Reassess the plan when new evidence invalidates assumptions or
  changes priorities.

## Creation and Quality

- **Artifact design:** Define the structure, audience, interfaces, and quality
  expectations of the required output.
- **Interface design:** Define module or agent contracts, including inputs,
  outputs, errors, ownership, and compatibility.
- **Minimal-change design:** Solve the stated need with the smallest safe
  modification.
- **Refactoring judgment:** Separate necessary structural work from
  scope-expanding cleanup.
- **Codebase orientation:** Learn architecture, conventions, tooling, and
  relevant execution paths efficiently.
- **Technical writing:** Create maintainable documentation, runbooks,
  architecture notes, and release notes.
- **Code and artifact review:** Search for defects, regressions, omissions,
  security issues, and quality gaps.
- **Test strategy:** Choose the smallest set of tests or checks that establishes
  useful confidence.
- **Verification discipline:** Match validation depth to risk, from lightweight
  checks through end-to-end or operational validation.
- **Completion committing:** Create a scoped, validated version-control handoff
  when a task and all of its descendants are eligible for completion.

## Communication and Coordination

- **Handoff writing:** Produce concise, actionable results for people or other
  agents, including status, evidence, decisions, artifacts, and next actions.
- **Audience adaptation:** Tailor explanations and artifacts for users,
  maintainers, operators, reviewers, and external stakeholders.
- **Uncertainty communication:** State confidence, evidence, assumptions, and
  residual risk.
- **Status reporting:** Communicate progress, blockers, completion, and next
  actions concisely.
- **Boundary definition:** Specify owned component scope, excluded areas,
  expected artifacts, and completion criteria.
- **Vertical delegation:** Delegate a bounded subtask to an agent operating at a
  lower component level, with a durable task record and expected return state.
- **Interface negotiation:** Agree on contracts before dependent work proceeds.
- **Conflict prevention:** Detect overlapping ownership or incompatible changes
  early and move shared work to the appropriate common ancestor.
- **Integration management:** Reconcile dependent results, resolve semantic
  conflicts, and verify the combined outcome.
- **Independent review:** Have a separate role challenge results, evidence, and
  assumptions when risk warrants it.
- **Human interaction design:** Request direction, decisions, clarification, or
  approval from a human at consequential decision boundaries.
- **External-system interaction:** Exchange information with external systems
  through approved interfaces, preserving provenance, validation, and failure
  handling.

## Safety and Governance

- **Permission awareness:** Recognize actions requiring confirmation, such as
  deletion, external publication, deployment, or spending.
- **Secret handling:** Prevent credentials and sensitive data from entering
  prompts, logs, commits, or generated artifacts.
- **Change safety:** Use reversible changes, dry runs, staging, rollback plans,
  and appropriate verification.
- **Auditability:** Preserve evidence, decisions, task state, and provenance
  needed to understand or recover work later.
- **Policy application:** Apply organizational, legal, security, and operational
  requirements at the relevant decision and action boundaries.

## Composition Into Agent Roles

The same globally available skills may be used by multiple roles. A research agent might combine
evidence gathering, source evaluation, evidence extraction, and synthesis. A
planning agent might combine constraint definition, acceptance design,
prioritization, decomposition, dependency analysis, and risk assessment.

An agent role adds specialization, allowed tools, permissions, model choices,
and a bounded responsibility. It should not redefine the shared skills it uses.
The orchestrator composes roles into a workflow, maintains durable task state,
and routes human control and approvals.

## High-Value Starting Set

1. Problem framing, requirement extraction, and constraint definition.
2. Acceptance design and prioritization.
3. Evidence gathering, source evaluation, and assumption tracking.
4. Task decomposition, dependency analysis, and boundary definition.
5. Option generation, trade-off analysis, and risk assessment.
6. Prototype design, measurement design, and experiment interpretation.
7. Minimal-change design, test strategy, and verification discipline.
8. Durable progress tracking, handoff writing, and recovery planning.
9. Vertical delegation, integration management, and human interaction design.
