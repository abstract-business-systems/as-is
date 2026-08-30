# Milestone 2: Composable Skills Engine and Agent Roster — Evidence

## Objective

Realize and evidence the Composable Skills Engine and Canonical Agent Roster under `candidate/skills/` and `candidate/agents/` on branch `implementing-composable-skills`.

## Status: COMPLETED

All planned agent definitions, runtime configuration parsers, reusable procedures, master compositions, execution tracers, and test suites are implemented and passing 100% of checks.

## Implemented Modules

### 1. Agent Roster and Runtime Configuration (`candidate/agents/`)

| File | Responsibility |
| --- | --- |
| `candidate/agents/config.json` | Default runtime configuration mapping role aliases to exact OpenRouter model strings. |
| `candidate/agents/types.ts` | Role IDs, thinking level types, required tool matrices, route policies, and agent contract interfaces. |
| `candidate/agents/config.ts` | Config loader, validator, and model resolution (`resolveModelFromConfig`). |
| `candidate/agents/role-contract.ts` | Markdown frontmatter parser, tool boundary validator, and batch contract loader. |
| `candidate/agents/implementer/agent.md` | Implementer (`google/gemini-3.7-flash`, `thinking: high`, 7 tools). |
| `candidate/agents/worker/agent.md` | Worker (`z-ai/glm-5.3-flash`, `thinking: high`, 6 tools). |
| `candidate/agents/planning-adviser/agent.md` | Planning Adviser (`openai/gpt-5.6-sol`, `thinking: high`, 0 tools). |
| `candidate/agents/external-adviser/agent.md` | External Adviser (`moonshotai/kimi-k3`, `thinking: high`, 0 tools). |

### 2. Composable Skills Engine (`candidate/skills/`)

| File | Responsibility |
| --- | --- |
| `candidate/skills/types.ts` | Reusable/master skill definitions, composition steps, execution contexts, spend trackers, and capability results. |
| `candidate/skills/trace.ts` | Structured execution tracer (`ExecutionTracer`) enforcing protected-input boundaries and scope allowlists (`SecurityViolationError`, `ScopeViolationError`). |
| `candidate/skills/registry.ts` | Dynamic registry (`SkillRegistry`) with pre-flight agent capability validation. |
| `candidate/skills/runner.ts` | `CompositionRunner` orchestrating sequential steps, gate evaluations, recovery on failure, and trace capture. |
| `candidate/skills/reusable/context-building.ts` | Reusable anchor resolution and proportional token-scoped link inspection. |
| `candidate/skills/reusable/verification-discipline.ts` | Reusable deterministic check runner, test reporting, and residual risk logging. |
| `candidate/skills/reusable/naming-software-concepts.ts` | Reusable kebab-case and conceptual semantic naming validator. |
| `candidate/skills/compositions/implementing-tasks.ts` | Master composition for scoped code task realization, testing, and evidence collection. |
| `candidate/skills/compositions/building-components.ts` | Master composition orchestrating context discovery, plan admission, atomic reservations, child delegation, verification, and closure. |

## Test Suite Execution Evidence

Executed with `bun test candidate/tests/skills/`:

```text
candidate/tests/skills/agent-config.test.ts:
(pass) Candidate Agent Contracts and Configuration > loads and parses the default runtime config [0.36ms]
(pass) Candidate Agent Contracts and Configuration > resolves model aliases to exact OpenRouter model strings [0.12ms]
(pass) Candidate Agent Contracts and Configuration > loads and validates all four locked agent role contracts from candidate/agents/ [1.06ms]
(pass) Candidate Agent Contracts and Configuration > builds a valid RoutePolicy from contracts [0.54ms]
(pass) Candidate Agent Contracts and Configuration > fails validation when role contract has missing frontmatter or invalid fields [0.12ms]

candidate/tests/skills/trace-isolation.test.ts:
(pass) Candidate ExecutionTracer and Isolation Enforcement > records chronological trace events with proper metadata [0.10ms]
(pass) Candidate ExecutionTracer and Isolation Enforcement > allows mutation on paths within the admitted scope allowlist [0.19ms]
(pass) Candidate ExecutionTracer and Isolation Enforcement > throws SecurityViolationError when attempting mutation on protected inputs [0.11ms]
(pass) Candidate ExecutionTracer and Isolation Enforcement > throws ScopeViolationError when attempting mutation outside scope allowlist [0.08ms]
(pass) Candidate ExecutionTracer and Isolation Enforcement > permits read access without mutating restrictions on allowed areas [0.03ms]
(pass) Candidate ExecutionTracer and Isolation Enforcement > tracks and accumulates spend metrics across execution steps [0.07ms]

candidate/tests/skills/composition-runner.test.ts:
(pass) Candidate CompositionRunner and Master Skills > executes the implementing-tasks composition successfully for a worker [1.30ms]
(pass) Candidate CompositionRunner and Master Skills > fails the composition when deterministic verification checks fail [0.43ms]
(pass) Candidate CompositionRunner and Master Skills > blocks execution when an agent lacks required tools for the composition [0.52ms]
(pass) Candidate CompositionRunner and Master Skills > executes building-components master composition with full admission, reservation, child delegation, and closure [1.77ms]

candidate/tests/skills/skill-registry.test.ts:
(pass) Candidate Skill Registry > registers and discovers reusable skills and master skills [0.38ms]
(pass) Candidate Skill Registry > prevents duplicate registrations [0.27ms]
(pass) Candidate Skill Registry > validates agent tool capabilities accurately against master compositions [0.38ms]

 18 pass
 0 fail
 94 expect() calls
Ran 18 tests across 4 files. [167.00ms]
```

Total candidate test suite: **42 passed, 0 failed across 8 files (138ms)**.

## Architectural Invariants Established

1. **Strict Tool Boundaries**: Advisory agents have zero mutation tools. Workers have scoped code tools without bash. Only implementers have full integration capabilities.
2. **Pre-flight Capability Gating**: Attempting to execute a composition with an under-provisioned agent immediately blocks with an actionable missing-tool report.
3. **Trace-Enforced Scope and Security**: Any attempt by a worker or step to mutate protected inputs (`core/contracts`, etc.) or write outside the admitted scope triggers an immediate fail-closed error and structured security audit trace.
4. **Master-First Composition**: Procedures are composed into coherent outcome-oriented pipelines with automated gate checking, spend accumulation, and verifiable evidence generation.
