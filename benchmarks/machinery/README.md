# benchmarks - machinery

`qr2/machinery/` launches benchmark arms through a local OpenAI-compatible proxy that pins the
runner model, captures real per-session costs, freezes manifests, and applies deterministic 0-5
phase checkers. Runner identity is disclosed per round; results from different runner models are
separate axes and are never pooled.

## Runtime setup

The pi runtime is not vendored here. Before running, create the expected layout:

```
ln -s <your pi installation pkg dir> pi-runtime/pkg
```

For this host: `ln -s /shared/store/pi/pkg qr2/machinery/pi-runtime/pkg` (pi 0.85.1 verified).

## Entry points

- `smoke.ts` — full harness check (manifest freeze, delegation, child session, handoff, cost capture); discardable.
- `run-scored.ts baseline|candidate <outDir> [instructionPath]` — scored six-phase arm run; refuses to overwrite existing outDirs.
- `dry-run.ts`, `assessment/build-packets.py`, `assessment/run-assessors.py` — dry validation and blinded model-level assessment.

## Runner model override

`QR2_RUNNER_MODEL` env var swaps the implementing model (default `@preset/abs-medium`, identity
Luna). Built-in model cards exist for the preset and `z-ai/glm-5.3-flash`; any other OpenRouter
model id is derived on demand from the public `/models` list (name, context window, pricing,
reasoning/tool support) — models without tool calling fail fast. Runner-model experiments are
separate axes and are never pooled with preset runs.