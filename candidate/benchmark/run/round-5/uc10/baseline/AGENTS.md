# wordstats benchmark seed — agent-workflow configuration

This directory is a benchmark consumer working directory built on the pinned
wordstats seed. The seed ships no agent-workflow configuration by design; this
file and the as-is records below were added by the consumer during setup.

## Component records

- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.

## Working conventions

- Agent roles are declared under `agents/`; delegated child workers launch
  through the `spawning-pi-subagents` procedure.
- Machine task state lives in the local `task` object of a component's
  `as-is.json`; human task narrative lives in the sibling `tasks.md`; durable
  history goes in `changelog.md`.
- Design decisions that alter user-visible behavior are recorded in
  `docs/design-notes.md` before the bounded change.