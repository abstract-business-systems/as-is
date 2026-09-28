# Proposal — fixture entrypoint contract

## Status

Deferred proposal; awaiting a human decision (adopt, revise, or decline). Not current authority; not folded into the Alpha improvement change-set.

## Provenance

This proposal arose from benchmark-round-2 fixed-machinery evidence (2026-09-25); the fuller temporary evidence lives in `temp/qr2-improvement-changeset/audit-packet.md` (non-authoritative, volatile). It is deliberately separate from the thin-instruction lineage package: it concerns benchmark fixture fairness for every future round, not the lean-instruction idea.

## Purpose

Close a scoring-fairness gap in the benchmark fixture: the behavior probes enforce an entrypoint contract that the fixture specification never states, so an arm can make a defensible design choice and still be scored BAD against an unstated rule.

## Proposal (exact proposed text)

Add to `benchmarks/fixture/fixture-spec.md` §1 (builder manifest section):

> **Entrypoint contract.** The builder's declared entrypoint must expose a module-level `deliver(event)` function returning a list of delivery records. Each record identifies the delivered event (at minimum `tenant` and `id`). An event that reaches no sink contributes no record, so `deliver` returns an empty list for it. Deliveries count across separate `deliver()` calls: an event whose `(tenant, id)` has already been delivered must not be delivered again.

## Evidence

- `benchmarks/machinery/checkers.ts` behavior probes (lines 34–37) require: module-level `deliver`, list return type, empty list for invalid events, and dedup persistent across separate calls.
- `benchmarks/fixture/fixture-spec.md` states "invalid events reach no sink; duplicates deliver once" (line 110) but never defines the entrypoint's interface.
- Observed loss: the preset-baseline arm returned an `invalid`-outcome envelope from `deliver()` — a defensible reading of the silent spec — and failed the probe (3 points).

## Scope and fairness

The clause is fixture-owner machinery binding every future arm equally; it does not favor either arm of a pair. Recorded arms are not re-run and remain comparable — they ran under the old, silent spec.

## Alternatives considered

- Loosen the probe to accept outcome envelopes — weakens the discriminator and muddies dedup counting; rejected.
- Leave the spec silent — cheapest, but every future arm re-rolls the same ambiguity; rejected as the default.

## Next decision

Human adopts, revises, or declines the clause. If adopted, the amendment flows the fixture-owner chain; recorded scores stay frozen.