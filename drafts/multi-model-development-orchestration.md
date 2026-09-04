# Agentic Development Model Strategy

## Status and scope

This is a draft orchestration proposal, not a target-system architecture, implementation plan, task authority, or contract specification. It describes model responsibilities, review sequencing, context discipline, periodic compaction, and evaluation concerns for the rearchitecture exercise. It must not define target-system contracts. Sol should define or approve those contracts during the architecture phase if the target system requires them; Terra may identify contract questions and provisional considerations only.

The central project principle is: **humans focus on design and features; agents take care of implementation**. Implementation is the verified, evidence-bearing equivalent of compiled output for humans, while design should be communicated through images, diagrams, tables, and other structured representations where useful. Internal consistency with the overarching goal is more important than mechanically following the current design; deviations from current behavior or records must be surfaced and escalated rather than applied silently.

The purpose of the exercise is to achieve the overarching user goal, not to implement visible backlog items. Relevant `as-is.md` records represent the existing setup. Backlogs, changelogs, and related drafts may be read to understand the course of the existing work, but they are historical or planning context only and must not be treated as implementation guidance.

The target system is intended to be usable by other projects, not only by this repository. Installation or consumption, project-local configuration and records, skill/tool distribution, compatibility, upgrades, provider configuration, credentials, and isolation are planning concerns for the target architecture. This draft does not choose the distribution model.

For the current global orchestration session, pause for a durable checkpoint before the orchestrator's estimated remaining context capacity falls below 20% of its context window. This is an operating procedure for the present session, not a target-system runtime requirement. At the checkpoint, stop launching new work, preserve the current stage, owner, source/result references, decisions, unresolved questions, budget observations, next action, and recovery obligations, and then compact or start a fresh orchestrator session. A child or reviewer may continue only when its bounded handoff is safely preserved. Do not transfer this threshold to the target system unless a later architecture decision independently establishes that need.

## Overview

This document describes a hierarchical model-orchestration strategy for building software with AI agents. The central idea is to use models according to their strengths rather than asking one model to perform every kind of work.

> Stronger models define constraints and resolve uncertainty; lower-cost models execute bounded work; automated verification determines whether the work is acceptable.

The current implementation uses the following proposed model roles:

The guiding division is that humans focus on design and features, while agents perform implementation. The planning phase focuses on human-facing design documents, including images, diagrams, tables, and other structured representations that improve human understanding. Implementation may start only after the user explicitly aligns on the design direction. Implementation is treated as verified, evidence-bearing realization of that design rather than as a second design authority.

- **GPT-5.6 Sol** — high-complexity architecture and difficult reasoning
- **GPT-5.6 Terra** — planning, coordination, ordinary architecture, and review
- **GPT-5.6 Luna** — routine implementation and high-volume coding tasks

These are current-implementation roles, not a fixed target roster. During construction, the system may define additional purpose-specific agents and associate them with suitable models. Model and alternate-reviewer selection may use authorized OpenRouter Benchmark APIs as evidence, while preserving provider credentials in the environment and outside prompts, records, telemetry, and output. The model names are **Luna, Terra, and Sol**. “Sol” is the third model, not “Soul.”

## Why use multiple models?

Software development contains different classes of work:

- Architectural decisions require broad context and deep reasoning.
- Task planning requires understanding dependencies and translating designs into executable work.
- Routine implementation benefits from speed, cost efficiency, and well-defined prompts.
- Testing and static analysis are best handled by deterministic tools.

A hierarchical system can reduce cost and latency while reserving the most capable model for decisions where errors would have large downstream effects.

This is not simply a matter of using a strong model to design and a weaker model to code. The eventual target-system architecture will need durable, testable constraints and evidence. This draft does not define those target-system contracts; it identifies the kinds of concerns Sol should address when defining or approving them, including interfaces, acceptance, invariants, security, scope, non-goals, and deterministic checks.

## Model responsibilities

### GPT-5.6 Sol

In the current implementation, Sol is the flagship model and should be used for complex reasoning, long-horizon engineering, command-line work, and decisions that are costly to get wrong. The target system may assign these responsibilities to another suitable agent/model combination if its architecture establishes that this is better.

Recommended uses:

- Initial system architecture
- Core domain and data-model design
- Security and privacy architecture
- Distributed-systems design
- Database and migration strategy
- Major cross-cutting refactors
- Resolving failures that persist across several attempts
- Reviewing whether the architecture itself is incorrect
- Final review before an important production release

