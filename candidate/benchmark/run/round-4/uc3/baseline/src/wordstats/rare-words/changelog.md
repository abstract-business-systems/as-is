# rare-words changelog

## 2026-08-31 — Task r1, attempt 1: implement `filter_rare` helper (component-builder, completed)

- Added `src/wordstats/rarewords.py`: `filter_rare(counts: Mapping[str, int], max_count: int) -> dict[str, int]` returns a new mapping with only entries whose count is <= `max_count`; does not mutate the input; empty input yields an empty output; docstring states the pinned contract (src/wordstats/rare-words/as-is.md). No CLI-side validation here — the parent owns positive-integer validation in `cli.py`.
- Validation evidence: PYTHONPATH inline assertions (sample filtering, non-mutation, empty input, inclusive boundary) OK; `python3 -m compileall -q src` OK; `bash checks/validate.sh` (compileall, unittest discover, CLI smoke) — all checks passed.
- Expert gates: read-only expert plan review PASS; read-only expert final-diff validation verdict SAFE TO COMMIT (conditions: complete lifecycle before commit, keep commit scoped — both satisfied).
- Descendant closure: none, vacuous (delegation maximum-depth/children 0; no child launched).
- Residual risk: low — parent-owned CLI wiring and parent-authored tests for the helper remain the parent's declared scope.
- Recovery checkpoint: parent pre-launch commit 055a190 plus this scoped handoff commit on the current branch.
- Task artifacts removed at completion per plan: local `task` object in `as-is.json` and `tasks.md`; durable evidence preserved here. Budget: forwarded USD 0.8 (reserve 0.15), wall-clock 1200 s — neither limit approached; spent figures not directly observable from the launcher, no reserve consumed.