# AGENTS.md

- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.
- Resolve change scope through `records/ownership-map.md`; unknown or ambiguous areas have no owner record and require stopping for direction rather than guessing.
- Record user-visible behavior changes as design notes in `docs/design-notes.md` (one note per decision, newest last) before the bounded change.
- Validate every change with `bash checks/validate.sh`; it exits nonzero on the first failed check.