Sol does not need to participate in every implementation task. Its role is to provide architectural authority at important milestones and to resolve high-risk ambiguity.

### GPT-5.6 Terra

In the current implementation, Terra is the balanced model for coding, reasoning, and agentic work. It can act as the engineering coordinator between high-level architecture and routine implementation. The current global orchestration session is not using Terra; Terra is the planned downstream refinement and implementation-plan enrichment reviewer. The target system may create additional planning or coordination agents as needed.

Recommended uses:

- Translating architecture into implementation tasks
- Defining task dependencies
- Preparing implementation prompts
- Creating interfaces and acceptance criteria
- Reviewing ordinary pull requests or changes
- Debugging medium-complexity problems
- Maintaining consistency across modules
- Updating plans when implementation reveals new information

Terra can be used for architecture on smaller or lower-risk projects. For a new, complex, or security-sensitive system, Sol should approve the major architectural decisions.

### GPT-5.6 Luna

In the current implementation, Luna is the fast, cost-efficient model for high-volume work and lightweight agentic workflows. It should receive narrow, well-specified tasks rather than broad architectural responsibility. Every implementation-agent result requires review; Luna is an example of the current implementation role, not a mandatory target-system role.

Recommended uses:

- Implementing clearly defined functions
- CRUD endpoints and repository methods
- UI components
- Adapters and integrations with established interfaces
- Adding unit and integration tests
- Documentation
- Straightforward refactoring
- Formatting and mechanical edits
- Fixing simple linting or type-checking errors

Luna should not independently redesign core abstractions, change security boundaries, alter database schemas, or perform large cross-module refactors unless a stronger model explicitly authorizes the change.

## Recommended workflow

```text
Sol
  │
  │ High-level architecture and difficult decisions
  ▼
Terra
  │
  │ Task decomposition, coordination, and ordinary review
  ▼
Luna
  │
  │ Bounded implementation tasks
  ▼
Automated verification
  │
  ├── Tests
  ├── Type checking
  ├── Linting
  ├── Build checks
  ├── Integration tests
  └── Security checks
  │
  └── Failures routed back to Terra or Sol
```

### Phase 1: Architectural design

Sol should produce or approve the target-system architecture and its authoritative representations. The following are review topics, not a contract defined by this draft:

- System goals and assumptions
- Architecture and module boundaries
- Domain model
- API and data-storage decisions
- Security and privacy requirements
- Dependency constraints
- Coding conventions
- Test strategy
- Architectural decision records
- Proposed work decomposition and dependencies

The initial architecture should be treated as a hypothesis rather than an irreversible specification.

### Phase 2: Build one vertical slice

Do not generate and implement the entire project in one pass. First produce the human-facing design for a small end-to-end slice and obtain explicit user alignment on that design. Only then plan and implement the slice so it exercises the main architecture:

1. Define the smallest useful domain model.
2. Implement one backend or service path.
3. Connect the relevant interface or client.
4. Add automated tests.
5. Run the complete verification pipeline.
6. Review what the implementation teaches about the architecture.
7. Revise the design before expanding the system.

This reduces the risk of propagating incorrect assumptions through the entire codebase.

### Phase 3: Task decomposition

Terra should propose how the Sol-approved design could be decomposed into small, independently testable tasks. The task fields listed below are review considerations, not a target-system task contract. Sol should define or approve the target task, acceptance, scope, invariant, and completion representations during the architecture phase.

Useful considerations include a unique identity, objective, dependencies, inputs and outputs, allowed scope, acceptance evidence, verification, security and architectural invariants, non-goals, and a definition of done.

### Phase 4: Bounded implementation

The selected implementation agent implements one approved task at a time, only after explicit user alignment on the applicable human-facing design. Luna is the current implementation example, not a mandatory target role. Every implementation-agent result must be reviewed: deterministic checks are mandatory, Terra or the receiving builder reviews ordinary results, and Sol, a specialist, or a human reviews high-risk, architectural, security-sensitive, or otherwise escalated results.

The selected implementation agent should:

1. Read the approved task description and relevant project guidance.
2. Inspect the existing code in the permitted area.
3. Make the smallest change that satisfies the task.
4. Add or update tests.
5. Run linting, type checking, and relevant tests.
6. Report the files changed and verification results.
7. Stop and escalate if the task requires an architectural change.

