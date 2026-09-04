Validating behavior with a small in-memory check (no shell commands needed; reading back and reasoning over the code):

**Finding**

Created `src/wordstats/topwords.py` as the only artifact. It provides `filter_min_counts(counts, min_count)` matching the module contract in `src/wordstats/tasks.md` and `docs/design-notes.md`:
- Returns a new dict containing only entries with `count >= min_count`, preserving original keys and values (input untouched).
- Raises `ValueError` with a clear message when `min_count` is zero, negative, non-int (e.g. `1.5`, `"3"`, `None`), or a `bool` (`True`/`False` rejected via `isinstance(min_count, bool)` check before the `int` check, since `bool` subclasses `int`).

**Evidence**

- File created: `src/wordstats/topwords.py` (673 bytes), signature `def filter_min_counts(counts, min_count):` — plain function, module + function docstrings, stdlib only (no imports at all), style matched to `src/wordstats/counter.py`.
- Verification by code inspection (I cannot execute commands in this harness): the comprehension `{word: count for word, count in counts.items() if count >= min_count}` returns a new dict; validation short-circuits before use so `ValueError` fires for every rejected case, including `True` (would otherwise pass as 1).
- No other file was created or modified; no commit made.

**Recommendation**

Parent (which owns `cli.py` and tests) can wire `filter_min_counts` into the `--min-count` option, mapping the raised `ValueError` to exit code 2 with a clear message, per `docs/design-notes.md`. Suggested parent tests: `True`/`False`/`0`/`-1`/`1.5`/`"3"` → `ValueError`; normal filtering preserves keys/values and does not mutate input.

**Residual risk**

Low. Behavior was verified by inspection rather than execution, since I cannot run commands; the logic is simple enough that this is a minimal risk, and the parent's planned unit tests will exercise it. Edge semantics choice: `min_count` of `True` raises rather than being treated as `1` — this follows the explicit "treat bool as non-int" requirement.