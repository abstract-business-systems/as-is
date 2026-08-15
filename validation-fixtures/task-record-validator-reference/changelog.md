# Changelog

- 2026-08-16: Relocated the Python task-record validator, compatibility test, README, and retained reference records from the retired `components/task-record-validator/` path to `validation-fixtures/task-record-validator-reference/`. The Bun validator under `core/modules/task-control/` remains the sole runtime owner; this fixture remains non-runtime reference evidence.

- 2026-08-23: Completed the bounded Bun/TypeScript task-record validator port. Added dependency-free `validator.ts` and parity fixtures covering valid trees, weakened policy and delegation limits, child budget excess, and completed-parent descendant closure. The Bun implementation remains read-only and independent of control-plane mutation authority; the Python validator remains the semantic reference during transition. Validation passed: Bun parity 6 tests and 15 expectations, Python reference 6 tests, control-plane and budget suites 19 tests and 69 expectations, as-is content validation (43 records, 44 diagrams), task-record validation, JSON/Bun syntax, and `git diff --check`. README usage documents both Bun and Python transition-reference commands.

## 2026-08-15 — Legacy record migration

- **Component:** Task-Record Validator.
- **Result:** The deterministic local validator and focused checks are complete; descendant closure is satisfied. Scoped implementation commit: `c19f45b`.
- **Validation retained:** `python3 -m unittest -v test_task_record_validator.py` passed all six tests, including valid trees, weakened constraints, budget exhaustion, and descendant-closure failures. Direct validation, Python compilation, and `git diff --check` passed. The validator now reads strict JSON companion metadata and front-matter-free configured narratives; legacy YAML task input is unsupported.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.
