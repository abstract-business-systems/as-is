# Agent Instructions

- Prefer declarative language for role contracts, boundaries, authority, and
  handoffs. State what must be true rather than narrating incidental behavior.
- Prefer deterministic scripts for repeatable discovery, validation, lifecycle,
  budgeting, and cleanup. Keep probabilistic model behavior bounded by explicit
  inputs and observable checks.
- Keep role definitions focused on responsibility, authority, and delegation.
  Agents utilize reusable skills; skills do not, by design, select, authorize,
  start, or delegate agents. An authority-bearing agent or orchestrator may
  invoke a mechanical adapter procedure exposed by a skill without
  transferring authority into the skill. Move reusable flow logic into skills
  instead of duplicating it in agent prompts.
- Treat subagents as generalized bounded-flow workers: implementation, research,
  review, planning, and recovery are all valid uses, not only jobs.
- Preserve durable repository records as the authority; do not rely on private
  runtime state or conversation history.
