## Worker report — expert plan review (call 56f091e16bd141ce8b2d31cb9635e133)

**Read**: `as-is.md`, `src/wordstats/as-is.md`, `tasks.md` (Plan), `src/wordstats/cli.py`, `tests/test_counter.py`, `checks/validate.sh`, `records/ownership-map.md`, `records/owners/core-utility.md`, `docs/` listing.

### (1) Argparse exit-2 rejection contract

- Mechanism is sound: `type=positive_int` raising `argparse.ArgumentTypeError` makes argparse call `error()` → usage + message on stderr → exit code 2, matching the acceptance condition exactly. `sys.exit(main())` is bypassed by argparse, so no interference with the `return 0` path.
- One acceptance risk: argparse's default rendering is `argument --min-count: invalid positive_int value: 'x'`. Whether that counts as a "clear message" depends on the `ArgumentTypeError` string. **Required:** make the type function raise with an explicit human message (e.g. `"--min-count must be a positive integer (got 'x')"`), and have `tests/test_cli.py` assert that message fragment on stderr, not just the exit code.
- Edge coverage check: `0`, negative, non-integer (`"1.5"`, `"abc"`) all must exit 2; `--min-count 1` must be accepted and is output-preserving (all counts ≥ 1), so "default behavior unchanged" tests should cover both no-flag and `--min-count 1`.

### (2) Parent/child file split and shared-worktree child

- Split is clean: child owns only new files (`src/wordstats/topwords.py`, `tests/test_topwords.py`) + its own task record; parent owns `cli.py`, `tests/test_cli.py`, records, and the single commit. No write conflicts; ownership map resolves both files to `core-utility`, consistent.
- **Sequencing dependency (the main risk):** `cli.py` will import `topwords.filter_min_count`. `checks/validate.sh` runs `compileall` (import-insensitive) but `unittest discover` will import `cli`, which fails until `topwords.py` exists. Therefore full validation is only runnable **after** the child's files land; the parent must order work as child-first (or at least child-before-validate) and treat a mid-flight `validate.sh` failure as expected, not a defect. Parent should not run the smoke check until integration is complete.
- Child not committing in a shared worktree is acceptable: `--no-worktree` + no-commit means the parent sees the child's files directly and owns the one scoped commit. Residual risks: (a) the child must not run `checks/validate.sh` expecting green (parent's `test_cli.py` may be absent/incomplete) — the delegation note should scope the child to `python3 -m unittest tests.test_topwords` only; (b) `unittest discover` in validate.sh will silently pick up `tests/test_topwords.py` — that's the intended gate, but it means the child's tests are also acceptance material, so the ValueError branch of `filter_min_count` must be covered there (the CLI path can never reach it, since argparse validates first — the child's tests are the only coverage of that contract).
- Contract handoff: the exact `filter_min_count(counts, min_count)` signature, `>=` semantics, and "raise ValueError on non-positive integer input" should be stated verbatim in the child's task record so parent's `cli.py` wiring and child's implementation can't diverge.

### (3) Minimality and consistency with records/conventions

- Consistent: `core-utility` owns `src/wordstats/` wholesale, so the new `topwords.py` needs no ownership-map change; the component record already documents the filter pipeline and the `--min-count` row, so record and code will agree. Design-note-before-change matches the component record's stated convention. Default `None` + `is not None` guard is the minimal no-behavior-change mechanism; output formatting (sorted keys, 2-space indent) untouched.
- One naming nit: the component record describes `topwords` as "count-threshold filtering," which the implementation matches; no record update needed beyond what's already written.

### Verdict

- **Scope gate: pass.** Bounded change matches the task requirement and owner records; no ambiguous area.
- **Dependencies gate: pass** with the sequencing note above (topwords.py must exist before validate.sh).
- **Acceptance gate: pass** with two required revisions: (a) explicit `ArgumentTypeError` message text asserted in `tests/test_cli.py`; (b) child record must pin the `filter_min_count` contract including the ValueError branch and require tests for it.
- **Recovery gate: pass.** All work uncommitted in one worktree; recovery by re-reading the tree; parent owns the single scoped commit on `master`.

**Overall: PASS** — proceed after incorporating the two required revisions (explicit rejection message + pinned child contract with ValueError tests) and the child-before-validate ordering.