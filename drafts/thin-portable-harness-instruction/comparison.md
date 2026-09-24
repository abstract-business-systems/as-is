# Draft: Compare Thin Portable Harness Instructions

## Status and decision boundary

This is a draft comparison, not an adopted architecture, skill, agent contract, runtime configuration, task record, or production authorization.

The original exploration proposal is preserved verbatim at [source/proposal.md](source/proposal.md). Candidate A has a contextual record at [candidate-a-harness-backed.md](candidate-a-harness-backed.md) and its verbatim input at [source/thin-arm-harness-backed-agent.md](source/thin-arm-harness-backed-agent.md). Candidate B has a contextual record at [candidate-b-agents-isolated.md](candidate-b-agents-isolated.md) and its verbatim inputs at [source/thin-arm-agents-isolated.md](source/thin-arm-agents-isolated.md) and [source/thin-arm-agents-isolated-agent.md](source/thin-arm-agents-isolated-agent.md). The verbatim source retains its historical temporary-path recommendation internally; this grouped comparison is the discoverable package entry point. This comparison records the two tested thin-arm approaches, the current composition baseline, the portability need, and a possible productionization path without changing live behavior.

## Need

Some projects already provide a capable primary harness for model access, file operations, process execution, permissions, isolation, budgets, delegation, and validation, but do not use this repository's component-builder composition, skill catalog, linked-context resolver, or agent roster. A lightweight portable deployment should offer useful model guidance without requiring those repository-specific records and tools to be installed.

The portability question is not whether a prompt can enforce permissions, budgets, isolation, delegation, validation, recovery, or completion. Those properties remain the responsibility of the host harness. The question is whether a small instruction can guide useful, bounded work when the host already supplies the enforceable controls.

## Current composition baseline

The current composition combines a component-builder agent contract, the repository's explicit skill manifest, repository-local `AGENTS.md` guidance, architecture and task records, custom tools, and the existing launcher and control-plane machinery. It is the baseline for comparison, not a proposed replacement.

For the valid large-preset parallel-child benchmark, the current composition completed 2/2 runs, passed hidden acceptance in 2/2 runs, admitted all three initial children in parallel in 2/2 runs, measured USD 1.38048350 total, used 3,093,403 measured tokens, and averaged 264.663 seconds per run.

## Thin candidate A: harness-backed thin instruction

Candidate A is a compact portable instruction supplied through a thin benchmark agent definition with `skills: []`. It directs the model to understand the outcome, inspect relevant context, make the smallest in-scope change, use bounded parallel children when required, review and integrate scoped work, validate the result, and report evidence, uncertainty, and residual risk.

Candidate A retained the same declared tools and repository worktree context as the current comparison. It could see the repository root `AGENTS.md`, discover existing skills and agents through the filesystem, and use `resolve_component_context` if it chose to do so. Its implementation delegation used the external parallel launcher through `bash`; the task did not use `call_subagent` for implementation.

Candidate A completed 2/2 valid runs, passed hidden acceptance in 2/2 runs, admitted all three initial children in parallel in 2/2 runs, measured USD 0.72190010 total, used 1,312,110 measured tokens, and averaged 195.429 seconds per run.

Against the current baseline, Candidate A was approximately 47.7% cheaper, 26.2% faster, and 57.6% lower in measured tokens. It matched the baseline on the observed completion and hidden-acceptance outcomes in this small sample.

Candidate A demonstrates that a short instruction can work effectively when the repository and architecture-specific support remain available. It does not establish portability to a harness without those resources.

## Thin candidate B: AGENTS-only isolated thin arm

Candidate B is a stronger portability candidate. Its behavioral instruction is supplied through a standalone temporary repository's root `AGENTS.md`, while its neutral launcher metadata supplies only the minimal parent tool surface:

```text
read, ls, find, bash, edit, write, call_subagent
```

Candidate B has no skills manifest, no `resolve_component_context`, no `grep`, no web tools, no access to the original repository's `skills/` or `agents/` directories, and no existing project agent definitions. A sandbox enforced the standalone filesystem boundary. The explicitly approved `call_subagent` exception was available for read-only consultation but was not invoked in either valid run. Editable delegation still used the external parallel launcher through `bash`.

Candidate B completed 2/2 valid runs, passed hidden acceptance in 2/2 runs, admitted all three initial children in parallel in 2/2 runs, measured USD 1.05501610 total, used 2,182,300 measured tokens, and averaged 223.718 seconds per run. One run used the single permitted child retry; the other did not.

Against the current baseline, Candidate B was approximately 23.6% cheaper, 15.5% faster, and 29.5% lower in measured tokens. It matched the observed completion and hidden-acceptance outcomes in this small sample while operating without the repository-specific context and resolver.

Against Candidate A, Candidate B was approximately 46.1% more expensive, 14.5% slower, and 66.3% higher in measured tokens. The stronger isolation therefore reduced the efficiency advantage without producing an observed correctness or completion loss in the two valid runs.

## Observed comparison

