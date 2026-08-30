# wordstats - as-is

Word-count library and `count` CLI for the benchmark seed project.

## Purpose

Count word frequencies in a UTF-8 text file and report them as a JSON object with keys sorted alphabetically. It is the only product component of the seed project; all other directories support it.

## Boundary

Owns `src/wordstats/` (package code) and its focused unit tests under `tests/`. Owner evidence: `records/owners/core-utility.md` (change scope: component). Does not own `checks/`, `docs/`, `sample-data/`, or the root records.

## Design

- `counter.py` — `count_words(text)`: lowercases tokens, strips punctuation from token edges, ignores punctuation-only tokens, returns a counts mapping. `most_frequent(counts, limit)`: returns at most `limit` highest-count words, ranking by descending count with equal counts ranked alphabetically (ties near the cutoff fill alphabetically first).
- `cli.py` — `wordstats count <path>`: prints `json.dumps(counts, indent=2, sort_keys=True)` to stdout; exits 0 on success. Optional `--top N` (argparse type `positive_int`, non-integers and `N <= 0` rejected with exit 2 and a clear message) prints only the `N` most frequent words using the same sorted-JSON format; without `--top` the full-frequency output is unchanged. Decision and tie-breaking rationale: `docs/design-notes.md`.
- Public contract (from the owner record): lowercase tokens, edge punctuation stripped, punctuation-only tokens ignored, counts returned as a mapping, CLI output is JSON with sorted keys.

## Relationships

- Consumed by `checks/validate.sh` through the CLI smoke check (`sample-data/words.txt` → `checks/expected-count.json`).
- User-visible decisions are recorded in `docs/design-notes.md` before bounded changes.