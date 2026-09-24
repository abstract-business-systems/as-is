# Thin Candidate A: Harness-Backed Instruction

## Status

This is a preserved benchmark candidate, not an adopted agent, skill, host contract, or production profile.

## Semantic role

Candidate A tests whether a compact behavioral instruction can perform the parallel incident-report task while the surrounding repository and harness continue to provide architecture-specific context and tools. It is a thin instruction surface over a relatively rich host environment, not a fully portable deployment.

## Portability posture

Candidate A is portable only to harnesses that already expose repository-style context, local `AGENTS.md` guidance, the relevant agent and skill files, the linked-context resolver, and the external child launcher. It reduces the instruction surface but does not remove those environmental dependencies.

## Host context and capabilities

The parent ran in a normal repository worktree. It had `skills: []` in its agent metadata, but the repository root guidance, existing skills, existing agents, and architecture-specific files remained discoverable. Its declared tools were `read`, `grep`, `find`, `ls`, `bash`, `edit`, `write`, `call_subagent`, and `resolve_component_context`.

The external parallel launcher supplied editable child processes, detached child worktrees, child budgets, commit return values, and registry evidence. The parent was instructed to use that launcher for implementation delegation rather than using `call_subagent` for implementation.

## Behavioral intent

The instruction tells the model to understand the outcome, inspect relevant context, make the smallest correct in-scope changes, use bounded parallel children when required, review and integrate scoped work, validate the result, and report evidence, uncertainty, and residual risk. It explicitly rejects invented authority, capabilities, completion, and recovery state.

## What this candidate demonstrates

Candidate A demonstrates that a concise instruction can guide effective work when the host preserves the current repository’s context and specialized capabilities. It does not demonstrate that the instruction can operate in a harness without those capabilities.

## Benchmark observation

Candidate A completed 2/2 valid large-preset runs, passed hidden acceptance in 2/2 runs, admitted all three initial children in parallel in 2/2 runs, measured USD 0.72190010 total, averaged USD 0.36095005 per run, averaged 195.429 seconds, and used 1,312,110 measured tokens.

Relative to the fixed current baseline, Candidate A was approximately 47.7% cheaper, 26.2% faster, and 57.6% lower in measured tokens. The sample is small and does not establish general equivalence.

## Capability boundaries

Candidate A can use the repository's existing as-is records, linked-context resolver, skills, agent contracts, and specialized host tools when the host supplies them. It can author Mermaid source and may use repository-provided diagram tooling if that tooling is separately admitted. Its apparent portability benefit comes from reduced instruction setup, not from independence from repository architecture.

## Verbatim source

The exact benchmark input is preserved unchanged at [source/thin-arm-harness-backed-agent.md](source/thin-arm-harness-backed-agent.md).
