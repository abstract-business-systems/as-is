# Agentic Development Model Strategy

## Overview

This document describes a hierarchical model-orchestration strategy for building software with AI agents. The central idea is to use models according to their strengths rather than asking one model to perform every kind of work.

> Stronger models define constraints and resolve uncertainty; lower-cost models execute bounded work; automated verification determines whether the work is acceptable.

The proposed model family is:

- **GPT-5.6 Sol** — high-complexity architecture and difficult reasoning
- **GPT-5.6 Terra** — planning, coordination, ordinary architecture, and review
- **GPT-5.6 Luna** — routine implementation and high-volume coding tasks

The model names are **Luna, Terra, and Sol**. “Sol” is the third model, not “Soul.”

## Why use multiple models?

Software development contains different classes of work:

- Architectural decisions require broad context and deep reasoning.
- Task planning requires understanding dependencies and translating designs into executable work.
- Routine implementation benefits from speed, cost efficiency, and well-defined prompts.
- Testing and static analysis are best handled by deterministic tools.

A hierarchical system can reduce cost and latency while reserving the most capable model for decisions where errors would have large downstream effects.

This is not simply a matter of using a strong model to design and a weaker model to code. The architecture must be communicated through **executable constraints**, including:

- Interfaces and types
- API contracts
- Database schemas
- Acceptance tests
- Invariants
- Security requirements
- Allowed file boundaries
- Explicit non-goals
- Static analysis and build checks

## Model responsibilities

### GPT-5.6 Sol

Sol is the flagship model and should be used for complex reasoning, long-horizon engineering, command-line work, and decisions that are costly to get wrong.

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

Terra is the balanced model for coding, reasoning, and agentic work. It can act as the engineering coordinator between the high-level architecture and routine implementation.

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

Luna is the fast, cost-efficient model for high-volume work and lightweight agentic workflows. It should receive narrow, well-specified tasks rather than broad architectural responsibility.

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
  │ Task decomposition, contracts, coordination, and ordinary review
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

Sol should produce an initial engineering package containing:

- System goals and assumptions
- Architecture and module boundaries
- Domain model
- API contracts
- Data-storage design
- Security and privacy requirements
- Dependency constraints
- Coding conventions
- Test strategy
- Architectural decision records
- A task graph with dependencies

The initial architecture should be treated as a hypothesis rather than an irreversible specification.

### Phase 2: Build one vertical slice

Do not generate and implement the entire project in one pass. Start with a small end-to-end slice that exercises the main architecture:

1. Define the smallest useful domain model.
2. Implement one backend or service path.
3. Connect the relevant interface or client.
4. Add automated tests.
5. Run the complete verification pipeline.
6. Review what the implementation teaches about the architecture.
7. Revise the design before expanding the system.

This reduces the risk of propagating incorrect assumptions through the entire codebase.

### Phase 3: Task decomposition

Terra should convert the approved design into small, independently testable tasks. Each task should have:

- A unique identifier
- A concise objective
- Dependencies
- Explicit inputs and outputs
- Allowed files or modules
- Acceptance criteria
- Tests to add or run
- Security and architectural invariants
- Explicit non-goals
- A definition of done

### Phase 4: Bounded implementation

Luna implements one task at a time. It should:

1. Read the relevant contract and project guidance.
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

Terra should review routine changes and diagnose ordinary failures. Escalate to Sol when:

- Tests fail repeatedly without a clear local cause.
- Several modules need to change together.
- A core abstraction must be changed.
- The database schema or migration strategy is affected.
- A security boundary is involved.
- Requirements are contradictory or ambiguous.
- The implementation reveals that the original architecture is unsuitable.
- A large or suspicious diff is produced.

## Example task contract

```yaml
task: implement-session-creation
objective: Create an authenticated session for valid user credentials.
dependencies:
  - user-repository
  - password-hashing
allowed_files:
  - src/auth/session.ts
  - src/auth/session.test.ts
requirements:
  - reject invalid credentials
  - never store plaintext passwords
  - return an expiring session token
  - preserve the existing authentication interface
acceptance_tests:
  - invalid credentials return an authentication error
  - valid credentials create a session
  - expired sessions are rejected
  - plaintext passwords are never persisted
invariants:
  - do not bypass password hashing
  - do not expose internal user records
non_goals:
  - do not change the database schema
  - do not redesign the authentication system
  - do not modify unrelated API routes
definition_of_done:
  - implementation is complete
  - tests are added and passing
  - type checking passes
  - linting passes
  - only allowed files are changed
```

## Model-routing policy

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

- Keep contracts and invariants in the repository.
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

1. Use **Sol** to define the system architecture and the first vertical slice.
2. Use **Terra** to convert the architecture into task contracts.
3. Use **Luna** to implement small, isolated tasks.
4. Run automated tests and static checks after every task.
5. Use **Terra** to investigate ordinary failures and review changes.
6. Use **Sol** for architectural changes, security decisions, persistent failures, and release review.
7. Record decisions, task outcomes, test results, and model usage for later evaluation.

A minimal system using all three models is viable, but Sol is not required for every operation. The model hierarchy should remain flexible and should be evaluated using actual project outcomes.

## Evaluation criteria

Before committing to the routing policy, test the models on a representative project and measure:

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

The proposed Sol–Terra–Luna hierarchy is a viable foundation for an agentic development system:

- **Sol** provides high-level architectural judgment.
- **Terra** coordinates engineering work and handles normal reasoning and review.
- **Luna** performs well-bounded implementation work at lower cost and latency.
- **Automated verification** prevents the system from relying solely on model confidence.

The most important design principle is to make the handoff between models explicit. Architecture should become contracts, tests, invariants, and task boundaries. With that structure, less expensive models can safely handle a substantial portion of implementation while stronger models focus on uncertainty, risk, and system-level correctness.

## References

- [GPT-5.6 Luna on OpenRouter](https://openrouter.ai/openai/gpt-5.6-luna)
- [GPT-5.6 Terra on OpenRouter](https://openrouter.ai/openai/gpt-5.6-terra)
- [GPT-5.6 Sol on OpenRouter](https://openrouter.ai/openai/gpt-5.6-sol)
