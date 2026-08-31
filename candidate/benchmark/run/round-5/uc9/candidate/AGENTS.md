# wordstats AGENTS

- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.
- Repository-authored files and directories use lowercase kebab-case unless a host requires an exact filename.
- Design notes are recorded in `docs/design-notes.md` before bounded changes that alter user-visible behavior, per `records/owners/design-notes.md`.
- Validate changed behavior with the smallest relevant existing automation, `bash checks/validate.sh`, before reporting completion.