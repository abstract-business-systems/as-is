# Agent Instructions

- Prefer declarative language for role contracts, boundaries, authority, and
  handoffs. State what must be true rather than narrating incidental behavior.
- Prefer deterministic scripts for repeatable discovery, validation, lifecycle,
  budgeting, and cleanup. Keep probabilistic model behavior bounded by explicit
  inputs and observable checks.
- Keep role definitions focused on responsibility and delegation. Move reusable
  flow logic into skills instead of duplicating it in agent prompts.
- Preserve durable repository records as the authority; do not rely on private
  runtime state or conversation history.
