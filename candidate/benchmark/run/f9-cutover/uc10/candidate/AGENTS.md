# Project Instructions

Follow the project's design notes and ownership records. The durable component record is the canonical architecture context for its component; active task state belongs in the component's JSON task object and configured Markdown narrative.

- `records/ownership-map.md` resolves owners and change scope. Stop for direction when a requested artifact has no owner and the request does not explicitly authorize it.
- `src/wordstats/` is the core-utility component; preserve its public lowercase-token counting contract and sorted JSON CLI output.
- `docs/design-notes.md` is the design-notes artifact owner; record user-visible behavior decisions before implementation.
- `CHANGELOG.md` is the project's durable history location; record validated feature results there.
- Keep changes bounded, preserve unrelated seed files, and do not add secrets or external effects.
- Validate changed behavior with `bash checks/validate.sh` before reporting status and retain the exact output and exit code.
