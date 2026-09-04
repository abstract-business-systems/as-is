## Status Report — round-5 uc9 baseline arm

### 1. Setup performed (workflow adoption) and record locations
Performed `as-is-setup` (whole-project mode, target = working directory; no instruction file existed). Setup plan recorded in the root task narrative (`tasks.md` → Plan, including planned writes and excluded paths). Created: root record **`as-is.md`** (title `# as-is - as-is`, structural-container diagram, links), component record **`src/wordstats/as-is.md`** (`# wordstats-core - as-is`), child component records **`records/components/{rarewords,topwords}/as-is.md`** + machine task companions (`as-is.json` task objects) + narratives (`tasks.md`), **`AGENTS.md`** with the canonical as-is instruction, and root **`as-is.json`** (openrouter/glm-5.3-flash configuration + parent task object). Component candidates carried semantic evidence (existing owner records + the request's mandated decomposition); approval was supplied by the benchmark request itself.

### 2. Delegation (concurrency requirement)
Both children launched via the governed launcher ~6 ms apart with `--detach --no-worktree --model z-ai/glm-5.3-flash --approve --budget-wall-clock-seconds 1500 --budget-cost-usd 0.5`, agent `/home/vc/dev/as-is/agents/component-builder/agent.md` (non-empty `tools:` declaration; the pinned script requires `--agent`, so the "no `--agent`" option was unavailable): `j-mthpde8a-t4g0me` (rarewords, exit 0, 46.3 s) and `j-mthpde8g-h6b403` (topwords, exit 0, 35.6 s) — both live simultaneously, each writing only its own module + tests + its own task record (no shared files, no commits). Both child records reached `completed` with validation evidence.

### 3. Files changed (commit `18aa4b3` on top of baseline `d609f84`)
- New: `src/wordstats/rarewords.py`, `src/wordstats/topwords.py` (children); `tests/test_cli.py`, `tests/test_rarewords.py`, `tests/test_topwords.py`; `as-is.md`, `src/wordstats/as-is.md`, `AGENTS.md`, `as-is.json`, `tasks.md`, `records/components/**`, `agents/expert/agent.md` (local read-only expert-role mirror), `.gitignore`
- Modified: `src/wordstats/cli.py` (`--rare N`, `--top N`, `positive_int` validation → exit 2), `docs/design-notes.md` (two notes), `records/ownership-map.md`, `CHANGELOG.md`, `.as-is/tracing.jsonl` (host runtime)

### 4. Check results (verbatim tail, final run)
```
Ran 24 tests in 0.010s

OK
unit tests: OK
cli smoke check: OK
All checks passed.
VALIDATE_EXIT=0
```
Also end-to-end: `--top 0` → exit 2, `--rare abc` → exit 2 with "N must be a positive integer…" messages; `--rare 2` → exit 0; `git diff --check` clean; record links resolve.

### 5. Bounded-scope resolution
No stop-for-direction was needed. Concurrency conflict on `cli.py` was avoided by scoping children to disjoint file sets with the parent owning integration and the commit; recorded an explicit **`no-separate-integration`** disposition (no isolated child commits existed; parent-owned worktree). Descendant closure: both children terminal `completed`, zero grandchildren.

### 6. Unresolved questions / residual risks
- Both in-process expert calls (plan review, final validation) returned **no text report** (recorded results, not retried per arm policy); independent expert sign-off is absent — deterministic checks and direct review substitute.
- Cost is launcher-forwarded for self-limiting only; actual spend not host-observable (forwarded $0.5/child caps, arm cap $2.00).
- Combining `--rare` and `--top` in one invocation applies both filters in that order (unspecified by the request; documented in `as-is.md`).