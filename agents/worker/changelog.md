# Changelog

- 2026-08-14: Completed `independent-behavior-contract`. Updated the worker
  contract so assigned scope, task requirements, and acceptance conditions are
  authoritative, while caller, upstream role narrative, downstream
  validation, delegation ancestry, and runtime identity are not behavior
  authorities. Refactored the opt-in live harness to separate launcher caller
  metadata from worker behavior and added equivalent fixture-backed coverage
  across differing upstream narratives. The unchanged baseline passed with 2
  deterministic tests and 7 assertions plus 4 skipped live cases; the opt-in
  baseline passed with 4 tests and 86 assertions. Post-refactor deterministic
  validation passed with 2 tests and 7 assertions plus 4 skipped live cases;
  the corrected opt-in live suite passed 5 tests with 153 assertions in 20.38
  seconds. Bun build and `git diff --check` passed. No implementation
  descendants were authorized; closure was vacuously terminal. Final
  read-only validation found the implementation safe to commit. Residual
  risk: launcher admission metadata remains fixed by policy, and provider
  wording/latency remain model-dependent.
