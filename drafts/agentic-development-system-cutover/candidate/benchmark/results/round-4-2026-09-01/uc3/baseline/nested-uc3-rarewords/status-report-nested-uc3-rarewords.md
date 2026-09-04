Task complete. Summary:

**Delivered**: `030d55d` — one scoped commit on `master` containing exactly the declared handoff:
- **`src/wordstats/rarewords.py`** (new) — `filter_rare(counts: Mapping[str, int], max_count: int) -> dict[str, int]`: returns a new dict with only entries whose count is `<= max_count`, no input mutation, empty input → empty output, docstring stating the pinned contract; no CLI-side validation (parent owns that in `cli.py`).
- **`src/wordstats/rare-words/changelog.md`** (new) — durable completion summary.
- **`src/wordstats/rare-words/tasks.md`** and the local `task` object removed as completion artifacts (evidence preserved in the changelog).

**Procedure followed** (building-components):
1. Task advanced `ready → active` with scope, acceptance mapping, and recovery checkpoint recorded; expert plan review (read-only, attributable): **PASS**.
2. Implemented the module per the pinned contract.
3. Validation: PYTHONPATH inline assertions (filtering, non-mutation, empty input, inclusive boundary) OK; `python3 -m compileall -q src` OK; `bash checks/validate.sh` — **all checks passed** (4 existing unit tests unchanged).
4. Expert final-diff validation (read-only, attributable): **SAFE TO COMMIT**; its two conditions (complete lifecycle before commit, keep commit scoped) were satisfied.
5. Task reached `completed` with evidence, vacuous descendant closure, residual risk, and recovery checkpoint recorded before handoff.

**Boundaries respected**: no edits to `cli.py`, tests, docs, or root records; `.as-is` runtime artifacts and `__pycache__` left uncommitted for the harness/runner. Budget well under the forwarded limits; no blockers.