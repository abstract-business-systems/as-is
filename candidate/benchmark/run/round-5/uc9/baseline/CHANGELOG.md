# Changelog

## 1.1.0 — count filters

- Added `wordstats count --rare N` keeping only words with N or fewer occurrences (logic in `src/wordstats/rarewords.py`).
- Added `wordstats count --top N` keeping only the N most frequent words, ties broken alphabetically (logic in `src/wordstats/topwords.py`).
- Both options validate N as a positive integer and exit 2 with a clear message otherwise.
- Introduced as-is component records (`as-is.md`, `src/wordstats/as-is.md`, `records/components/{rarewords,topwords}/`) and `AGENTS.md` canonical instruction.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).