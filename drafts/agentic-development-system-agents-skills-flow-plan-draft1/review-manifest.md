# Agentic Development System — Agents/Skills Flow Plan — Draft 1 — Review Manifest

Purpose: Declare the exact Sol-authored agents/skills packet, identity protocol, and mandatory external Kimi review boundary.

## Status and authority

Status: proposed Draft-1 packet produced as plan-authorship output only. It has not been materialized, frozen, externally reviewed by Kimi, decided through Human Review, or authorized for implementation.

Construction assignment: Sol authors and advises; Terra later implements; Sol later reviews Terra’s result non-independently. External Kimi reviews the exact frozen plan packet before Human Review. Kimi is not an implementation author, deterministic validator, implementation-result reviewer, integration owner, or authority.

This manifest grants no setup, provider, security, benchmark, migration, adoption, retirement, commit, merge, task, kick-off, launch, or implementation authority.

`startsWork: false`

## Exact packet membership

Proposed packet directory:

`drafts/agentic-development-system-agents-skills-flow-plan-draft1/`

The packet contains exactly these four files:

1. `plan.md`
2. `decision-brief.md`
3. `review-manifest.md`
4. `review-instructions.md`

No freeze record, review output, Human Review record, source artifact, implementation artifact, or authoring response is part of the packet.

## Identity and digest protocol

After all four files are materialized with final bytes, the caller must:

1. Verify that the directory contains exactly the four declared packet files.
2. Compute the raw-byte SHA-256 of each file and record each as 64 lowercase hexadecimal characters.
3. Directly verify `review-manifest.md`.
4. Compute the recursive packet digest with `sha256-path-digest-v1` over exactly:
   - `plan.md`
   - `decision-brief.md`
   - `review-instructions.md`
5. Exclude `review-manifest.md` from the recursive digest to avoid self-reference.
6. Record the packet path, all four individual file digests, recursive packet digest, algorithm, membership verification, and freeze time in a separate caller-owned freeze record.
7. Make no packet-byte change after freeze. Any change requires a successor revision, new identities, and fresh Kimi review.

For `sha256-path-digest-v1`:

1. Use normalized relative POSIX paths with no leading slash, `.` or `..` segment, NUL, carriage return, or line feed.
2. Compute each scoped file’s SHA-256 over its raw bytes.
3. Sort entries by normalized-path UTF-8 bytes.
4. Begin the canonical byte stream with ASCII `as-is-packet-v1` followed by NUL.
5. For each sorted entry, append its ASCII decimal path-byte length, `:`, UTF-8 path bytes, NUL, lowercase hexadecimal file digest, and LF.
6. SHA-256 hash the complete canonical byte stream.

Do not insert computed identities into this manifest after freeze.

## Controlling sources

- Accepted high-level-design Draft 11:
  - packet `drafts/agentic-development-system-high-level-design-draft11/`
  - target-design SHA-256 `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`
  - packet digest `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2`
- Accepted overall-realization-roadmap Draft 12:
  - packet `drafts/agentic-development-system-overall-realization-roadmap-draft12/`
  - packet digest `797ed521be694c36d08398a50e1fa17ea6c37c19b507d3fb557834413ac98124`
- Separately supplied coding/application Draft-2 acceptance context:
  - packet `drafts/agentic-development-system-coding-application-flow-plan-draft2/`
  - packet digest `5382e6c727abc7a362d74a2d3bab024689c8a81be3329ff0398ba4b62c0390e0`
  - durable acceptance-state discrepancy identified in `plan.md`

Current `as-is.md`, `agent.md`, `SKILL.md`, repository instructions, and current contracts remain authoritative for current behavior.

## Mandatory external Kimi review

The caller must provide external Kimi with the exact frozen four-file packet and its separate freeze record.

Kimi reviews that exact revision only. Referenced sources may be consulted to check traceability and links, but they are not substitute review objects. Kimi must not review an excerpt, reformatted copy, successor, implementation, benchmark, or implementation result as though it were the frozen plan.

Kimi’s review record must remain outside the packet and identify:

- exact packet path and recursive digest;
- individual file identities or freeze-record reference;
- observed reviewer/model identity and the limits of that observation;
- whether identity was independently verified;
- review scope and evidence;
- blocking and non-blocking findings;
- recommendation and residual risk; and
- explicit absence of approval or implementation authority.

A reviewer/model observation must not become permanent target configuration or proof of family, competence, independence, availability, or authority.

If the freeze record is absent or mismatched, Kimi must return `inconclusive`. If Kimi findings cause a material edit, the edited text is a successor and requires a new freeze and fresh Kimi review.

## Review scope

Kimi checks:

- exact packet membership, identities, and freeze agreement;
- traceability to accepted high-level-design Draft 11 and accepted overall-roadmap Draft 12;
- separate treatment of coding/application Draft 2;
- Sol authorship and advice, Terra implementation, and Sol’s non-independent review of Terra’s result;
- Kimi’s exact-plan-only external review role before Human Review;
- current-versus-target and construction-versus-permanent-role separation;
- complete coverage of accepted agent and skill dispositions;
- preservation of current live contracts and current `as-is.md` authority;
- explicit exclusion of task-control, process-adapter, reservation, launcher, fixture, setup, provider, benchmark, adoption, retirement, commit, and merge implementation;
- protected inputs, gates, acceptance conditions, deterministic validation, recovery, escalation, and gate-time unknowns;
- the provider-free boundary and unresolved mandatory live agent-validation requirement;
- no invented model, provider, holder, budget, API, schema, staging mechanism, or authority; and
- `startsWork: false`.

## Review-order rule

The required order is:

1. Sol-authored packet materialization.
2. Caller-owned exact freeze.
3. External Kimi review of the same frozen packet.
4. Human Review of that same revision.
5. Separate kick-off and exact task-control admission.
6. Terra candidate implementation.
7. Deterministic provider-free validation.
8. Sol’s explicitly non-independent review of Terra’s result.
9. Any triggered independent review.
10. Separately authorized live behavioral validation and later adoption decisions.

Neither Kimi review nor Human Review has occurred for this packet.

## Required Kimi result

Return exactly these sections:

1. `Verdict`
2. `Scope and identity`
3. `Observed reviewer identity and limitations`
4. `Evidence`
5. `Blocking findings`
6. `Non-blocking findings`
7. `Recommendation`
8. `Residual risk`
9. `Authority statement`

The verdict must be `ready`, `revise`, or `inconclusive`. It is advisory only.

## Safe next action

Materialize the exact packet, compute and record its caller-owned freeze identity, and obtain the mandatory external Kimi review using `review-instructions.md`. Do not present the packet as Kimi-reviewed or Human-reviewed until separate records establish those events.

`startsWork: false`

---
