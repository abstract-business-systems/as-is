# Sol re-review — advisory, read-only

## Verdict

**Approve** the reconciled architectural direction for limited human design-direction approval.

Terra has resolved or proportionately narrowed the prior architectural objections. The proposal is coherent as a low-risk, repository-local first slice: Path A is the default, Path B is exceptional, orchestration remains agent-owned, escalation bubbles through callers to the applicable orchestrator, root designs receive human alignment while derived leaves receive risk-based review, and implementation results require deterministic and semantic review.

This approval ends the architectural ping-pong unless Terra materially changes the proposal. It does **not** adopt target contracts, approve a design, authorize a task, or authorize implementation.

**Implementation may not proceed yet.** The remaining human decisions, an aligned root design package, and the minimum launch controls must exist first.

## Prior-objection-disposition

| # | Prior blocking issue | Disposition | Evidence and rationale |
| --- | --- | --- | --- |
| 1 | No design-workflow owner | **Narrowed/deferred** | Terra now places human escalation and workflow coordination with the applicable orchestrator and component execution with `component-builder`. This matches the agent-owned authority documented in `agents/as-is.md` and `skills/as-is.md`. The concrete orchestrator and accountable human must still be named for each workflow before launch. |
| 2 | Design alignment not mechanically enforceable | **Resolved in architectural principle** | Terra requires a lightweight deterministic pre-launch currentness and task-link check and rejects post-implementation audit as the sole control. The exact task-control representation remains an implementation-design prerequisite. |
| 3 | Implementation could mutate its aligned design | **Narrowed/deferred** | Terra requires a durable versioned design reference, provenance for derived artifacts, and prohibits implementation agents from revising the design they cite. The first slice must make the aligned root package and benchmark fixtures outside the worker’s writable scope. |
| 4 | Incomplete implementation-result review contract | **Resolved** | Every success, failure, timeout, budget stop, and partial result receives actual diff/artifact review, deterministic evidence, semantic disposition, residual-risk recording, and parent-owned integration. Worker self-acceptance is prohibited. |
| 5 | Capability isolation too weak for broad autonomy | **Narrowed/deferred** | Terra appropriately narrows the first slice to one low-risk component, isolated worktree, no credentials, no external effects, and no silent CWD fallback. Strong read/filesystem sandboxing remains later hardening. The child environment must still be proven credential-free before launch. |
| 6 | Global tool availability conflated with admission | **Resolved** | The executing agent chooses only among tools admitted by fixed policy, host policy, role, and task. Skills cannot enlarge capabilities. This agrees with current agent, skill, tool, and launcher records. |
| 7 | First slice covered only a happy path | **Resolved** | The evaluation now includes normal work, missing dependency, stale/revoked design, failed or budget-stopped recovery, and adversarial scope/instruction cases. |
| 8 | Installation decision deferred too far | **Narrowed/deferred** | Repository-local dogfooding may proceed without external-consumption claims or distribution-facing changes. Package, compatibility, project isolation, upgrade, and rollback design is required before distribution work. This is proportionate to the first slice. |
| 9 | Benchmark lacked a decision rule | **Resolved** | Terra predeclares safety-critical failure handling, normal-case verification, required safe stops, recoverable failed-work disposition, and a review-burden condition. Fixtures and scoring are outside candidate control. |
| 10 | OpenRouter benchmark dependency unverified | **Resolved with bounded uncertainty** | The benchmark and Data APIs are accepted as valid external evidence sources. Current fields, terms, model identifiers, routing, retention, and endpoint behavior still require verification at authorized retrieval time. Provider evidence remains screening input, not approval authority. |
| 11 | Self-application allowed self-authorization | **Resolved in architectural principle** | Terra preserves the existing control path as rollback, keeps candidate benchmark fixtures outside candidate control, forbids merging candidate control-plane changes before review, and applies ordinary design, review, and recovery gates to self-application. |
| 12 | No migration or rollback boundary | **Resolved for the first slice; broader migration deferred** | Design linkage is additive, legacy tasks remain under existing rules when separately authorized, active work is checkpointed on revocation, retries cannot silently change model, scope, budget, or tools, and the current task/launcher path remains the rollback baseline. Exact schema migration is still required before broad adoption. |

No prior objection remains blocking to **human design-direction review**. Several remain launch prerequisites and therefore still block implementation.

