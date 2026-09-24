# Benchmarks - changelog

## 2026-09-23 - Component established; QR1+QR2 history preserved; GLM 5.3 Flash model-sensitivity experiment completed

- Preserved the benchmarking process as a top-level component: QR1 material (minimal-vs-structured round, final candidate instruction, review trail, worklog) and QR2 material (process, fixture, frozen candidate instruction v1, B2 revision with Grok freeze verification, machinery, decision packet).
- Preserved per the human retention ruling: no scored-run outputs and no intermediate candidate drafts; durable content is process, fixture, machinery, frozen final instructions, review trails, and decision records. B2 is the drop-in successor candidate; v1 stays frozen because scored runs cite it by hash.
- Round-2 (QR2) conclusions: Alpha (current composition) mean 2.67 (Luna) / 3.17 (GLM 5.3 Flash); candidate v1 mean 1.33 (Luna) with a reproducible declared-entrypoint omission; B2 mean 2.33 (Luna). Blind deciding pair (Kimi K2.6 + GLM 5.3) tied at 2.5/2.5; candidate boundary discipline 4-5 across all phases and assessors. Gate-5 recommendation: hybrid (keep current machinery, adopt candidate's closure-ledger discipline and boundary clauses, add a manifest-member completion gate).
- Model-sensitivity axis (separate, not pooled): GLM 5.3 Flash eliminated the entrypoint-omission defect (both Flash arms wrote their declared entrypoints; Flash Alpha 3.17 is the benchmark's best arm), while the F0 coordinator checkpoint defect persisted on both models - instruction/machinery-level, not model-specific. Runner swap required one harness accommodation (JSON-string tool-argument coercion) recorded in the machinery.
- Machinery: runner model parameterized via `QR2_RUNNER_MODEL`; stale `/tmp` pi-runtime path fixed; smoke test passes on both runner models.
## 2026-09-23 - Restructured to an on-demand benchmarking setup

- Reorganized per human direction: the reusable instrument is now first class at the component root - fixture (`fixture-spec.md`), machinery (`machinery/`), and frozen instructions (`instructions/candidate-v1.md`, `instructions/candidate-b2.md` as the drop-in successor); round archives moved to `rounds/qr1/` and `rounds/qr2/`.
- The component's purpose is now operational: benchmark new repository changes on demand by running baseline and candidate arms through the machinery and comparing scores; recorded in `as-is.md` Design (arm selection, runner-model override, smoke, scored runs, result recording flow, pooling invariants).
- Machinery verified to load from the new layout; fixture path references resolve; frozen instruction hashes unchanged (v1 `b4725d75…`, B2 `a62e4e78…`).

## 2026-09-24 - Machinery made model-agnostic; two latent observe defects fixed; validated on a third runner model

- Runner model cards are now generic: built-in cards for the preset and GLM 5.3 Flash, otherwise derived from the OpenRouter public models list (context window, pricing, reasoning/tool support; no-tool models fail fast). Any OpenRouter model id can now be benchmarked via `QR2_RUNNER_MODEL`.
- Fixed two latent observe defects that had silently degraded every prior scored run: `CHILD_SESSION_MS` and `signal` were undefined in the observe tool, so observe always errored and roots improvised integration timing (chronology gates counted observe-start, which emitted before the failure). observe now works end to end (observe-done verified).
- Smoke task text corrected to request the full required-role manifest (the validator has always required all fixture roles; the old minimal-manifest wording contradicted it and the first model to follow it literally, GPT-5.6 Terra, correctly refused).
- End-to-end smoke validated on `openai/gpt-5.6-terra` (third runner model, never used before): manifest freeze of all roles + helper, delegate, observe-done, checkpoint, correct child code, handoffs; $0.42, 193s.

## 2026-09-24 - Records conformed to canonical shape; child records added; fixture spec rehomed

- Conformed `as-is.md` and `rounds/as-is.md` to the canonical record contract after the repo-wide rendered-navigation validator could finally run: lowercase titles, Components-table rows linking child `as-is.md#design` records, allowed sections only (`Navigation` renamed to `Links`), and structural container diagrams (single subgraph titled with the record name, all immediate children inside it).
- Added five child records in the house leaf pattern: `fixture/as-is.md`, `machinery/as-is.md`, `instructions/as-is.md`, `rounds/qr1/as-is.md`, `rounds/qr2/as-is.md`; moved `fixture-spec.md` to `fixture/fixture-spec.md` (preservation-aware `git mv`) so the fixture component owns its artifact.
- Machinery path repairs: `run-scored.ts`, `dry-run.ts`, and `smoke.ts` now resolve the fixture spec and candidate instruction relative to the machinery directory; the stale absolute paths into `temp/benchmark-round-2/` are gone, so the machinery runs from the committed tree.
- Validation: structural validator 11 tests pass; repo-wide rendered-navigation test renders all 80 repository diagrams in real Chromium (mermaid 12.0.0) with href evidence matching; machinery entry files bundle cleanly; fixture path resolves from machinery. Residual risk: the fixture path change is not live-smoked (no API spend incurred); next benchmark smoke covers it.
