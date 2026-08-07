# Changelog

- 2026-08-14: Completed `independent-behavior-contract`. Updated the expert
  contract so supplied controlled-worktree evidence and explicit acceptance
  conditions are authoritative, while caller, worker, component-builder,
  downstream, delegation-chain, and runtime identity are not validation
  authorities. Refactored the live harness so behavioral cases do not depend on
  a named caller or parent; launcher admission metadata remains separate from
  behavior checks. The unchanged baseline passed with 2 deterministic tests and
  8 assertions plus 3 skipped live cases; the opt-in baseline passed with 4
  tests and 65 assertions. Post-refactor deterministic validation passed with 2
  tests and 8 assertions plus 3 skipped live cases; the opt-in live suite passed
  4 tests with 71 assertions in 22.17 seconds. Focused launcher regression
  passed with 28 tests and 197 assertions. Bun build and `git diff --check`
  passed. No implementation descendants were authorized; closure was
  vacuously terminal. Final read-only validation found the implementation safe
  to commit. Residual risk: launcher admission still requires the configured
  component-builder caller, and provider wording/latency remain
  model-dependent.
