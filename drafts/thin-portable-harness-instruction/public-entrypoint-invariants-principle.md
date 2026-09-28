# Proposal — public-entrypoint invariants principle

## Status

Deferred proposal; awaiting a human decision (adopt, revise, or decline). This proposal belongs to the thin-instruction lineage preserved in this package: it is a quality bar for any future candidate instruction — including the next thin-portable candidate — and its revival vehicle is the `productionize-thin-portable-harness-profile` backlog row. Deferred alongside the parked successor work; not current authority and not folded into the Alpha improvement change-set.

## Purpose

Give candidate instructions a project-general principle against a design-level failure observed in round-2 arms: compositions that passed per-component checks but violated invariants when exercised as a whole through the public entrypoint.

## Proposal (exact proposed wording)

Add one principle to the successor candidate instruction (this applies to any candidate in the thin-instruction lineage, not only one frozen snapshot; the cap applies to the final instruction text):

> Integration is judged by system behavior, not component behavior in isolation: before declaring integration complete, exercise the composed whole through its public entrypoint and verify cross-call invariants end to end (a call repeated must not repeat its effect, and a rejected input must be rejected at every layer).

## Evidence

- Both GLM arms wired compositions whose per-component behavior was correct but delivered duplicate events across calls (`probe:duplicate-delivers-once` failed in F0 and F2, 2 points per arm).
- No current instruction clause asks the runner to exercise cross-call invariants through the assembled system.

## Constraints

- Anti-overfit: the wording must remain project-general — no fixture vocabulary (QueueRelay, tenants, sinks, probe names, phase letters).
- Byte cap: the successor instruction is capped at 10,000 bytes; B2 is 9,971 bytes, so the addition must be compact or replace existing text.
- Route: instruction changes flow Sol → Grok → human freeze.

## Alternatives considered

- Keep instructions unchanged and rely on machinery gates — does not teach the design discipline; the miss is in composition wiring, not per-call behavior.
- Encode the invariant check as a machinery gate only — helps scoring but not the arm's own design process; a candidate would still pass components and fail integration.

## Next decision

Human decision when the thin-instruction lineage resumes: adopt, revise, or decline the principle; Sol drafts the successor text; Grok audits; human freezes. Package entry: [comparison.md](comparison.md).