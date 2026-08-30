## Agentic Development System — Agents/skills flow plan — Draft 2 — Review manifest

Purpose: Bind the exact Sol-authored agents/skills plan packet for caller freeze, external Kimi review of the same revision, and later Human Review.

## Status and authority

Status: proposed Draft-2 successor; not yet caller-frozen, externally Kimi-reviewed, or Human Review accepted.

This manifest is identity and review-scope evidence only. It does not authorize file edits, task creation, launch, provider execution, implementation, setup, distribution, benchmark, migration, adoption, retirement, commit, or merge.

Construction-time assignment:

- Sol authors and later advises.
- External Kimi reviews the same exact frozen packet before Human Review.
- Terra may later implement only after Human Review, separate kick-off, and exact admission outside this packet.
- Sol’s later result review is explicitly non-independent.
- Deterministic validation remains separate.

Construction-time Sol model observation: `openai/gpt-5.6-sol`. This observation is not permanent configuration or a future model selection.

`startsWork: false`

## Accepted source identities

| Source | Accepted identity or current fact |
| --- | --- |
| High-level-design Draft 11 | `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836` |
| Overall-realization roadmap Draft 12 | `797ed521be694c36d08398a50e1fa17ea6c37c19b507d3fb557834413ac98124` |
| Coding/application flow plan Draft 2 | `5382e6c727abc7a362d74a2d3bab024689c8a81be3329ff0398ba4b62c0390e0` |
| Coding/application Draft-2 Human Review | Caller-provided current fact: accepted on 2026-08-29; not pending |

These identities are protected provenance. They are not the identity of this agents/skills packet and grant no implementation authority.

## Exact packet membership

The intended packet directory is:

`drafts/agentic-development-system-agents-skills-flow-plan-draft2/`

It must contain exactly:

1. `plan.md`;
2. `decision-brief.md`;
3. `review-manifest.md`; and
4. `review-instructions.md`.

No companion, freeze record, review report, disposition, acceptance record, context note, or generated file is a packet member.

The recursive packet digest includes exactly:

1. `plan.md`;
2. `decision-brief.md`.

`review-manifest.md` and `review-instructions.md` are excluded from the recursive packet digest but must each receive an individual SHA-256 identity and be directly verified against the caller-owned freeze record.

## Exact identity protocol

After all packet bytes are finalized, the caller must:

1. Verify that the directory contains exactly the four declared relative paths and no additional packet member.
2. Compute SHA-256 over the raw bytes of each of the four files and record each result as 64 lowercase hexadecimal characters.
3. Compute the recursive digest using `sha256-path-digest-v1` over exactly `plan.md` and `decision-brief.md`.
4. Record the packet directory, exact membership, all four individual hashes, recursive digest, algorithm, timestamp, predecessor reference, and successful membership verification in a separate caller-owned freeze record.
5. Supply the exact frozen packet and freeze record to external Kimi without changing packet bytes.
6. Treat any later packet-byte change as a successor requiring new individual identities, a new packet digest, a new freeze record, and external Kimi review of the successor before Human Review.

For `sha256-path-digest-v1`:

1. Use normalized relative POSIX paths with no leading slash, empty path, `.` or `..` segment, NUL, CR, or LF.
2. Hash each included file’s raw bytes with SHA-256 and render the digest in lowercase hexadecimal.
3. Sort entries by the raw UTF-8 byte sequence of the normalized path.
4. Begin the canonical byte stream with the UTF-8 bytes for `as-is-packet-v1` followed by NUL.
5. For each sorted entry append: the ASCII decimal byte length of the UTF-8 path, a colon, the UTF-8 path bytes, NUL, the 64-byte lowercase ASCII hexadecimal file digest, and LF.
6. SHA-256 hash the complete canonical byte stream.

No digest value is embedded in this manifest because materialization changes the final byte identities.

## Review scope

External Kimi must check:

- exact four-file membership and agreement with the caller-owned freeze record;
- direct individual identities for all four files and recursive digest scope limited to `plan.md` and `decision-brief.md`;
- traceability to the three accepted identities and the current 2026-08-29 coding-plan acceptance fact;
- exact construction assignment: Sol authors/advises, external Kimi reviews the frozen plan, the human decides it, Terra later implements, and Sol’s later result review is non-independent;
- absence of any claim that Kimi review or Human Review has already occurred for this packet;
- construction-time model observation language without permanent model or provider configuration;
- preservation of current `as-is.md`, agent, skill, module, launcher, adapter, fixture, projection, setup, and configuration contracts;
- the minimal provider-free candidate scope and explicit current-versus-target separation;
- exact anchors, dispositions, candidate consumers, protected inputs, recovery, escalation, stop conditions, and gate-time unknowns;
- the distinction between plan review, Human Review, implementation advice, semantic result review, independent result review, deterministic validation, and later adoption;
- exclusion of coding/application implementation, task-control, reservations, process-adapter work, fixture implementation, provider execution, setup/distribution, benchmark, adoption, retirement, commit, and merge authority; and
- explicit `startsWork: false`.

The review must not assess unmaterialized implementation, invent missing consumers or names, select Terra or Kimi runtime facts, contact a provider beyond the separately authorized review execution, or treat historical model labels as proof.

## Review-order rule

The order is mandatory:

1. caller materializes and freezes Draft 2;
2. external Kimi reviews that exact frozen revision;
3. Sol disposes findings;
4. any material repair becomes a successor and returns to freeze and Kimi review;
5. only the same exact Kimi-reviewed revision proceeds to Human Review; and
6. implementation remains blocked pending separate kick-off and admission.

Kimi review is advisory and grants no Human Review, implementation, integration, adoption, or completion authority.

## Required review output

Return exactly these sections:

1. Verdict;
2. Scope and identity;
3. Evidence;
4. Blocking findings;
5. Non-blocking findings;
6. Recommendation; and
7. Residual risk.

The verdict must be `ready`, `revise`, or `inconclusive`.

A missing freeze record, packet-membership mismatch, identity mismatch, unavailable exact packet, or inability to establish that the reviewed bytes are the caller-frozen bytes requires `inconclusive`.

A material scope, authority, safety, current-target, review-order, protected-input, or acceptance defect requires `revise`.

`ready` means only that no blocking plan defect was observed in the exact reviewed packet. It is not approval.

## Safe next action

The caller may materialize these four files, compute the identities, create the separate freeze record, and arrange bounded external Kimi review. No packet member may claim the review or Human Review before the corresponding external record exists.

`startsWork: false`