### Phase 5: Verification

Every implementation should be checked using deterministic tools where possible:

- Unit tests
- Integration tests
- End-to-end tests where appropriate
- Type checker
- Linter
- Formatter
- Build and packaging checks
- Dependency and vulnerability checks
- Security tests
- API/schema validation

The verification system is part of the communication protocol between the models. Models should not rely only on prose explanations of correctness.

### Phase 6: Review and escalation

Terra should review routine implementation-agent results and diagnose ordinary failures. Sol, a specialist, or a human should review high-risk, architectural, security-sensitive, or otherwise escalated results. Escalate to Sol when:

- Tests fail repeatedly without a clear local cause.
- Several modules need to change together.
- A core abstraction must be changed.
- The database schema or migration strategy is affected.
- A security boundary is involved.
- Requirements are contradictory or ambiguous.
- The implementation reveals that the original architecture is unsuitable.
- A large or suspicious diff is produced.

## Plan review and refinement

The initial orchestration proposal should be reviewed before implementation. Terra should refine the current plan into an implementation-ready sequence with task boundaries, dependencies, acceptance criteria, deterministic checks, and explicit ownership. Sol should independently validate and red-team that refinement, with particular attention to authority boundaries, failure and retry behavior, budget handling, context assumptions, and whether the launcher remains the single Pi delegation mechanism. Terra and Sol should then conduct a bounded ping-pong review: each substantive Sol objection returns to Terra for an explicit disposition and revision, and each material Terra revision returns to Sol for independent re-review. Terra may use serial in-process `call_subagent` consultations with Sol for focused feedback and suggestions, but a fresh independent Sol session should review each final material revision. The loop ends only when Sol approves the revised approach or records why a remaining disagreement requires human decision; it must preserve disagreements and escalate unresolved architectural decisions rather than silently averaging them away. Model agreement is not human approval and never authorizes implementation.

Terra and Sol may recommend a reviewer from another model family, but that recommendation is advisory. The alternate reviewer should be selected for the risk under examination and should challenge the plan without acquiring approval, implementation, or task authority. For context work, a reviewer with build/dependency-closure, workspace-isolation, and reproducibility expertise is preferable. A full-context reviewer can identify omitted dependencies; a reviewer operating in the proposed restricted context can assess whether the supplied context is coherent and sufficient.

## Context discipline

The first context experiment should use a soft boundary rather than full dependency-closure pruning. Each Pi child should run in a separate worktree and CWD, which protects the caller's uncommitted work and provides a clear execution root, but does not enforce read isolation. The child should be instructed to read only the task record, applicable repository guidance, and files needed for the assigned work and verification. It should not explore unrelated components, historical records, or runtime state merely for background.

If a required dependency is outside the assigned scope, the child should report the missing dependency and stop rather than silently broadening the task. The child should report files read, changed, and verified; this report is advisory evidence, not proof of compliance. The first version should not add materialized dependency workspaces, BBWrap or another OS sandbox, or enforced read manifests. Those controls should be introduced only if measured failures show that prompt-guided discipline is insufficient, beginning with the smallest control that addresses the observed failure.

Use stronger boundaries for higher-risk work. Low-risk bounded work may use a separate CWD and prompt guidance; medium-risk work may add read auditing and stronger review; security-sensitive or high-risk work should require an enforced boundary, sandbox, or explicit human approval before implementation.

## Staged adoption and evaluation

First land the reviewed orchestration plan as proposal material on the `implementing-composable-skills` branch. Terra and Sol should ping-pong the proposal until Sol's blocking objections are resolved or explicitly assigned to a human decision; a Terra reconciliation alone is not the end of review. Then develop the soft-context experiment and its implementation plan separately, keeping that plan document-only until Terra and Sol review it. Implement the accepted context experiment back on `implementing-composable-skills`, preserving the planning document as provenance, and compare its efficacy with `master` before merging or adopting the result.

The comparison should use paired tasks, fresh worktrees, identical task descriptions, model settings, budgets, deterministic checks, and retry policy. Measure task success, deterministic verification results, irrelevant-file reads, scope violations, missing-dependency failures, cost, latency, retries, escalations, later review defects, and integration rework. Treat missing-dependency failures separately from unexplained implementation failures: explicit discovery of an incomplete boundary is preferable to silently relying on irrelevant context. The experiment should not claim enforced read isolation unless a later implementation adds and tests an actual access boundary.

