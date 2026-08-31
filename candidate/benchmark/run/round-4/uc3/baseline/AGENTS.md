# wordstats benchmark fixture — agent instructions

- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.
- Resolve change scope through `records/ownership-map.md` before editing; an area with no resolvable owner requires stop-for-direction rather than guessing.
- Record a design note in `docs/design-notes.md` before any bounded change that alters user-visible behavior.
- Run `bash checks/validate.sh` (deterministic: compile, unit tests, CLI smoke check) and record its result before reporting completion of any change.