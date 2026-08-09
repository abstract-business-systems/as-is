# Changelog

## 2026-08-15 — Legacy record migration

- **Component:** Task-Record Validator.
- **Result:** The deterministic local validator and focused checks are complete; descendant closure is satisfied. Scoped implementation commit: `c19f45b`.
- **Validation retained:** - `python3 -m unittest -v test_task_record_validator.py` passed all six tests, including valid trees, weakened constraints, budget exhaustion, and descendant-closure failures. - Direct validation, Python compilation, and `git diff --check` passed. - Residual risk: the intentionally small YAML subset does not cover arbitrary legal YAML or adversarial filesystem trees.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.
