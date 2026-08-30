# wordstats-core - as-is

## Purpose

Own the word-count logic and its CLI surface (`src/wordstats/`): lowercase tokens, punctuation stripped from token edges, punctuation-only tokens ignored, counts returned as a mapping, and JSON output with alphabetically sorted keys.

## Design

**Lineage**: **wordstats** → **wordstats-core**

`counter.py` holds the pure counting logic (`count_words`); `cli.py` holds the argparse CLI (`wordstats count <path>`) and prints the mapping as 2-space-indented JSON with sorted keys. `__init__.py` exposes the package.

Public contract (see also `records/owners/core-utility.md`):

| Area | Contract |
| --- | --- |
| `count_words(text)` | Lowercased tokens; edge punctuation stripped; punctuation-only tokens ignored; returns a mapping. |
| `top_words(counts, n)` | Ranks by count descending, ties broken alphabetically; `ValueError` for non-positive `n`. |
| `wordstats count <path>` | Prints the counts mapping as JSON, keys sorted alphabetically, 2-space indent. |
| `wordstats count <path> --top N` | Prints only the `N` most frequent words, keys sorted alphabetically; non-positive or non-integer `N` rejected with exit code 2. |

## Relationships

- Consumed by `tests/test_counter.py` (unit tests) and `checks/validate.sh` (compile, unit, CLI smoke check against `checks/expected-count.json`).
- User-visible behavior is documented by design notes in `docs/design-notes.md`, owned by `records/owners/design-notes.md`.