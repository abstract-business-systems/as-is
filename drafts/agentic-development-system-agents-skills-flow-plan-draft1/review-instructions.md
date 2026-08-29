# External Kimi Review Instructions — Agents/Skills Flow Plan — Draft 1

Purpose: Define one bounded, read-only external Kimi review of the exact frozen Sol-authored agents/skills plan before Human Review.

## Review boundary

Review only the exact frozen packet under:

`drafts/agentic-development-system-agents-skills-flow-plan-draft1/`

The packet must contain exactly:

- `plan.md`
- `decision-brief.md`
- `review-manifest.md`
- `review-instructions.md`

Use the caller-owned freeze record to identify the exact bytes. Do not substitute the authoring response, accepted Draft-11 target design, accepted Draft-12 roadmap, coding/application Draft 2, a predecessor, a successor, an implementation result, or an excerpt for the frozen packet.

The accepted sources and current anchors may be read only to verify traceability, factual consistency, and link targets. The assessed object remains the exact frozen agents/skills packet.

## Reviewer role and authority

Act only as the externally assigned Kimi plan reviewer for this construction exercise.

This review is advisory and read-only. Do not edit files, create tasks, launch or delegate workers, contact another service, select permanent models or providers, approve the plan, conduct Human Review, authorize kick-off, authorize implementation, run setup, make a security determination, execute a benchmark, migrate or adopt contracts, retire artifacts, commit, merge, release, integrate a result, or close work.

State the observed reviewer/model identity and its provenance limitations. Do not treat a role label, model string, family label, route, or caller assertion as permanent configuration, proven independence, competence, availability, or authority.

## Review question

Does the exact frozen Sol-authored packet provide a complete, bounded, provider-free candidate agents/skills realization plan that preserves current contracts, covers the accepted Draft-11 dispositions, follows the accepted Draft-12 Sol→Kimi→Human→Terra sequence, keeps deterministic validation and semantic review separate, and honestly stops before live validation and adoption?

## Required checks

### Identity and provenance

- Confirm the exact four-file membership.
- Confirm agreement with the separate freeze record and individual file identities.
- Confirm the recursive digest includes exactly `plan.md`, `decision-brief.md`, and `review-instructions.md`, with `review-manifest.md` directly verified and excluded.
- Confirm `sha256-path-digest-v1` is defined unambiguously.
- Return `inconclusive` if the freeze record is absent, membership differs, or identities mismatch.
- Confirm accepted high-level-design Draft 11 is identified by target-design SHA-256 `abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836` and packet digest `8601188128ed2fff4aa64f75f339f7962e88358806f470643aa8455f565665e2`.
- Confirm accepted overall-roadmap Draft 12 is identified by packet digest `797ed521be694c36d08398a50e1fa17ea6c37c19b507d3fb557834413ac98124`.
- Confirm coding/application Draft 2 is separate, identified by packet digest `5382e6c727abc7a362d74a2d3bab024689c8a81be3329ff0398ba4b62c0390e0`, and its durable acceptance-state discrepancy is disclosed rather than concealed.
- Do not reconstruct unavailable evidence.

### Review-path separation

Confirm all of the following:

- Sol is the agents/skills plan author and implementation adviser.
- Sol is not represented as an independent reviewer of its own plan.
- External Kimi reviews the exact frozen plan packet before Human Review.
- Kimi’s review cannot approve the plan or authorize implementation.
- Human Review decides the same exact frozen revision after Kimi review.
- A material edit requires a successor, new freeze, and fresh Kimi review.
- Terra implements only after separate kick-off and exact task-control admission.
- Sol reviews Terra’s actual result and explicitly labels that review non-independent.
- Deterministic validation remains separate from Kimi review, Human Review, Sol advice, Sol result review, process exit, model confidence, and integration.
- Kimi is not an implementation-result reviewer, deterministic validator, integration owner, or completion authority by default.
- No Kimi or Human Review of this packet is claimed to have occurred.

### Scope and current-contract protection

- Confirm the plan covers agents and skills only.
- Confirm current `as-is.md`, `agent.md`, and `SKILL.md` contracts remain authoritative and unchanged outside an isolated, non-consumed candidate boundary.
- Confirm `.agents/` is not modified or used to activate the candidate.
- Confirm candidate resources cannot be installed, projected, selected, or launched under this plan.
- Confirm task-control, process-adapter, reservations, parent closure, sibling concurrency, child-result integration, launcher implementation, and fixtures are not redesigned.
- Confirm setup, provider-backed execution, credentials, network access, security approval, benchmark execution, migration execution, adoption, retirement, commit, merge, and release are explicit non-goals.
- Confirm newly discovered component or authority scope stops and escalates rather than expanding silently.

