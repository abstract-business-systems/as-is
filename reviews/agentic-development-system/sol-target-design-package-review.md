# Sol review of target-design package draft-2

This advisory, read-only review assessed the repaired target-design package against the canonical handoff, current records, repository instructions, `drafts/composable-skills.md` as non-authoritative direction, and Terra’s package review. It does not adopt target contracts, create tasks, authorize implementation, or approve user presentation.

## Verdict

**Revise before the alternate-family review.** The package is directionally sound and closes most of Terra’s findings, but it is not yet a reliable frozen review artifact.

## Strengths

- The package clearly separates current architecture, proposed planned state, human alignment, and implementation authority.
- Path A and bounded implementation-unit readiness are stated consistently.
- The first slice is appropriately repository-local and excludes task-facing credentials, external effects, package/distribution claims, and security-isolation claims.
- The authority model distinguishes router, orchestrator, worker, validator, semantic reviewer, integration owner, evaluator, and human responsibilities.
- Current agents and skills are preserved; the router is correctly retain-and-adapt by default.
- The migration ledger now contains 28 reusable and 14 master target identifiers without duplicate target IDs in the canonical reference scan, and it separates new additions from false draft headings.
- Setup and evaluation define protected controls, declared writes, cleanup/recovery, finite differences, a weighted rubric, and a single-run feasibility classification.
- Grok is correctly treated as an external conditional review gate rather than a production role.

## Blocking issues

### 1. Revision identity remains inconsistent

`target-design.md` and `review-manifest.md` identify `target-design-v1-draft-3`, while `migration-ledger.md`, `setup-and-benchmark.md`, `decision-log.md`, and the component documents still contain `target-design-v1-draft-1` or `target-design-v1-draft-2` references. The decision log says the package was repaired after Terra’s first review, but it does not consistently identify the current review revision. The frozen digest table also describes an earlier snapshot and is not recalculated after edits.

A review cannot establish which package revision it assessed until every package file uses one revision and the manifest’s listed digests match that exact snapshot.

### 2. Master proposal coverage is still not mechanically auditable

The ledger has 14 master target IDs, but several actual master headings from `drafts/composable-skills.md` are represented only as proposal-input text attached to live rows, while `as-is-setup` and `integrating-as-is-documentation` are live-only target rows. This may be a valid merge strategy, but the package does not provide a machine-auditable mapping that proves each of the 12 exact draft master headings appears once and only once as a master proposal input.

The `drafts/composable-skills.md#designing-mermaid-diagrams` input was missing from the earlier version and must be explicit. The package should include a normalized inventory table with category, exact source, exact target, and classification, separate from disposition rows, or otherwise define a normalization rule that a checker can apply.

### 3. The design-workflow orchestrator remains an unresolved category

`agent-roster.md` still lists `target-agent/design-workflow-orchestrator-v1` as a possible production target, while the ledger has no corresponding target-agent row and has `target-workflow/design-orchestration-v1`. The phrase “if a distinct contract is approved” is not enough for a frozen target design. Choose workflow assignment only, or add a complete new agent target and ledger row. Do not leave both possibilities in the target roster.

### 4. Component templates are improved but still incomplete

The component-design documents do not all provide the same explicit headings and fields required by the handoff. In particular, they lack consistent explicit sections for inputs/outputs and consequential flows, relationships and authority, open decisions/dependencies, and acceptance/validation. A reader must infer some of these from prose. The package should standardize the headings and keep disposition detail linked to the ledger.

### 5. Benchmark manifest and rubric remain prose-level

The package names a run manifest and required fields, but does not provide a concrete record shape or validity rules for:

- run identity and revision;
- baseline and candidate revision fields;
- protected inputs and their digests/references;
- finite permitted-difference entries (`id`, owner, rationale, source, effect);
- missing/unavailable fields;
- invalidation when a manifest changes;
- result linkage and retention.

The rubric provides weights and a threshold, but case-level and repeated-run aggregation remain underspecified. It does not define whether every case is mandatory, how blocked/unknown cases enter the score, how a deterministic/semantic disagreement is scored, or how an extension beyond three runs is approved. A single canonical rubric table and aggregation procedure is needed.

### 6. Setup ownership still has conflicting language

The package uses “setup owner,” “evaluation owner,” “fixture owner,” and “evaluator/scorer owner” without one authoritative resource-to-owner matrix covering every create/read/write/remove/preserve action. The reader cannot determine who may create the current and candidate copies, who may clean them up, who preserves a failed recovery copy, or who owns run manifests and result records.

### 7. Grok gate lacks a concrete decision threshold and evidence location

The gate lists useful trial measures but does not define the bounded trial record, required provenance evidence, acceptance threshold, inconclusive outcome, or the durable location of the human confirm/replace/reject decision. The gate must remain conditional, but the condition needs to be executable and auditable.

## Required revisions

1. Normalize all package files to `target-design-v1-draft-3`, update the state narrative, and regenerate the non-manifest digests after final edits.
2. Add a normalized 24 + 4 reusable and 12 + 2 master inventory or equivalent exact mapping that a checker can audit independently.
3. Resolve the design-workflow orchestrator as a workflow assignment only, or add its complete target-agent row; do not retain an unresolved dual category.
4. Apply one explicit component-design template to all four component files: purpose/users, current reference, planned boundary, relationships/authority, inputs/outputs/consequential flow, migration mapping, acceptance/validation, and open decisions/dependencies.
5. Define the manifest record shape, owner, storage identity, protected inputs, finite difference-entry fields, missing-field behavior, revision invalidation, and retention/recovery behavior.
6. Define one canonical case and repeated-run aggregation rule, including mandatory cases, unknown/blocked treatment, review disagreement, extension authority, and cost-unavailable treatment.
7. Replace conflicting setup ownership prose with one complete owner/action matrix and explicit logical resource references.
8. Define Grok trial evidence location, provenance requirements, bounded budget, minimum/qualitative pass rule, inconclusive handling, and human decision recording.
9. Re-run the consistency checks after these changes, then send the exact new frozen package to Grok. Do not present the package to the human yet.

## Residual uncertainty

The exact feature, seed, revisions, holders, future current/planned record contract, runtime enforcement, Grok provenance, and external consumption behavior may remain unresolved. They must be labelled as unresolved rather than implied by the package. Implementation remains unauthorized.
