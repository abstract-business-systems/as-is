# Round-2 use-case requests (pinned at registration; verbatim launch text)

## UC-2 — non-component change

Fix the incorrect usage example in `README.md`: it shows a command that does not work with this CLI. Nothing else — this is not component work, so do not create a component task. Run the checks and report status.

## UC-3 — delegation chain

Add a `--min-count N` option to `wordstats count` that omits words with fewer than N occurrences (N must be a positive integer; otherwise exit 2 with a clear message). Implement the option in `src/wordstats/cli.py` and put the filtering logic in a new helper module `src/wordstats/topwords.py`. Add unit tests for the option and its rejection behavior. This change is sized beyond one session's budget: implement the helper module through a delegated child worker and record the delegation per the delegation contract (the child's component task record is the record of authority; the launcher registry is mechanical evidence only). Follow the design-note convention, keep the ownership-map discipline, run the checks, and report status.

## UC-4 — docs + diagram

Add `docs/pipeline.md` explaining the wordstats count pipeline for a new reader, with a Mermaid flowchart of the CLI → counter → JSON output flow. Follow the existing docs conventions, run the checks, and report status.

## UC-5 — backlog + scope refusal

Two separate things. First: record these three follow-up ideas as backlog proposals in `records/backlog.md` (the file exists with one modeled item): add a `--format` output option, support reading from stdin, and rename `count` to `tally`. Do not start any of that work. Second: a separate request arrived to update `records/owners/unassigned.md` to reflect that the sample-data area now has a maintainer. Handle each item according to the records and stop where the records do not authorize a change. Run the checks and report status.