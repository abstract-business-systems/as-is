# Changelog

- 2026-08-06: Completed `independent-behavior-contract`. Made the role
  contract and live harness independent of fixed caller, delegation-chain, and
  downstream role behavior. Launcher caller and parent values are documented
  as harness configuration; the registry check requires exactly one expected
  subject launch and rejects descendants. The pre-refactor live baseline passed
  (3 tests, 33 assertions, 37.57 seconds), and the corrected post-refactor
  baseline passed (3 tests, 36 assertions, 42.77 seconds). Deterministic skip,
  Bun build, and diff checks passed. Final read-only expert validation passed
  and judged the implementation safe to commit. No implementation descendants
  were authorized; closure was vacuously terminal. Residual risk: provider
  wording and latency remain model-dependent, and final expert validation
  accepted recorded command evidence without rerunning it.

- 2026-08-06: Completed `live-behavioral-baseline`. Added three independently
  fixture-backed opt-in real-Pi scenarios for bounded trace/session evidence
  selection, explicit unknown and unavailable evidence, and recommendation-only
  budget advice. The provider-disabled check skipped 3 tests; the live suite
  passed 3 tests with 33 assertions in 37.10 seconds. Fixture, task, trace,
  session, repository, registry, and commit mutation checks passed. Final
  read-only expert validation passed and judged the implementation safe to
  commit. Residual risk: provider wording and latency remain model-dependent,
  and final expert validation accepted recorded live evidence without rerunning
  it.
