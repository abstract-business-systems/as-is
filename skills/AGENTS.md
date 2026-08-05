# Skill Instructions

- Prefer declarative language for procedures, contracts, authority, inputs,
  outputs, and acceptance conditions.
- Prefer deterministic scripts for repeatable policy enforcement, discovery,
  validation, task lifecycle, and cleanup.
- Keep skills composable and focused. Put reusable flow logic in skills rather
  than duplicating it across agent role prompts.
- Skills are never authority-bearing callers: they do not call, launch, or
  delegate to agents. Agents compose and invoke skills, retain launch and
  approval authority, and may use subagents for bounded implementation,
  research, review, planning, recovery, or other flows beyond jobs.
- Preserve one authoritative home for current state and distinguish durable
  component context, transient tasks, backlog proposals, and private runtime
  state.
