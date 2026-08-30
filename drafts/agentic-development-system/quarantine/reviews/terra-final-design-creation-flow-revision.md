# Terra final design-creation-flow revision

This advisory, read-only Terra revision was produced in Pi session `2026-08-23T19-20-42-316Z_5c884426-a178-4596-a124-4223c3119ee2` using model `openai/gpt-5.6-terra` under the canonical read-only `expert` contract. It is not target-contract authority, task authority, human approval, or implementation authorization.

## Verdict and readiness

**Ready for a fresh independent Sol review.** This is an advisory revision, not human approval, target-contract adoption, task authority, or implementation authorization.

**Recommended strategy:** staged heavy refactor. Retain the evidence-bearing task-control, deterministic-validation, parent-integration, launcher, recovery, and fixture substrate while revising agent, workflow, skill, setup, evaluation, and migration contracts in bounded stages.

A **total rewrite** is separately approvable if controlled evidence shows replacement has lower total risk or cost or better target fit, including compatibility complexity, migration cost/risk, maintenance burden, safety, isolation, recoverability, persistent correctness failures, or evaluation results, even if the current substrate is technically capable.

## Disposition of prior objections

- **Program target versus bounded implementation unit:** resolved. The complete target is designed at program scope; only separately authorized bounded units may implement it.
- **Bounded-unit design completion:** resolved. A unit may start only when required base records for every created, changed, retired, or unresolved-design dependency are available, linked, current, and approved by the then-current user/reviewer.
- **Path A and current/planned distinction:** resolved. Current `as-is.md` records remain current-state authority; a frozen revisioned target-design package remains the interim planned-state representation.
- **Design-changing feedback:** resolved. It triggers supersession or revocation before launch, checkpoint and escalation during work, or a new design proposal after accepted work.
- **Mixed agent, workflow, human, validator, and fixture categories:** resolved through frozen namespaces and the sole ledger below.
- **Missing thinking-companion and design facilitation:** resolved through retained facilitation and an explicit workflow and human-role boundary.
- **Missing setup, semantic-review, evaluation/scoring, and migration ownership:** resolved as explicit workflow and human-role targets with holder status in the ledger.
- **Incomplete live-agent, fixture, and live-skill coverage:** resolved in the single ledger.
- **Duplicate target dispositions and split/composed migration ambiguity:** resolved. Each target identifier occurs once; retained sources map once, while extractions and compositions are new-target rows that name their retained target inputs.
- **`as-is-setup` conflation:** resolved. It remains documentation adoption; consuming-project setup is separate and may use it only for record adoption.
- **`integrate-as-is-documentation` and host setup conflation:** resolved. They remain distinct from each other and from consuming-project setup.
- **Unverified deprecation:** resolved. No current source has a deprecation trigger because no verified consumer inventory exists.
- **Skill catalog treated as adopted:** resolved. The ledger classifies proposed contracts as retained/adapted, required boundary, candidate, later extraction, or deferred; none is created or adopted by this proposal.
- **Alternate reviewer selected without provenance:** resolved. No concrete reviewer, provider, model, or family is selected.
- **Rewrite criterion too narrow:** resolved by the broad criterion stated above.
- **Self-application and anti-self-authorization:** resolved as proposed controls only; runtime enforcement remains untested.
- **Multiple comparison contracts and vague equality wording:** resolved by the sole contract in “Exact setup and benchmark contract.”
- **Implementation-boundary permitted differences:** resolved through a finite, individually enumerated manifest rule with no wildcard, directory-wide, inferred, transitive, or unlisted difference.

## Scope, lifecycle, and authority

The complete target is an agentic development system in which humans retain feature intent and design judgment while admitted agents perform bounded evidence-bearing work with deterministic validation, semantic review, receiving integration, setup support, migration controls, workflow evaluation, feedback handling, and recovery.

The target includes a repository-local mock consuming-project proof. It does not claim package publication, independent installation, distribution, multi-project isolation, security isolation, credential-bearing work, or external effects in the first slice.

The complete target may be realized through multiple bounded implementation units. A target package, benchmark result, backlog item, review verdict, or migration table never authorizes implementation.

Use **Path A** while current and planned states remain distinguishable. Current `as-is.md` records remain current-state authority; the interim planned state is a frozen, revisioned target-design package linked from affected current records. A later bounded record-contract unit may add explicit current, approved-target, and design-relationship sections. Task records remain the sole active implementation authority.

**Design-changing feedback** changes what is built, who it serves, required behavior, exclusions, allowed risk or external effects, or the success judgment. Before launch it supersedes or revokes the target revision and blocks launch; during work it checkpoints and escalates; after accepted work it creates a new design proposal or bounded corrective path.

## Normalized target categories and ownership

