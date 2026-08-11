# as-is Repository Instructions

Follow [Design Principles](docs/design-principles.md). Repository-authored files and directories use lowercase kebab-case unless a host requires an exact filename. Markdown files should not use soft-wrapped prose; keep each paragraph or list item on one logical line unless a wrap is justified by readability or formatting constraints, while preserving intentional hard breaks and formatting-sensitive blocks.

The as-is task-record, delegation, recovery, and completion mechanics are governed by [component-task-record-protocol.md](docs/component-task-record-protocol.md) and surfaced as reusable procedures under [skills](skills/). This file holds only the generic developmental guardrails that apply to any agent working in this repository.

- The relevant `as-is.md` record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.

## Guard Clauses

- Do not amend, push, create pull requests, change branches, or alter remotes unless the user explicitly requests it in the current turn.
- Do not put credentials, tokens, passwords, or other secrets in tracked files, generated artifacts, prompts, or durable agent context.
- Do not modify files outside the repository or contact external services without explicit user consent.
- Before destructive removal, determine whether the target is tracked or has untracked or ignored contents. Prefer reversible, tracked removal for tracked paths.
- Before removing an artifact as unneeded, assess its current consumers, recovery or audit value, ownership, and cost to recreate. Preserve or record what remains necessary; remove only the identified unnecessary scope.
- Git history does not preserve uncommitted content. Before removing an uncommitted artifact, preserve its necessary facts or obtain an appropriately scoped evidence commit; do not imply byte-for-byte recovery when none exists.
- Keep changes scoped and surgical. If evidence requires work beyond the stated scope, stop and request direction rather than expanding autonomously.
- A child component owns and may update only its own component files and task record. It must not edit a parent component's records, budget allocation, status, or other parent-owned files. Record a bounded request or blocker in the child record and let the parent reconcile and authorize any parent-level change. This boundary also applies during budget exhaustion and recovery.
- When evidence supports departing from an applicable non-fixed instruction, present the proposed deviation, alternatives, reasons, and material effects to the user or delegating agent. Do not weaken a higher-authority constraint.
- Before introducing a material abstraction, configuration surface, artifact, or execution path, inspect the applicable local pattern and prefer the smallest reuse that satisfies the need.
- Prefer the smallest working, understandable solution that satisfies the acceptance conditions. Do not introduce sophisticated or enterprise-grade interfaces, abstractions, configuration, or operational machinery unless the requirement or evidence demonstrates that they are necessary. If a more complex design is proposed, state the concrete requirement, evidence, and material trade-off that justify it. This does not weaken safety, security, reliability, recovery, validation, or authority constraints.
- Validate a changed behavior with the smallest relevant existing automation or check before reporting completion. State the validation performed and any residual risk.
- Keep human attention focused on architecture, component boundaries, and interactions. When an applicable agent instruction does not prescribe a detail, the assigned agent may choose the smallest reasonable implementation that preserves the stated purpose, authority boundaries, safety constraints, and acceptance conditions. Record material assumptions and escalate genuine ambiguity; discretion is not permission to expand scope or weaken controls.

## Agents And Skills

- Agents are the authority-bearing composition layer: an agent role combines reusable skills with permissions, tools, model settings, and bounded responsibility. Agents utilize skills; skills do not, by design, select, authorize, start, or delegate agents. An authority-bearing agent or orchestrator may invoke a mechanical adapter procedure exposed by a skill; that invocation does not transfer authority into the skill.
- Skills remain focused, reusable procedures and may be composed by an agent or workflow. A skill may describe a handoff or subagent contract as an input or output, but authority to select, launch, observe, recover, or cancel a subagent belongs to the agent/orchestrator layer.
- Subagents are generalized independent workers. They may support any bounded flow requiring an agent boundary—implementation, research, review, planning, recovery, or another approved workflow—not only job execution.
- Delegate independent, bounded work only when it has a clear input, expected output, and verification boundary. Preserve the result in repository context before dependent work proceeds. Delegation, scoping, completion gates, and recovery mechanics are specified in [component-task-record-protocol.md](docs/component-task-record-protocol.md).
- Use an independent reviewer or validator when risk, authority, or change breadth warrants it. The implementing agent's report is evidence, not the sole completion gate.
- Use the repository-local skills in [skills](skills/) for setup, naming, and repository knowledge organization. Adopt external or installed skills only when their assumptions, tools, and output contracts fit this repository; do not copy project-specific operational skills as generic defaults.