## Target-system contract boundary

This draft intentionally does not provide an example task contract or prescribe the target system's schemas, APIs, records, or acceptance formats. Such examples can be mistaken for implementation authority. Terra should identify the contract questions exposed by the existing implementation; Sol should define or approve the target-system contracts after reviewing those questions and the architectural evidence. Any contract text produced during planning must be labelled provisional until that decision is made.

The same rule applies to human-feedback, expert-review, status, issue, recovery, delegation, context, and handoff representations. This document may describe concerns and review criteria for them, but it does not establish their target-system shape.

## Model-routing policy

This routing table describes the current implementation proposal and review topics, not a target-system roster or binding routing contract. The target system may create other agents, assign different models, or use OpenRouter Benchmark API evidence to select them. Any such deviation from the current arrangement should be surfaced and escalated through the approved architecture process.

| Situation | Recommended model or tool |
|---|---|
| Formatting and mechanical edits | Deterministic tools or Luna |
| Simple isolated implementation | Luna |
| CRUD, adapters, and routine tests | Luna |
| Task decomposition | Terra |
| Medium-complexity debugging | Terra |
| Ordinary code review | Terra |
| New subsystem design | Sol, with Terra refinement |
| Security-sensitive code | Sol and human review |
| Data migration design | Sol and human review |
| Major cross-module refactor | Sol |
| Repeated test failure | Terra first, then Sol |
| Final release review | Sol |

The model router should be based on task risk and ambiguity, not only on estimated token count.

## Cost and capability strategy

The following prices were checked on OpenRouter model pages. Prices are per **one million tokens (1M)** and can change. The model IDs are:

- `openai/gpt-5.6-luna`
- `openai/gpt-5.6-terra`
- `openai/gpt-5.6-sol`

### Listed model prices

| Model | Input | Output | Cache read | Cache write | Web search |
|---|---:|---:|---:|---:|---:|
| GPT-5.6 Luna | $0.20/M | $1.20/M | $0.02/M | $0.25/M | $10/1K calls |
| GPT-5.6 Terra | $2.00/M | $12.00/M | $0.20/M | $2.50/M | $10/1K calls |
| GPT-5.6 Sol | $2.50/M | $15.00/M | $0.25/M | $3.125/M | $10/1K calls |

### Provider variation

OpenRouter may route requests to different providers. The current provider tables show the following prices:

| Model | Lowest listed provider price | Other listed provider prices |
|---|---:|---:|
| Luna | $0.20 input / $1.20 output | $0.22 / $1.32 |
| Terra | $2.00 input / $12.00 output | $2.20 / $13.20 |
| Sol | $2.50 input / $15.00 output through the discounted OpenAI endpoint | $5.00 / $30.00, or $5.50 / $33.00 on other listed endpoints |

The Sol page currently displays a **50% discount** for the OpenAI provider. The displayed model price is $2.50/M input and $15/M output, while some other Sol providers list the undiscounted or higher regional price. Check the provider pricing at the time of use if cost predictability matters.

### Example costs

For a request containing **100,000 input tokens and 20,000 output tokens**, excluding caching and web search:

| Model | Approximate request cost at listed model price |
|---|---:|
| Luna | $0.044 |
| Terra | $0.44 |
| Sol | $0.55 |

For **1M input tokens and 1M output tokens**, the approximate cost is:

| Model | Approximate cost |
|---|---:|
| Luna | $1.40 |
| Terra | $14.00 |
| Sol | $17.50 |

These examples use the listed model prices, not necessarily the price of every provider route. Cached input can be substantially cheaper, but cache-write charges may apply when creating the cache.

### Practical cost policy

- Use Luna for the majority of routine implementation work.
- Use Terra for planning, coordination, medium-complexity debugging, and ordinary review.
- Use Sol for architecture, security, major refactors, persistent failures, and high-risk release review.
- Keep long-lived architecture and repository instructions stable so they can benefit from prompt caching.
- Log token usage by model and task so the routing policy can be evaluated using actual project costs.

Prices and model availability can change. Verify the OpenRouter pages before production deployment.