## Strengths

- The proposal reuses the mature task-control, component boundary, validation, recovery, launcher, and integration substrate instead of creating a parallel orchestration system.
- The role model now matches repository guidance: agents orchestrate and hold authority; skills provide procedures; tools provide bounded operations.
- Escalation is properly hierarchical without assuming every caller may resolve every issue.
- Path A gives isolated workers a durable design basis, while Path B is retained for genuine atomic migration or candidate-review needs.
- Human review is concentrated at root intent and material change boundaries rather than imposed on every leaf artifact.
- Post-design and post-implementation feedback have distinct, traceable outcomes.
- The first slice separates controls that prevent irreversible or unauthorized work from later hardening that can be justified by evidence.
- Benchmarking evaluates safe refusal, recovery, review burden, and integration—not merely generated code or provider ranking.
- External-project consumption and self-application are not allowed to piggyback on a successful repository-local experiment.

## Remaining-blockers

These block implementation, not continued design work:

1. The user has not approved the lifecycle, design-completion boundary, accountable approver, or first-slice feature and risk envelope.
2. No human-aligned root design revision currently exists for the first slice.
3. No deterministically validated design-to-task reference and revocation/currentness check is yet identified in the current strict task-control representation.
4. The worker environment and capabilities have not been shown to exclude credentials and unauthorized external effects.
5. The first-slice reviewer, fixtures, scoring owner, baseline revision, and recovery reserve have not been named.
6. The bootstrap path for modifying task control must be explicit: enabling changes remain ordinary tasks under the current control plane and cannot claim that the new workflow validated itself.

## Narrowed-first-slice-requirements

The minimum proportionate first slice is:

- Path A with one frozen, versioned root design package.
- One accountable orchestrator and one accountable human approver.
- One low-risk, single-component software change.
- One `component-builder` coordinating one admitted worker or task implementer.
- A machine-checkable task reference to the aligned design revision.
- A deterministic pre-launch check that the design is aligned, current, available to the worker, and not revoked or superseded.
- An isolated worktree with no fallback to caller CWD.
- No provider or project credentials in the child environment.
- No network, deployment, publication, purchase, external communication, or other external effect.
- Tool choice limited to the admitted role/task/host capability intersection.
- The aligned root design, benchmark fixtures, and scoring rules outside the implementation worker’s writable scope.
- Actual diff/artifact inspection, acceptance-mapped deterministic checks, semantic review, and parent integration checks.
- One stale-design rejection exercise and one failed or budget-stopped recovery exercise.
- The existing workflow retained as the rollback path.

Full filesystem sandboxing, broad context materialization, external installation, multi-project isolation, hosted operation, and a dedicated design-agent group are not prerequisites unless the selected feature introduces a specific need.

## Required-user-decisions

Only three decision groups remain necessary now:

1. **Lifecycle and design completion**
   - Approve Path A as the default and Path B only for explicitly justified exceptions.
   - Recommended completion rule: a root target-state revision is human-aligned and the derived artifacts needed to specify the next bounded task are review-complete. Every possible leaf need not exist first.
   - Recommended interpretation: generated artifacts are “the implementation” only when the artifact itself is the intended deliverable. For software work, diagrams and mockups remain design inputs; verified code and resulting behavior are implementation.

2. **Accountable human approver**
   - Name the person, role, or group that owns design alignment, revocation, conflicting feedback, and material design decisions.

3. **First-slice selection and envelope**
   - Select the low-risk feature.
   - Approve the proposed envelope: one component, no credentials or external effects, isolated worktree required, deterministic stale-design prevention, and independent result review.

Path B exception criteria, the initial material-change rule, benchmark fixtures, and reviewer selection can use Terra’s proposed defaults unless the user wishes to override them.

## Authority-boundary-risks

- “Applicable orchestrator” must be a named workflow responsibility, not inferred from model identity or whichever agent happens to receive a message.
- The present front-face `as-is` agent is a router and must not silently acquire design, task, or implementation authority.
- For the first single-component slice, `component-builder` may coordinate design-to-task preparation and component delivery, but the aligned design and task record remain distinct authorities.
- A caller may resolve an escalation only within already granted scope. Escalation does not grant budget, tools, retries, design changes, or external-effect permission.
- Delegation handoffs should identify the responsible top-level orchestrator so escalation cannot circulate indefinitely between callers.
- Human design alignment applies to one design revision and scope. It does not imply release approval, specialist approval, security acceptance, budget expansion, or external-effect permission.
- Semantic review and integration may be performed by the receiving builder for low-risk work because it is distinct from the worker. Higher-risk work requires a stronger independent reviewer.
- Sol, Terra, OpenRouter rankings, benchmark winners, and this report remain advisory; none grants project authority.

