# Agentic Development System — Overall Realization Roadmap — Draft 4 — Review Manifest
Purpose: Declare the exact four-file successor packet for identity recording, bounded review, and one human planning decision.

## Status and predecessor

Status: proposed successor packet; pending parent identity recording and final exact review.

Accepted predecessor packet: `drafts/agentic-development-system-overall-realization-roadmap-draft3/`.

Predecessor identity and acceptance evidence:

- `reviews/agentic-development-system/overall-realization-roadmap-draft3-freeze.md`
- `reviews/agentic-development-system/overall-realization-roadmap-draft3-final-exact-review.md`

Draft 3 and all prior reviews remain preserved evidence. Draft 4 does not supersede Draft 3 unless the human accepts the exact frozen Draft-4 packet.

## Exact packet membership

Materialize the packet under `drafts/agentic-development-system-overall-realization-roadmap-draft4/` with exactly these four packet files:

1. `roadmap.md`
2. `decision-brief.md`
3. `review-manifest.md`
4. `review-instructions.md`

`model-and-review-assignment.md` is a supporting operational companion supplied with the authoring response. It is not a member of this four-file planning-decision packet. The packet’s roadmap and brief contain the model/role facts necessary for the requested decision. The companion remains available for deeper operational detail.

## Identity and digest scope

The parent computes identities only after materializing the exact bytes.

- Compute individual SHA-256 values for all four files.
- Verify `review-manifest.md` directly.
- Compute the packet digest using `sha256-path-digest-v1` over the manifest-declared non-manifest files in manifest order: `roadmap.md`, `decision-brief.md`, and `review-instructions.md`.
- Exclude `review-manifest.md` from the recursive packet digest.
- Record all file digests, packet digest, packet path, algorithm, and verification result in a separate caller-owned Draft-4 freeze record.
- Do not place computed digest values in this manifest.
- Any packet-file change requires a successor revision or a newly frozen Draft-4 revision with recomputed identities and a fresh exact review.

## Controlling and historical sources

- Accepted Draft-3 packet and its freeze and exact-review records.
- Accepted draft-11 target design, manifest, and Human Review acceptance.
- `drafts/agentic-development-system-brief.md`.
- `agents/as-is.md`, `skills/as-is.md`, applicable current `agents/*/agent.md`, and `as-is.json`.
- `drafts/agentic-development-system-owner-and-pilot-selection-draft1.md`.
- `drafts/agentic-development-system-executable-realization-plan-draft6.md`, its freeze record, and final Sol review.
- Preserved historical draft-36 bundle from commit `4f1dc0f6c56db145c634d1a673f5e380299ded8e`, including `/tmp/as-is-sol-overall-roadmap-context/`.

Historical records may conflict. The accepted draft-11 direction controls target intent; current live records control current behavior; neither historical model use nor review output grants authority.

## Review scope

The exact review checks:

- preservation of the original broad program objective;
- preservation of accepted draft-11 agent and skill dispositions as target direction;
- separation of target direction, current contracts, realization, migration, and adoption;
- treatment of sibling parallelism as a clarification and Draft 6 as a first slice;
- complete coverage of design, lifecycle, authority, packets, assurance, setup, migration, benchmark, advancement, adoption, retirement, and merge;
- progressive disclosure and reduced human cognitive load;
- sufficiency and concision of `decision-brief.md`;
- explicit distinction among planning/advice, implementation, deterministic validation, semantic review, architecture review, integration, and evaluation roles;
- separation of configured presets, historical named models, proposed assignments, and kick-off selection;
- visible contradiction handling;
- exact current-versus-target and pilot-versus-program distinctions; and
- absence of implied task, launch, implementation, benchmark, migration, adoption, retirement, commit, or merge authority.

The reviewer must not redesign the program, silently reconcile contradictions, select task-level models or holders, or treat review completion as acceptance.

## Progressive-disclosure requirement

The human planning decision must be understandable from `decision-brief.md` alone. The brief must expose the current decision, recommendation, material consequences, key risks, authority limits, and next safe action. The roadmap remains available for exact supporting detail. Material blockers, scope changes, residual risks, or external effects must not be hidden solely in supporting detail.

## Authority limits

This packet is not a contract adoption, task record, kick-off, implementation authorization, benchmark authorization, migration decision, target-adoption decision, artifact-retirement decision, commit authorization, or merge authorization.

Only the human may accept, revise, defer, or reject the exact packet. Model identity, reviewer verdict, digest verification, and process completion grant no authority.

## Next safe action

Materialize the exact packet, create the separate freeze record, perform the bounded exact review, and only then present `decision-brief.md` for one human planning decision. The companion is outside packet identity and is retained as linked supporting context.

===== END C: review-manifest.md =====
