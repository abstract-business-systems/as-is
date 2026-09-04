# Round-6 Acceptance Record

Date: 2026-09-01. Registered procedure: `candidate/benchmark/pre-registration-v6.md` (model-tier generalization + cost).

## Acceptance

The user accepted the round-6 shape in this conversation ("There's only a single model behind the preset. Let's start a round 6, considering that."), after the assistant proposed: both arms on `@preset/abs-medium`, uc9 + uc10 repeated, a budget-stop pressure variant of uc10 sized for mid-tier pricing, cost-per-arm reported next to the parity gates, and the round-5 run-2 candidate stores as the free glm anchor. The user additionally corrected the registration's drift concern: the preset resolves to a single model (no drift control needed; `responseModel` recorded as verification only).

Registered parameters:
- 2 arms (baseline 9a77e37; candidate = live post-drop catalog, digest `9f8dbdcb…` verified at setup; no strip transform).
- Model `@preset/abs-medium` for every role including the scorer; `thinking: high` pinned.
- uc9 request verbatim from round 5; uc10 identical except child budget $0.05 / 180 s.
- Arm caps $4.00 / 3600 s (raised from $2.00 so a mechanical cap-stop cannot contaminate parity).
- Cost per arm (parent + children) reported next to the gates; cross-model candidate comparison against round-5 run-2 candidate stores.
- Parity criterion unchanged: candidate ≥ baseline − 1 per UC, aggregate ≤ 3, all gates passing.

## Execution authorization

On this recorded acceptance, the implementer is authorized to: run the round-6 execution setup, launch the 4 arms (staggered ≥15 s), collect evidence, spawn the scorer, and commit results — under the registered procedure and the standing subagent condition.