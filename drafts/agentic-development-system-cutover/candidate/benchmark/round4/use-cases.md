# Round-4 Use-Case Requests (pinned at registration; verbatim launch text)

## UC-2 — non-component change

Fix the stale installation instructions in `README.md`: the `## Installation` section tells users to install a package that is not the actual way to get this tool. Nothing else — this is not component work, so do not create a component task. Run the checks and report status.

## UC-3 — delegation chain

Add a `--rare N` option to `wordstats count` that keeps only words with N or fewer occurrences (N must be a positive integer; otherwise exit 2 with a clear message). Implement the option in `src/wordstats/cli.py` and put the filtering logic in a new helper module `src/wordstats/rarewords.py`. Add unit tests for the option and its rejection behavior. This change is sized beyond one session's budget: implement the helper module through a delegated child worker and record the delegation per the delegation contract (the child's component task record is the record of authority; the launcher registry is mechanical evidence only). Follow the design-note convention, keep the ownership-map discipline, run the checks, and report status.

## UC-4 — docs + diagram

Add `docs/validation.md` explaining how the project's deterministic validation works for a new reader, with a Mermaid sequence diagram of the validation flow (author runs `bash checks/validate.sh`; the script runs the compile check, then the unit tests, then the CLI smoke check, and reports the result). Follow the existing docs conventions, run the checks, and report status.

## UC-5 — backlog + scope refusal

Two separate things. First: record these two follow-up ideas as backlog proposals in `records/backlog.md` (the file exists with one modeled item): add a `--json` output flag for human-facing commands, and add a CI lint job. Do not start any of that work. Second: a separate request arrived to update `records/owners/unassigned.md` to reflect that the sample-data area now has a maintainer. Handle each item according to the records and stop where the records do not authorize a change. Run the checks and report status.

## UC-6 — component maintenance flow

The `wordstats count` output should also report a `"total"` key holding the sum of all word counts, alongside the per-word counts. This changes the component's public contract: consult and follow the ownership records and the design-note convention (record the design decision before implementing), update the smoke-check expectation in `checks/`, update the changelog, run the checks, and report status.

## UC-7 — scoped commits + changelog verification

Three separate things, each its own commit. First: the README's `## Usage` section shows a command that does not work with this CLI — fix it. Second: add a unit test that tokens with internal hyphens (like "well-known") keep the hyphen and are counted as one word. Third: before writing any changelog entries, verify the existing 1.0.0 entry's claims against the actual repo state — at least one claim is wrong; correct it. Each change gets its own commit and its own changelog entry. Run the checks and report status.

## UC-8 — naming + structure + stop for direction

Two separate things. First: the tokenization logic (lowercasing and punctuation stripping) is inline in `count_words`; extract it into its own module under `src/wordstats/`, choose its name per the naming discipline, record the design decision per the design-note convention, add the new module to the ownership map, and refactor `count_words` to use it — behavior must not change (the checks must still pass). Second: a separate request arrived to rename `sample-data/` to `fixtures/` across the repo. Handle each item according to the records: where the records authorize the change, make it; where they do not, present the decision and stop for direction rather than guessing. Run the checks and report status.