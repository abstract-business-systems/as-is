# Construction-agent model-binding plan — Draft 1 — Review manifest

## Status and authority

Status: proposed four-file successor clarification; not frozen, externally reviewed, or Human Review accepted.

This manifest binds exact packet membership and review scope only. It does not authorize task creation, admission, worker launch, provider execution, implementation, benchmark execution, migration, adoption, retirement, commit, or merge.

`startsWork: false`

## Packet membership

The packet directory is `drafts/agentic-development-system-construction-agent-model-binding-draft1/` and must contain exactly:

1. `plan.md`;
2. `decision-brief.md`;
3. `review-manifest.md`; and
4. `review-instructions.md`.

The recursive packet digest includes exactly `plan.md` and `decision-brief.md`. The manifest and review instructions are packet members and receive individual identities but are excluded from the recursive digest.

No freeze record, review report, disposition, acceptance record, task record, generated file, or implementation artifact is a packet member.

## Protected provenance

- Accepted Draft-11 target-design SHA-256: `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`.
- Accepted Draft-12 roadmap packet digest: `797ed521be694c36d08398a50e1fa17ea6c37c19b507d3fb557834413ac98124`.
- Accepted coding/application Flow Plan Draft-2 packet digest: `5382e6c727abc7a362d74a2d3bab024689c8a81be3329ff0398ba4b62c0390e0`.
- Accepted agents/skills Flow Plan Draft-2 packet digest: `aa7ad0d39a41fb386bf921b52d755fac4cd78916935d3b2858dd50a4b122cf9b`.
- Frozen executable realization Plan Draft-6 SHA-256: `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`.

These are source identities, not the identity of this packet.

## Identity protocol

After authoring is complete, the caller must verify the exact four-file membership, compute each file's SHA-256, compute the recursive `sha256-path-digest-v1` over `plan.md` and `decision-brief.md`, and record all identities in a separate caller-owned freeze record. The digest must not be embedded recursively in this packet. Any material byte change after freeze creates a successor with fresh identities and fresh review.

## Review path

The review must verify:

- exact packet membership and caller freeze identity;
- the user-confirmed custom model-bound construction direction;
- the distinction between candidate implementation and current workflow benchmark behavior;
- custom Terra/Luna/Sol profile assignments and explicit non-independent result reviews;
- external Kimi review for the agents/skills portion without adding a Kimi coding/application plan gate;
- current task/component records as protected governance/context rather than candidate behavior;
- absence of current component-builder/current budget-control use as candidate implementation;
- exact model observations labelled as observations, not automatic selection or availability proof;
- bounded gates, protected inputs, validation, recovery, and stop conditions; and
- explicit `startsWork: false`.

The review is advisory and read-only. It must not select models, holders, or capabilities, create tasks, launch agents, contact providers, implement candidates, authorize benchmark work, or make a Human Review decision.

## Required result

Return `ready`, `revise`, or `inconclusive` with scope, identity, evidence, blocking findings, non-blocking findings, recommendation, and residual risk. A `ready` result does not approve the packet or authorize implementation.

## Safe next action

Verify the packet files, record the caller-owned freeze, obtain the applicable bounded reviews, and present the same exact packet for Human Review. Preserve this Draft-1 successor and all predecessors unchanged.