### Agent disposition completeness

Confirm explicit treatment for:

- modifying `as-is` while keeping it non-implementing;
- retaining and conditionally adapting `component-builder` without activating target integration mechanics;
- retaining and adapting `evidence-validator` as read-only;
- retaining `execution-advisor`;
- retaining and composing `expert`;
- preserving `thinking-companion` while recording only a deprecation candidate;
- preserving `worker` under the accepted deferred replacement decision; and
- preparing a provisionally named design/prototyping role without acceptance or implementation authority.

### Skill disposition completeness

Confirm the plan explicitly treats all seventeen current skills and the proposed `developing-target-designs`, `making-changes`, and `planning-realization` master skills.

Confirm additionally:

- no current skill is silently removed;
- standalone deprecation does not become retirement;
- contemplated renames require naming and consumer evidence;
- speculative reusable capabilities are not created without demonstrated consumers;
- skills never grant tools, role identity, task authority, launch authority, integration authority, commit authority, or completion authority; and
- current parent-side component-builder semantics remain intact until separate control-plane validation and adoption exist.

### Gates and acceptance

- Confirm freeze, Kimi review, Human Review, inventory, kick-off, task admission, candidate preparation, deterministic validation, Terra handoff, Sol result review, live-validation stop, and later adoption are distinct gates.
- Confirm protected inputs include accepted packets, current records and contracts, control-plane and fixture implementation, projected resources, validators, credentials, and unrelated files.
- Confirm acceptance covers traceability, compatibility, authority separation, non-removal, no permanent model/provider selection, deterministic negative cases, exact evidence, recovery, and honest residual risk.
- Confirm a missing planned candidate test is a blocker rather than permission to substitute another check.
- Confirm `startsWork: false`.

### Provider-free and live-validation boundary

- Confirm implementation and deterministic validation commands unset `PI_BIN` and disable live integration.
- Confirm no provider-backed implementation validation is claimed.
- Confirm local stubs and static tests are not represented as live behavioral validation.
- Confirm the packet acknowledges that `agents/AGENTS.md` requires real-provider live testing for changed agent contracts.
- Confirm the plan therefore stops before activation or adoption and leaves live validation to separately authorized work.
- Confirm mandatory external Kimi plan review is kept separate from implementation validation and does not satisfy the live behavioral test requirement.

### Recovery, escalation, and unknowns

- Confirm packet edits create successors and receive fresh Kimi review.
- Confirm failed candidate work leaves current contracts intact and preserves a bounded recovery checkpoint.
- Confirm no automatic retry, scope widening, budget increase, provider use, validator weakening, projection, adoption, or merge follows from failure.
- Confirm material accepted-envelope changes return to design and Human Review.
- Confirm model identities, providers, routes, holders, budgets, capabilities, task revisions, candidate staging, names, changed files, independent reviewer, live-test authorization, and adoption decisions remain gate-time unknowns.
- Confirm the authoring-role identity is stated only as an observation and not permanent target configuration.

## Required output

Return a concise report with exactly these sections:

### Verdict

Use one of:

- `ready`
- `revise`
- `inconclusive`

### Scope and identity

State the exact packet path, packet digest, freeze record, files reviewed, and whether identities were independently recomputed.

### Observed reviewer identity and limitations

State only observed identity evidence and its source. Do not select permanent configuration or claim family, competence, or independence proof.

### Evidence

List direct packet observations and distinguish them from inference or caller-supplied context.

### Blocking findings

List supported blockers, or `None observed`.

### Non-blocking findings

List bounded improvements or residual procedural issues that do not require a successor.

### Recommendation

Give the smallest safe next action. If a material repair is required, recommend a successor rather than editing the frozen packet.

### Residual risk

State what was not checked or cannot be established by plan review.

### Authority statement

State that the review is advisory, grants no Human Review decision or implementation authority, and does not authorize setup, provider use, security approval, benchmark, adoption, retirement, commit, or merge.

Do not claim that Kimi review or Human Review occurred merely because these instructions exist.

`startsWork: false`
