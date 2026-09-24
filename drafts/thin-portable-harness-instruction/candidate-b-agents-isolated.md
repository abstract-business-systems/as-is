# Thin Candidate B: AGENTS-Only Isolated Instruction

## Status

This is a preserved benchmark candidate, not an adopted agent, skill, host contract, or production profile.

## Semantic role

Candidate B tests the stronger portability claim: a small root `AGENTS.md` instruction can guide useful bounded implementation when the host does not expose this repository's skills, agent roster, linked-context resolver, or specialized repository tools.

## Portability posture

Candidate B is designed for a project that already supplies a primary harness for model execution, file mutation, shell execution, process control, isolation, budgets, delegation, and validation, but does not share this repository's architecture records or custom capability catalog.

## Host context and capabilities

The parent ran in a standalone temporary Git repository with the Candidate B instruction at the repository root `AGENTS.md`. The original repository's `skills/` and `agents/` directories were not mounted. A sandbox enforced the filesystem boundary.

The neutral launcher metadata admitted only `read`, `ls`, `find`, `bash`, `edit`, `write`, and the explicitly approved read-only `call_subagent` exception. `resolve_component_context`, `grep`, web tools, and repository skills were absent. The `call_subagent` exception was not invoked in either valid run.

The external parallel launcher remained available through `bash` as fixed harness infrastructure. It supplied the editable child processes, child worktrees, budgets, commit return values, and registry evidence required by the benchmark. The launcher is not an existing project agent or skill dependency.

## Behavioral intent

The root instruction tells the model to understand the requested outcome, inspect only relevant context, make the smallest correct in-scope changes, use the disposable parallel child launcher when implementation delegation is required, review and integrate scoped work, validate the result, report evidence and residual risk, and avoid inventing authority, capabilities, completion, or recovery state.

## What this candidate demonstrates

Candidate B demonstrates that the task can be completed without the repository's existing skill catalog, agent roster, linked-context resolver, or specialized tool surface in this bounded scenario. It tests a portable operating bundle rather than only a shorter prompt.

## Benchmark observation

Candidate B completed 2/2 valid large-preset runs, passed hidden acceptance in 2/2 runs, admitted all three initial children in parallel in 2/2 runs, measured USD 1.05501610 total, averaged USD 0.52750805 per run, averaged 223.718 seconds, and used 2,182,300 measured tokens. One run used the single permitted child retry.

Relative to the fixed current baseline, Candidate B was approximately 23.6% cheaper, 15.5% faster, and 29.5% lower in measured tokens. Relative to Candidate A, it was approximately 46.1% more expensive, 14.5% slower, and 66.3% higher in measured tokens. The sample is small and does not establish general equivalence.

## Capability boundaries

Candidate B can inspect, edit, write, run shell commands and tests, use Git within the permitted workspace, report blockers and evidence, and invoke the external launcher when the host supplies it. It can read `as-is.md` or other project records if the project supplies them, but it does not provide the current as-is lifecycle, component-task protocol, changelog procedure, or linked-context mediation.

Candidate B can author Mermaid source text with basic editing and shell tools, but it does not have the diagram-design skill or `render_mermaid_batch`. It therefore cannot claim repository-style render or link-preservation validation unless the host separately supplies that capability.

Candidate B cannot enforce permissions, budgets, isolation, delegation limits, recovery, validation, or semantic completion through instruction alone. Those controls remain host responsibilities. If an optional capability is absent, the portable profile should stop or report the limitation rather than simulate the capability in prose.

## Verbatim sources

The exact root instruction is preserved unchanged at [source/thin-arm-agents-isolated.md](source/thin-arm-agents-isolated.md). The exact neutral launcher metadata is preserved unchanged at [source/thin-arm-agents-isolated-agent.md](source/thin-arm-agents-isolated-agent.md).
