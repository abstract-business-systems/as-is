# Changelog

## 2026-08-30 — workflow adoption and `count --top N`

- Adopted the as-is workflow in the seed project: setup plan recorded in-session (whole-project mode, one component candidate); created `AGENTS.md` (canonical as-is instruction), root `as-is.md` (project map), and `src/wordstats/as-is.md` (component record). Assumption recorded: the benchmark task's explicit setup order served as the candidate-approval authorization.
- Added `--top N` to `wordstats count` (`src/wordstats/cli.py`, `src/wordstats/counter.py:most_frequent`): prints only the `N` most frequent words as a JSON object with keys sorted alphabetically; ties broken alphabetically at the cutoff; `N` must be a positive integer (zero, negative, or non-integer rejected with exit 2 and a clear message); default full-frequency output unchanged. Design note recorded in `docs/design-notes.md` before implementation.
- Added focused tests: `tests/test_counter.py` (MostFrequentTests: ranking, tie-breaking, limit-larger-than-vocabulary, single-highest) and `tests/test_cli.py` (top output, tie-breaking at cutoff, unchanged default output, zero/negative/non-integer rejection via subprocess).
- Acceptance evidence: `bash checks/validate.sh` passed (compile: OK; 15 unit tests OK including the new ones; cli smoke check: OK; exit 0). Direct CLI verification: `--top 2` exit 0 with `{"fox": 2, "the": 3}`; `--top 0` exit 2 with usage error message.
- Blockers recorded: attributable expert plan review and expert diff validation unavailable — in-process subagent call failed (`ENOENT: scandir .../baseline/agents`: no agents registry in the isolated seed copy); not retried per the no-retry rule. Mitigation: deterministic validation plus direct CLI evidence.
- Descendant closure: no delegated descendants; vacuous terminal closure.
- Residual risk: expert second-perspective review of the design note wording and test coverage was not obtained; behavior is covered by deterministic tests and manual CLI checks.