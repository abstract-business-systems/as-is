# wordstats - as-is

## Purpose

The `wordstats` package owns the word-count library and its `count` CLI: lowercase tokens with punctuation stripped from token edges, punctuation-only tokens ignored, counts returned as a mapping, and CLI output as JSON with keys sorted alphabetically and 2-space indent.

## Design

The package splits the counting primitive from the CLI surface: `counter.py` provides `count_words(text)` (the pure counting contract owned by `records/owners/core-utility.md`), `cli.py` exposes the `wordstats count <path>` subcommand printing the JSON result. Shared selection logic for output shaping belongs in dedicated helper modules rather than the CLI body, keeping the CLI a thin adapter over the library contracts. Unit coverage lives under the project `tests/` directory.

## Relationships

- Owner record: `records/owners/core-utility.md` owns the word-count logic and CLI surface of this package.
- Design notes: user-visible behavior changes are recorded in `docs/design-notes.md` before the bounded change they authorize.

## Links

- `records/owners/core-utility.md` → `records/owners/core-utility.md` — owner record stating the public contract this package must preserve.
- `docs/design-notes.md` → `docs/design-notes.md` — design-note convention gating user-visible changes.