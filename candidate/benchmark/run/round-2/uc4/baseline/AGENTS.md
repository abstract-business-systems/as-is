# wordstats agent instructions

- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.
- Run `bash checks/validate.sh` before reporting completed work; it exits nonzero on the first failed check.
- Resolve component and artifact ownership through `records/ownership-map.md`; an unresolved owner or scope is a stop-for-direction, not a guess.
- Record design decisions in `docs/design-notes.md` before bounded changes that alter user-visible behavior.