## Security-and-safety-risks

- “No credential use” is insufficient if secrets remain inherited by the child. The first slice needs an allowlisted or otherwise demonstrably credential-free child environment.
- Worktree isolation protects Git working state, not home-directory reads, local sockets, network access, or unrelated tracked repository context.
- Shell or subprocess access can bypass nominal tool restrictions. The first slice should use a worker profile that does not admit such bypasses unless explicitly required and bounded.
- No post-implementation review can undo a deployment, publication, secret exposure, external message, or work launched against revoked intent. Those effects and stale launches must be prevented before execution.
- Provider benchmark responses are untrusted external data and must not become instructions or policy.
- Candidate self-modification of active task control, benchmark criteria, or rollback mechanisms would reintroduce circular authority.
- Current no-emitted-path and installation-isolation claims remain stronger than the reviewed runtime evidence; no broader privacy claim should be made from this slice.

## Context-boundary-risks

- Prompt-guided scope remains advisory. It is acceptable only for the approved low-risk, non-secret first slice.
- A child created from committed `HEAD` must be able to resolve the exact aligned design revision; conversational or uncommitted design state is insufficient.
- Path B cannot leave the only authoritative design on a mutable branch unavailable to isolated workers.
- Missing dependencies must produce a stop/escalation rather than broad exploratory access or invented assumptions.
- Root and leaf provenance should identify the root design revision. Direct human review is required only when a leaf changes root intent, acceptance meaning, risk, architecture, external effect, or a human-visible trade-off.
- Drafts, backlogs, changelogs, model output, telemetry, and provider data remain context, not task or architecture authority.

## Implementation-review-requirements

Every implementation outcome must receive a recorded review, including success, refusal, failure, timeout, budget stop, and partial work.

For the first slice, the review must:

1. Identify the design revision, task revision, attempt, source revision, and candidate result.
2. Confirm that alignment was current at launch.
3. Inspect the actual diff or resulting artifacts.
4. Map acceptance conditions and relevant design invariants to controlled evidence.
5. Run or independently observe the smallest relevant deterministic checks.
6. Detect removed, skipped, narrowed, or weakened tests where applicable.
7. Examine unexpected scope, dependencies, generated files, configuration changes, and attempted external effects.
8. Record `accepted-for-integration`, `rework-required`, `escalated`, `rejected`, or `recovery-required`.
9. State residual risk, omitted checks, recovery state, and whether human re-alignment is needed.
10. Require the receiving builder to revalidate the integrated result.

The task implementer may not accept or integrate its own result.

## Benchmark-review

The reconciled protocol is architecturally sound for an initial evaluation.

Use separate workflow and implementation-boundary experiments, with:

- pinned baseline and candidate revisions;
- frozen designs, fixtures, validators, model/provider settings where available, budgets, retry policy, and rubric;
- normal, missing-dependency, stale-design, failed-recovery, and adversarial-scope cases;
- repeated paired runs sufficient to reveal gross variance, without unsupported statistical claims;
- provider-reported cost kept distinct from estimated or unavailable cost;
- candidate-inaccessible fixtures and scoring rules;
- predeclared safety-critical failures and retain/revise/reject criteria.

A candidate should not advance after any unauthorized external effect, stale-design launch, fixture manipulation, or unsafe completion. Safe refusal or escalation is preferable to apparent success outside authority.

OpenRouter benchmark and Data APIs may inform model and alternate-reviewer shortlisting. Their live semantics, provenance, terms, retrieval time, model identifiers, and routing should be recorded when used. Local project evaluation remains decisive.

## Installation-and-consumption-review

Repository-local dogfooding is acceptable for the first slice because the slice does not claim external-project support and should not modify packaging or distribution boundaries.

Before distribution-facing implementation or an external-consumption claim, the project must select and validate a boundary such as a versioned immutable bundle/package with thin host adapters, project-local design/task/configuration records, and host-private project-partitioned runtime state and credentials.

