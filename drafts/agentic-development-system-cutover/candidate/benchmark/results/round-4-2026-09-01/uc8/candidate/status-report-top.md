All green. Here is the status report.

# Status report

## Setup performed (as-is-setup skill, whole-project mode)

The seed ships no agent-workflow configuration, so I ran the workflow's adoption procedure (`skills/as-is-setup`) against the working directory as an independent root:

- **Setup plan**: whole-project mode; target = this working directory; effective boundary = the working directory and descendants (excluded: `.as-is/`, `.pi/` runtime state; no parent/sibling path read or written). No instruction file existed, so `AGENTS.md` creation was planned and executed. Candidate decomposition: a **single component** (one ~40-line word-count utility with a shared owner record and one public contract); a CLI/library split was rejected as there is no independent change boundary. The benchmark request served as the reviewable approval; no materially different decomposition existed, so no stop was required at this gate.
- **Records created**: `as-is.md` (root record, title `# as-is - as-is`, lineage `**as-is**`, one flow-view diagram of the word-count pipeline, Relationships section mapping the owner records and validation gate) and `AGENTS.md` (contains the single canonical as-is instruction, exactly once).
- **Task-record protocol note**: the seed has no task-control consumer, so no `as-is.json` task pair was created; the benchmark harness acted as task authority. Recorded as an assumption, not a claim of protocol conformance.

## Files changed (all inside the working directory)

| File | Change |
| --- | --- |
| `as-is.md` | **new** — root architecture record (setup) |
| `AGENTS.md` | **new** — canonical as-is instruction (setup) |
| `src/wordstats/tokenize.py` | **new** — extracted `tokenize(text)` + `STRIP_CHARS` (item 1) |
| `src/wordstats/counter.py` | `count_words` refactored to consume `tokenize`; identical algorithm, order, and stripping set (item 1) |
| `records/ownership-map.md` | added row: `src/wordstats/tokenize.py` → `records/owners/core-utility.md`, scope component (item 1) |
| `docs/design-notes.md` | appended "Tokenization extraction" note (request, decision, options considered, bounded change authorized) (item 1) |
| `CHANGELOG.md` | added `## Unreleased` entry summarizing the refactor and the stopped rename |

Naming: `tokenize.py`/`tokenize(text)` chosen per the naming skill — narrowest responsibility-bearing term matching sibling lowercase module convention (`counter.py`, `cli.py`); alternatives `tokenizer.py` (noun form implies a stateful object) and `tokens.py` (implies a data container) rejected and recorded in the design note.

## Check results (verbatim, exit codes)

Baseline (before changes): all checks passed, `EXIT=0`. After changes:

```
compile: OK
test_counts_basic_words (test_counter.CountWordsTests.test_counts_basic_words) ... ok
test_empty_input (test_counter.CountWordsTests.test_empty_input) ... ok
test_ignores_punctuation_only_tokens (test_counter.CountWordsTests.test_ignores_punctuation_only_tokens) ... ok
test_strips_punctuation_and_lowercases (test_counter.CountWordsTests.test_strips_punctuation_and_lowercases) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.000s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
VALIDATE_EXIT=0
```

Setup validation: `git diff --check` exit 0 (note: the working copy has no commits, so all files are untracked and this check is correspondingly weak); `AGENTS.md` contains the canonical instruction exactly once (`grep -c` = 1); `as-is.md` links resolve to existing paths (`records/ownership-map.md`, `docs/design-notes.md`); `git status --porcelain` confirms every added path is inside the boundary and no parent/sibling path was touched.

## Bounded-scope resolution

- **Item 1 (tokenization extraction)** — authorized by the records: `core-utility.md` owns all of `src/wordstats/` (component scope), the design-note owner record covers `docs/design-notes.md`, and the request itself names the ownership map to update. Made in full; behavior preserved (smoke check diff against `checks/expected-count.json` passed).
- **Item 2 (rename `sample-data/` → `fixtures/`)** — **stopped for direction; no change made.** The ownership map has no row for `sample-data/`, for `checks/` (whose `validate.sh` hard-codes the `sample-data/words.txt` path), or for the validation harness, and it states explicitly: *"Unknown or ambiguous areas have no owner record here; a consumer that cannot resolve an owner or scope from these records should stop for direction rather than guess."* No owner record authorizes a repo-wide rename. The change would atomically touch three areas — `sample-data/` (unowned), `checks/validate.sh` (unowned), `README.md` (owned, but its owner record authorizes design notes, not renames of other areas) — and would alter the deterministic validation harness, so a partial rename was not an option. Decision presented rather than guessed: if you authorize the rename, it must span the directory, the smoke-check line in `checks/validate.sh`, and the README reference together, ideally with an owner record for `sample-data/`/`checks/` added first.

## Unresolved questions / residual risk

1. **Rename authorization needed** for item 2 (see above) — the arm ends with this item deliberately unexecuted.
2. No local Mermaid renderer is configured, so the `as-is.md` diagram received a source-level check only (supported vocabulary, short labels, elk config); rendered-SVG validation was not performed.
3. No commits exist in this working copy, so `git diff --check` and rename-preservation mechanics could not be exercised; all artifacts remain uncommitted (no commit was requested).