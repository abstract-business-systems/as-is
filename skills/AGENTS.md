# Skill Instructions

- Prefer declarative language for procedures, contracts, authority, inputs,
  outputs, and acceptance conditions.
- Prefer deterministic scripts for repeatable policy enforcement, discovery,
  validation, task lifecycle, and cleanup.
- Keep skills composable and focused. Put reusable flow logic in skills rather
  than duplicating it across agent role prompts.
- Skills are not authority-bearing callers: they do not, by design, select,
  authorize, start, or delegate agents. An authority-bearing agent or
  orchestrator may invoke a mechanical adapter procedure exposed by a skill;
  that invocation does not transfer authority into the skill. Agents compose
  and invoke skills, retain launch and approval authority, and may use
  subagents for bounded implementation, research, review, planning, recovery,
  or other flows beyond jobs.
- Preserve one authoritative home for current state and distinguish durable
  component context, transient tasks, backlog proposals, and private runtime
  state.
- Use the reusable Mermaid diagram-design skill when a durable component record needs a visual context view; keep record prose authoritative.
