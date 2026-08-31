# Backlog (mock project records)

Proposals only; selection and completion are governed by the project's planning procedure, not by this file. Newest last.

- Added: baseline setup. Proposal: keep the smoke-check input format stable until the CLI output contract is revisited.
- Added: CLI `--format` output option. Proposal: add a `--format` output option to the `count` CLI so callers can select the output format; coordinates with the stable smoke-check input format above and the JSON output contract in `records/owners/core-utility.md`. Not started; awaiting backlog-authority selection.
- Added: stdin input support. Proposal: support reading input text from stdin (for example when no path argument is given) instead of requiring a file path argument. Not started; awaiting backlog-authority selection.
- Added: rename `count` to `tally`. Proposal: rename the `count` CLI command to `tally`; touches the CLI surface and public contract owned by `records/owners/core-utility.md` and the smoke check in `checks/validate.sh`. Not started; awaiting backlog-authority selection.
