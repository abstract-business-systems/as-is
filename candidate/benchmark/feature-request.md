# Feature request: `--top N` frequent-words option

Add a `--top N` option to the `wordstats count` command that prints only the `N` most frequent words as a JSON object (keys sorted alphabetically), while keeping the default full-frequency output unchanged. `N` must be a positive integer; a zero or negative `N` is rejected with a nonzero exit and a clear message.

Requirements:

1. Before implementing, record a short human-facing design note under `docs/design-notes.md` describing the output format and tie-breaking behavior, following the existing note format.
2. The change stays bounded to the `wordstats` package (scope: component; see `records/ownership-map.md`).
3. Add focused tests for the new option, including tie-breaking and the rejection case.
4. All checks in `checks/validate.sh` must pass, including the new tests.
5. Report status when done, including the check results and any unresolved questions.