An important observation is that Sol is only modestly more expensive than Terra at the currently displayed discounted price, although Sol may be substantially more expensive when routed to a provider without that discount. Therefore, when a task is important enough to require Terra, Sol may be worthwhile if the additional reasoning quality materially reduces risk or rework.

## Main risks and mitigations

### Architecture drift

**Risk:** Luna makes locally reasonable changes that violate global design.

**Mitigations:**

- Keep Sol-approved representations, invariants, and verification requirements in the repository.
- Restrict allowed files and modules.
- Require tests for each task.
- Review cross-cutting changes with Terra or Sol.

### Error amplification

**Risk:** A wrong initial design is expanded into many modules.

**Mitigations:**

- Build one vertical slice first.
- Review architecture after real implementation feedback.
- Use short task sequences and frequent integration checks.
- Treat architecture as revisable.

### False confidence

**Risk:** Code passes superficial tests while violating business, security, or operational requirements.

**Mitigations:**

- Define acceptance tests before implementation.
- Include domain invariants and negative cases.
- Use security and integration testing.
- Require stronger-model review for high-risk changes.

### Context loss

**Risk:** An agent changes intentional behavior because it does not know why a decision was made.

**Mitigations:**

- Maintain architectural decision records.
- Document important non-obvious constraints.
- Link tasks to the relevant design decisions.
- Keep repository guidance concise and current.

### Review bottlenecks

**Risk:** Sol becomes a bottleneck if every small change requires review.

**Mitigations:**

- Use deterministic checks for routine work.
- Use Luna for bounded tasks.
- Use Terra for normal review.
- Escalate only high-risk or ambiguous work to Sol.

## Initial implementation recommendation

For the first version of the agentic development system:

1. Use **Sol** to define or approve the target-system architecture and authoritative representations, including the first vertical slice and the human-facing design approach.
2. Use **Terra** to refine, verify, and enrich the approved architecture into human-facing design documents and a proposed bounded implementation sequence.
3. Obtain explicit user alignment on the human-facing design before implementation planning and execution.
4. Use **Sol** to validate the plan and define or approve any target-system contracts it requires.
5. Use **Luna** or another selected implementation agent to implement small, isolated approved tasks.
6. Run automated tests and static checks after every task, and review the implementation-agent result with Terra or the receiving builder; escalate high-risk results to Sol, a specialist, or a human.
6. Use **Terra** to investigate ordinary failures and review changes.
7. Use **Sol** for architectural changes, security decisions, persistent failures, and release review.
8. Record decisions, task outcomes, test results, and model usage for later evaluation.

A minimal system using all three models is viable, but Sol is not required for every operation. The model hierarchy should remain flexible and should be evaluated using actual project outcomes.

## Evaluation criteria

Before adopting the routing policy or a rearchitecture, test the current and proposed workflows on representative projects and measure:

- First-pass task success rate
- Number of incorrect or unnecessary edits
- Test and review failure rate
- Architectural revisions required
- Security defects found after implementation
- Cost per completed task
- Latency
- Escalation frequency
- Performance on unfamiliar codebases
- Ability to recover from failed tests

The best routing policy is the one that minimizes the total cost of producing correct, maintainable software—not merely the cost of individual model calls.

## Conclusion

The current Sol–Terra–Luna arrangement is a useful implementation baseline for evaluating an agentic development system, subject to rearchitecture review. It is not a required target hierarchy; the target system may create other agents and model assignments when the goal, risk, and benchmark evidence justify them. Sol must validate the target architecture and define or approve its authoritative representations:

- **Sol** provides high-level architectural judgment.
- **Terra** coordinates engineering work and handles normal reasoning and review.
- **Luna** performs well-bounded implementation work at lower cost and latency.
- **Automated verification** prevents the system from relying solely on model confidence.

The most important design principle is to make the handoff between models explicit and durable across periodic compaction. After Sol defines or approves the target-system representations, architecture can become validated implementation tasks, tests, invariants, and evidence. With that structure, less expensive models can safely handle a substantial portion of implementation while stronger models focus on uncertainty, risk, and system-level correctness.

## References

- [GPT-5.6 Luna on OpenRouter](https://openrouter.ai/openai/gpt-5.6-luna)
- [GPT-5.6 Terra on OpenRouter](https://openrouter.ai/openai/gpt-5.6-terra)
- [GPT-5.6 Sol on OpenRouter](https://openrouter.ai/openai/gpt-5.6-sol)