That later stage requires clean-project installation, dependency closure, consent, version compatibility, upgrade, rollback, uninstall, two-project isolation, and unsupported-host failure tests. The current host-setup adapter and repository-oriented extension wiring do not prove those properties.

No installation decision is required from the user for the first internal slice unless the selected feature touches packaging, adapters, or state placement.

## Agent-and-model-roster-review

The initial roster can remain small:

- accountable human approver;
- applicable workflow/component orchestrator;
- `component-builder`;
- bounded `worker` or equivalent task implementer;
- existing deterministic validation and, where useful, `evidence-validator`;
- receiving builder or distinct reviewer session for semantic review.

A separate prototyping/design group is optional and should be added only if evidence shows that the initial orchestrator cannot produce clear design packages without collapsing responsibilities.

Sol, Terra, and Luna remain review labels or model assignments, not target-system authority roles. Model choice should follow task risk and local evaluation. OpenRouter data may shortlist candidates but cannot appoint an agent, grant tools, or approve work.

## Target-system-contract-status

The following contract requirements are architecturally coherent and recommended for adoption:

- versioned design revision and attributable human alignment;
- design-to-task linkage;
- deterministic launch admission and stale/revoked-design rejection;
- design revocation and active-work checkpointing;
- per-attempt capability admission;
- result identity, semantic disposition, and parent integration;
- project-local authority and future consumption isolation;
- additive migration and rollback to the current control path.

They are **not adopted contracts** merely because Terra or Sol described them. The accountable repository owner must adopt their durable representation.

The current task protocol is a suitable substrate, but its strict schema means the design reference cannot be introduced as an unknown field or informal prose while still being called mechanically enforced. The smallest preferred direction is an owner-approved task-schema extension or an equally deterministic task-control-owned reference—not a parallel task system.

For current/target representation:

- Keep current implemented architecture authoritative in `as-is.md`.
- Prefer a separate versioned target design package as the aligned Path A authority.
- An `as-is.md` may summarize or link a proposed target state if clearly labelled, but should not conflate proposal, alignment event, active task state, and current behavior.
- After successful integration and adoption, reconcile the relevant `as-is.md` current-state description with the implemented architecture.

## Required-revisions

Before implementation authorization is requested:

1. Record the three user decision groups above.
2. Prepare and align the first-slice root design package.
3. Define the deterministic design-reference/currentness check and its bootstrap path under the existing task-control authority.
4. Name the workflow orchestrator, human approver, task owner, reviewer, integration owner, and benchmark scorer.
5. Define the first-slice child environment and capability profile, including credential exclusion and external-effect denial.
6. Place the aligned design, benchmark fixtures, and scoring rules outside worker-writable scope.
7. Pin the baseline, acceptance checks, recovery reserve, and rollback point.
8. Use the separate-target-package/current-`as-is.md` treatment above unless the repository first adopts a revised canonical-record contract.

These are bounded completion conditions, not a request for another broad architectural redesign.

## Alternate-reviewer-recommendation

An alternate-family review is **not required before a low-risk first internal slice** if the narrowed controls are met.

It is recommended before broader autonomy, credential-bearing work, external effects, distribution to other projects, or claims of security isolation. The reviewer should focus on capability security, child-environment isolation, benchmark gaming, package supply chain, project separation, and self-application. It remains read-only and advisory.

## Residual-uncertainty

- This review did not execute tests, inspect runtime environments, invoke Pi, validate Git history, or contact OpenRouter.
- Current records describe the intended control plane, but runtime conformance was not independently reproduced.
- The exact design-link serialization and bootstrap migration are undecided.
- The first feature, human approver, model assignments, benchmark fixtures, and baseline revision remain unselected.
- Prompt-guided context discipline may prove inadequate for some later tasks.
- Content and general-task workflows may need materially different artifact and verification semantics.
- External package consumption and project isolation remain unproven.

## Explicit implementation statement

**Implementation may not proceed at this time.**

The reconciled architecture may proceed to the three limited user decisions and preparation of the human-facing root design package. Implementation may be considered only after explicit user alignment, adoption of the minimum design-to-task and launch controls, and creation of a separately authorized bounded task. This advisory report cannot supply that authorization.