Production agents, workflow assignments, human roles, deterministic validators, and fixtures are separate categories. `thinking-companion` is retained as the human-facing design facilitator. Setup ownership, evaluation/scoring ownership, migration ownership, semantic review, and integration ownership are explicit workflow responsibilities with accountable-holder status. Unconfirmed holders must be appointed before relevant use.

The first slice omits a dedicated design/prototyping group. The initial composition uses the intake/design-status router and `thinking-companion`; a separate group requires evidence of overload, authority confusion, or untestable ownership.

## Canonical ledger contract

The canonical target and migration ledger uses exactly these seven columns and is the sole source of disposition:

| Exact source | Exact target | Compatibility period | Identified consumers and migration condition | Validation | Deprecation trigger | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |

Target identifiers use frozen namespaces such as `target-agent/<name>-v1`, `target-workflow/<name>-v1`, `target-human-role/<name>-v1`, `target-validator/<name>-v1`, `target-fixture/<name>-v1`, and `target-skill/{reusable,master}/<name>-v1`. Filesystem paths are source identifiers, not target identifiers. No current contract has a deprecation trigger because no verified repository-wide consumer inventory exists.

The ledger covers all seven production agents plus the `agent-capability-probe` fixture, all 17 live skills, all 28 proposed reusable entries, all 14 proposed masters, workflow assignments, human roles, deterministic validators, and fixtures. Each target identifier occurs once. Retained sources map once; new extraction or composition rows explicitly name retained inputs without creating conflicting source dispositions.

`as-is-setup` remains the retained/adapted project or directory documentation-adoption contract. `target-skill/reusable/setting-up-consuming-projects-v1` is a separate consuming-project setup capability and may compose `as-is-setup` only for record adoption; it never replaces it and never means package installation. `integrate-as-is-documentation` and `core/adapters/host-setup` remain distinct.

## Setup and exact benchmark contract

Setup is part of the target. The first proof is repository-local and makes no package-installation or distribution claim. A separately owned committed mock-project seed produces current and candidate copies in different directories. Copies must not share mutable configuration, records, sessions, traces, temporary state, credentials, worktrees, validators, scorer state, rubric state, or generated artifacts.

The isolated workflow comparison has one authoritative exact-equality contract. Each paired run freezes exactly the provider; model identifier/version; complete model configuration, routing, and generation parameters; budget; retry policy; rubric version; validator identities/versions; host/runtime identities/versions; feature goal; seed revision; risk envelope; no-credential/no-external-effect policy; case matrix; acceptance tests; fixture-control version; and scoring procedure. Only the pinned system revision and system-specific setup, design derivation, workflow routing, task preparation, semantic-review routing, and recovery procedures may differ. If a protected input differs, the run is a matched-stratum comparison with every difference named and no isolated causal claim, or a non-isolated descriptive comparison with every confounder named and no isolated causal claim.

The implementation-boundary comparison freezes the baseline and candidate revisions, seed, approved design revision, bounded task revision, acceptance tests, validator identities/versions, capability profile, provider/model/configuration, host/runtime, budget, retries, semantic-review rubric, failure injection, risk envelope, no-external-effect policy, case matrix, fixture controls, scoring procedure, and result-record version. Its sole permitted differences are the finite, individually named implementation, delegation, semantic-review, and recovery paths; no unlisted or inferred difference is allowed.

## Self-application and alternate reviewer

Candidate changes are bootstrapped by the current task-control and launcher substrate, not by the candidate mechanism being created. Workers cannot write aligned design, admission, baseline, seed, validator, scorer, or benchmark controls. Independent semantic review and evaluation are required; passing results never self-adopt the candidate. The active branch is the candidate/recovery boundary, `master` is only a pinned evaluation baseline, and no separate rollback subsystem is proposed absent evidence.

No concrete alternate reviewer or model family is selected. Selection requires a named risk, exact primary configuration, authorized shortlist, authoritative family provenance, bounded local trial on sanitized evidence, comparison of valid findings and false claims, uncertainty/cost/latency review, and accountable human selection.

## First slice and next gate

The recommended first slice is a new low-risk mock application feature with deterministic acceptance, no network, credentials, deployment, publication, deletion, or external effects. Existing simple backlog items remain permissible if they satisfy the same controlled comparison.

The next gate is a human-facing target-design package. It must be reviewed by the Terra-Sol ping-pong before being presented to the user. After user alignment, a separate design-derived build plan must be prepared and sent through another fresh Sol review before any implementation authorization is considered.

## Explicit authority statement

This Terra revision is advisory. It does not authorize implementation. A future Sol approval will not authorize implementation; it will only determine whether the current design artifact or later build plan is ready for the next human-facing stage. Implementation requires explicit user alignment, approved base design records for the selected bounded unit, confirmed required accountable holders, adopted design-link/currentness controls, and separate explicit task authorization.
