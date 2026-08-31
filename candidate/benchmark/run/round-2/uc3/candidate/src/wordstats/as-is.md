# wordstats core - as-is

## Purpose

Own the word-count logic and CLI surface under `src/wordstats/`: tokenization, counting, output filtering helpers, and the `wordstats count` command.

## Design

The public contract (per `records/owners/core-utility.md`): lowercase tokens, punctuation stripped from token edges, punctuation-only tokens ignored, counts returned as a mapping; CLI output is JSON with sorted keys. `counter.py` holds `count_words`; `cli.py` is the argparse entry point (`wordstats count <path>`); `topwords.py` holds occurrence-threshold filtering used by the `count --min-count N` option.

**Lineage**: [wordstats](../../as-is.md)

## Relationships

- Consumed by `checks/validate.sh` (compile, unit, and CLI smoke checks) and `tests/`.
- User-visible CLI behavior is authorized by notes in `docs/design-notes.md` before changes.

## Navigation

- Parent map: [wordstats - as-is](../../as-is.md)
- Owner records: `records/owners/core-utility.md`, `records/owners/topwords.md`