| Arm | Context and tools | Valid completion | Hidden acceptance | Initial parallel admission | Mean cost | Mean elapsed | Mean tokens |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Current composition | Full component-builder composition, skills, repository context, resolver, and current tools | 2/2 | 2/2 | 2/2 | USD 0.69024175 | 264.663 s | 1,546,701.5 |
| Candidate A: harness-backed thin | Thin instruction, `skills: []`, but full repository context and resolver remained discoverable | 2/2 | 2/2 | 2/2 | USD 0.36095005 | 195.429 s | 656,055 |
| Candidate B: AGENTS-only isolated | Standalone `AGENTS.md`, minimal tools, no project skills, agents, or resolver | 2/2 | 2/2 | 2/2 | USD 0.52750805 | 223.718 s | 1,091,150 |

The evidence is bounded to one synthetic incident-report task family, one large model preset, two valid runs per candidate, and a fixed current baseline. It does not establish general equivalence across models, projects, task sizes, recovery-heavy work, or high-risk operations.

## Thin-arm capabilities

The thin arm is a behavioral instruction plus a host-provided tool surface, not a skill catalog or replacement architecture.

It can inspect files, search and navigate with the tools that are actually admitted, edit and write bounded files, run tests and other shell commands through `bash`, use Git within the permitted workspace, report blockers and evidence, and use the external launcher for bounded implementation children when the harness supplies that launcher.

It can reason about `as-is.md`, task, contract, and backlog files when those files are present and the `AGENTS.md` or task explains their role. It does not inherently provide the current as-is record lifecycle, component ownership protocol, task-record protocol, changelog procedure, or linked-context mediation.

It can author Mermaid source text with `edit`, `write`, or `bash` if a task requests a diagram. Candidate B does not have the specialized diagram-design skill or the `render_mermaid_batch` tool, so it cannot rely on the repository's dedicated Mermaid design procedure or render-and-link validation. A productionized portable profile would need either a host-provided renderer contract or an explicit statement that diagram syntax is authored without repository-specific rendering guarantees.

It can consult a read-only worker only through the explicitly admitted `call_subagent` exception when the host supplies compatible canonical worker roles. That tool is not a replacement for editable child delegation; implementation children require a host-provided external launcher or equivalent capability.

It cannot enforce its own permission, budget, isolation, delegation, recovery, or completion guarantees. The primary harness must enforce those properties and provide truthful evidence to the model.

## Productionization alternatives

### Alternative A: publish Candidate A as a portable instruction profile

Provide the thin instruction as an optional entry point for projects that retain a capable repository context and custom tools. This is the smallest productionization path, but it does not solve deployment to harnesses without those resources.

### Alternative B: publish Candidate B as a minimal portable profile

Provide a root `AGENTS.md` instruction, a documented minimal core tool contract, and host integration requirements for bounded delegation, validation, and isolation. This best matches the lightweight portable deployment need, but requires explicit host capability documentation and gives up repository-specific convenience and procedural coverage.

### Alternative C: publish both profiles with a host capability declaration

Use Candidate A where the host exposes repository-style context and tools, and Candidate B where it exposes only the portable core contract. Select the profile from a host capability declaration rather than model inference. This preserves the two observed operating points but creates a small compatibility surface to maintain.

### Alternative D: retain the current composition and add a portable front door

Keep current roles, skills, records, and tools authoritative while adding a thin front door that routes to them when they are present and falls back to the portable contract when they are absent. This may reduce migration risk but risks duplicating behavioral guidance and blurring precedence.

## Proposed productionization boundaries

Any later productionization should keep the following outside the thin instruction and inside the host or a separately adopted contract:

- permission and tool admission;
- filesystem and process isolation;
- wall-clock, token, and cost budgets;
- child count, nesting, retry, and cancellation controls;
- hidden-test and secret custody;
- validation execution and evidence capture;
- task state, recovery state, and semantic completion authority;
- diagram rendering or other specialized validation services.

The portable instruction should describe how to use those capabilities when present and how to stop when they are absent. It should not simulate them in prose.

## Proposed next decision

A human owner should choose whether to productionize Candidate A, Candidate B, both through a host capability profile, or neither. If Candidate B is selected, the next design must define the portable host contract, the minimum required tools, supported delegation primitive, validation evidence shape, diagram capability status, and unsupported-host behavior before any live agent or skill is changed.

## Evidence references

The verbatim source proposal is [source/proposal.md](source/proposal.md). The verbatim benchmark inputs are [source/thin-arm-harness-backed-agent.md](source/thin-arm-harness-backed-agent.md), [source/thin-arm-agents-isolated.md](source/thin-arm-agents-isolated.md), and [source/thin-arm-agents-isolated-agent.md](source/thin-arm-agents-isolated-agent.md). Their semantic records are [candidate-a-harness-backed.md](candidate-a-harness-backed.md) and [candidate-b-agents-isolated.md](candidate-b-agents-isolated.md). Benchmark summaries and raw results remain preserved in temporary evidence files referenced by the working checkpoint, including `/tmp/thin-portable-parallel-child-benchmark-summary-2026-09-07.md` and `/tmp/thin-agents-isolated-followup-summary-2026-09-07.md`.

## Residual risk

The isolated candidate was tested in a disposable local sandbox with provider-backed execution, not across unrelated harness implementations. The measured cost and latency differences are usage estimates from provider-reported events and are sensitive to model scheduling, retries, context loading, and task realization. No live architecture change is authorized by this draft.
