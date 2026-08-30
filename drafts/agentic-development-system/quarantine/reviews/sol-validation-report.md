## verdict

**revise**

Terra’s direction is substantially safer than a rewrite and correctly preserves the existing component task-control substrate. However, the approach is not yet safe to implement because design authority, task authorization, capability isolation, mandatory result review, installation boundaries, and benchmark decision rules remain underspecified or contradicted by current behavior.

**Implementation should not proceed.** Architecture reconciliation, alternate-family review, human-facing design preparation, and explicit user alignment may continue as advisory work. This report is advisory and does not authorize implementation.

## strengths

- Terra correctly identifies the existing task-record protocol, component boundaries, Pi launcher, deterministic checks, recovery evidence, and parent-owned integration as assets to retain.
- The proposed design-first layer addresses the largest functional gap: the current system controls component implementation but does not represent human prototypes, design alignment, feedback, or design supersession.
- The single-slice, incremental posture is preferable to the wholesale skill replacement suggested by the historical `drafts/design-realization-flows.md`.
- Terra maintains the distinction between roles, skills, tools, deterministic modules, adapters, and task authority.
- It accurately describes worktree isolation as protection for the caller’s uncommitted work, not read or security isolation.
- It correctly separates model branding from functional authority and treats OpenRouter data as evidence rather than approval.
- It preserves launcher results, model reports, telemetry, and process exits as observations rather than completion authority.
- It recognizes external-project consumption as an architectural concern rather than assuming the current setup adapter proves installability.
- Its proposed human-facing design package is a useful starting point, provided alignment is linked to immutable revisions and does not become a generic safety waiver.
- Its paired benchmark proposal identifies important confounders and correctly values safe escalation and missing-dependency detection.

## blocking-issues

1. **No authority-bearing design workflow owner is defined.** The current `as-is` agent routes requests, `component-builder` owns component delivery, and `expert` is advisory. None currently owns design revision, human alignment, conversion of aligned design into task authority, or revocation.
2. **The design-alignment gate is not mechanically enforceable.** A prose assertion that the user aligned is insufficient. Launch admission must fail closed unless it can verify a current aligned design revision and its relationship to the task.
3. **Aligned design is not protected from implementation-side mutation.** The design revision must be immutable or integrity-addressed for an authorized task. An implementation agent must not be able to edit the design it is claiming to realize and thereby make itself appear compliant.
4. **Every implementation result lacks a complete review contract.** “Receiving builder or Terra-equivalent reviews” does not establish reviewer independence, evidence requirements, handling of failed or partial attempts, test weakening, or who may accept versus integrate.
5. **Current capability isolation is too weak for the autonomy claims.** Worktree creation can fall back to the caller CWD, `--no-worktree` exists, children inherit the process environment, shell access can bypass nominal web-tool denial, and CWD is not a filesystem or network sandbox.
6. **Global tool availability is conflated with tool admission.** Tools may be globally installed or discoverable, but every attempt still requires a deterministic least-privilege allowlist and host safety profile. A skill’s ability to mention a tool cannot grant its use.
7. **The first vertical slice does not test enough of the claimed control loop.** One happy-path component change does not demonstrate safe delegation, rejection of stale alignment, review of a failed result, recovery, or integration.
8. **The installation decision is deferred too far.** Repository-local dogfooding is acceptable for the first experiment, but implementation that affects packaging, state placement, or adapters should not begin before the target consumption boundary is selected.
9. **The benchmark has no predeclared decision rule.** Metrics are listed, but there is no threshold for retaining, revising, or rejecting the candidate, nor a rule preventing post hoc metric selection.
10. **The OpenRouter “Benchmark API” dependency is unverified.** The repository contains no current contract or implementation for such an API. Exact model IDs, rankings, prices, endpoint semantics, data provenance, retention, and stability must not be assumed from drafts.
11. **Self-application has no anti-self-authorization boundary.** The system must not modify the active control plane, approve its own replacement, alter its benchmark, and judge its own success in one authority chain.
12. **The migration lacks a compatibility and rollback boundary.** There is no defined behavior for old tasks, in-flight attempts, design-linked versus unlinked tasks, configuration migration, or rollback after partial adoption.

## missing-requirements

- A durable, revisioned representation for goals, requirements, prototypes, structured or visual design, feedback, issues, alignment, revocation, and supersession.
- Deterministic rules distinguishing a clarification from a material design change requiring renewed alignment.
- A status model that humans can inspect without relying on private sessions, model narration, or telemetry.
- Provenance and integrity requirements for visual artifacts, generated diagrams, examples, and external design inputs.
- Accessibility and alternate textual representation requirements where visual material carries normative meaning.
- A risk classification that selects tool admission, isolation, review, specialist involvement, human gates, and external-effect policy.
- An explicit release and external-effects boundary. Passing repository checks must not imply authority to deploy, publish, purchase, contact services, or modify external systems.
- A policy for active work when design alignment is revoked: stop, block, cancel, preserve, or re-plan without automatically discarding partial work.
- A rule for concurrent feedback, conflicting human input, and identification of the accountable design approver.
- Task-level capability declarations covering filesystem scope, process execution, network access, credential classes, and irreversible operations.
- Controlled evidence capture that does not depend solely on implementation-agent-reported commands or file lists.
- A workload-extension boundary separating common goal/task/review semantics from software-specific Git, test, and component semantics.
- Installation prerequisites, supported hosts, dependency closure, configuration ownership, upgrade compatibility, rollback, and uninstall behavior.
- Credential provenance, redaction, child-process inheritance, provider scoping, rotation, and revocation rules.
- A benchmark fixture owner, corpus governance policy, contamination controls, scoring rubric, sample-size rationale, and stopping rule.
- A migration strategy for active task records and consumers that do not yet understand design linkage.

## authority-boundary-risks

- The draft sequence saying “Sol defines or approves” cannot itself grant Sol authority. Model identity is not authority; authority must come from an adopted role contract and accountable human or project policy.
- This advisory Sol pass cannot authorize target contracts or implementation.
- The current router has broad file and shell capabilities despite its lightweight routing narrative. Prompt intent alone does not prevent it from becoming an accidental implementation or task authority.
- `component-builder` combines implementation ownership, child integration, completion judgment, and commit preparation. This may remain acceptable for low-risk work only if an independent review gate controls acceptance.
- “Task management” owns important transitions in the protocol, but the proposed workflow does not identify the concrete authority that invokes it after design alignment.
- `call_subagent` is described as read-only assistance, while target tool declarations may preserve broader capabilities and any canonical target may be selected. Its name and stated posture should not be treated as an enforcement guarantee.
- Caller identity and lineage are intentionally diagnostic rather than admission gates. Therefore, deterministic task and capability admission must exist elsewhere before autonomous orchestration expands.
- Skills must remain procedures. They may describe how to draft, review, verify, or launch, but may not select agents, authorize transitions, approve designs, or accept results.
- Globally installed tools must remain unavailable to an attempt unless admitted by its role, task risk profile, and host policy.
- Human design alignment must approve only a specific design revision and scope. It must not imply budget approval, security acceptance, external-effect permission, release approval, or specialist sign-off.
- Integration authority and review authority must remain distinct. A reviewer recommends a disposition; the receiving owner integrates only when the deterministic gates permit it.
- A benchmark winner must not acquire architectural or rollout authority automatically.

## security-and-safety-risks

- The launcher currently builds the child environment from the parent environment. This can expose unrelated provider keys and other secrets to every child process even when prompts prohibit credential use.
- Shell capability can provide filesystem, process, network, and credential access beyond named agent-facing tools. Denying web tools does not deny `curl`, package hooks, subprocesses, or arbitrary local reads.
- Worktree creation currently permits degradation to the caller CWD. Autonomous implementation should fail closed rather than silently lose isolation.
- Worktrees isolate Git changes from the caller’s uncommitted work but do not isolate repository reads, home-directory reads, local sockets, environment variables, network access, or external side effects.
- Persisted sessions and local traces may retain prompts, source excerpts, identifiers, or provider data. Retention, access permissions, redaction, and project separation require explicit verification.
- The no-emitted-filesystem-path invariant is stronger than some current documentation examples and setup outputs. External-consumption claims must wait for owner-specific enforcement tests across handles, setup results, logs, registries, traces, and diagnostics.
- Setup uses links to canonical bundle resources. A changed bundle can therefore change a consuming project’s effective behavior without a project-local reviewed update unless the bundle is immutable and version pinned.
- Setup configuration and link creation are not demonstrated as one transactional, reversible installation.
- The fallback package runner may perform an external package installation during preflight. That effect requires explicit consent and supply-chain controls.
- Provider responses, benchmark metadata, model descriptions, and prices are untrusted external data and must not become prompt instructions or policy.
- Self-application could corrupt the active task-control or launcher path. Changes should be developed in an isolated fixture or candidate version with a known-good rollback controller.
- A model review is not sufficient for security-, privacy-, legal-, financial-, or production-critical work. Relevant human specialists must retain the required approval authority.

## context-boundary-risks

- Prompt-guided context discipline is advisory, not enforceable. Reported files read are useful diagnostics but not proof.
- Separate worktrees contain the repository snapshot and therefore expose unrelated tracked source unless sparse checkout, a sandbox, or a mediated read interface is used.
- The linked-context resolver provides bounded explicit context, but shell and ordinary read tools can bypass it.
- Children created from committed `HEAD` do not see uncommitted design or alignment material. A task must reference a durable, available design revision rather than conversational or uncommitted state.
- An implementation agent may lack a required dependency and either hallucinate it or explore broadly. Missing-context behavior must be a tested stop-and-escalate path.
- Over-pruning can hide architecture constraints; under-pruning can cause contamination and scope drift. Risk-based profiles are needed rather than one universal context strategy.
- Alternate reviewers should sometimes receive a restricted evidence package and sometimes a full-context package. These answer different questions and should not be conflated.
- Project-local sessions, traces, registries, and usage aggregates need project-scoped identities and permissions. A shared temporary registry is not sufficient evidence of tenant or project isolation.
- Context hashes and provenance should bind task launch to the design and policy revision actually reviewed.
- Historical drafts, backlog, changelog, model output, and telemetry must remain explicitly tagged as non-authoritative context.

## implementation-review-requirements

Every implementation-agent termination or handoff—including success, failure, timeout, budget stop, refusal, and partial work—must receive a recorded result review.

A review must:

1. Identify the task revision, aligned design revision, implementation attempt, source revision, and candidate result.
2. Verify that alignment remained current at launch and had not been revoked or superseded.
3. Inspect the actual diff or produced artifact rather than relying on the implementation report.
4. Map each acceptance condition and applicable design invariant to controlled evidence.
5. Run or independently observe deterministic checks from a trusted host boundary.
6. Detect removed, skipped, narrowed, or weakened tests and validators.
7. Review changed scope, unexpected dependencies, generated files, configuration changes, and external-effect attempts.
8. Distinguish product/design correctness from code-quality and mechanical checks.
9. Record one disposition: `accepted-for-integration`, `rework-required`, `escalated`, `rejected`, or `recovery-required`.
10. State residual risk, omitted checks, recovery state, and whether renewed human design alignment is required.
11. Require the integration owner to validate the integrated result again; child checks alone are insufficient.
12. Prevent the implementation agent from accepting its own result.

For ordinary low-risk work, a distinct receiving builder or reviewer session may perform semantic review. Architectural, cross-component, security-sensitive, migration, credential-handling, irreversible, or repeatedly failing work requires a stronger independent reviewer and, where applicable, a human specialist. Deterministic checks are mandatory but never the sole semantic reviewer.

## benchmark-review

Terra’s benchmark direction is useful but requires revision.

Use two separately identified experiments:

- **Workflow experiment:** compare the complete current workflow with the complete candidate design-first workflow from equivalent human goals. Equalize total resource budgets, not just implementation prompts.
- **Implementation-boundary experiment:** give both paths the same frozen aligned design and authorized task to isolate context, delegation, review, and implementation differences.

Required controls:

- Pin baseline and candidate revisions, host and adapter versions, model IDs, provider route where possible, thinking settings, budgets, retries, and validator versions.
- Use multiple representative tasks and repeated paired runs. One response per task is not sufficient.
- Include a normal change, a missing-dependency case, a required-escalation case, a failed-attempt recovery case, and an adversarial scope or instruction-injection case.
- Randomize run order and use blind or independently applied scoring where practical.
- Predeclare acceptance mappings, safety-critical failures, metric weights, and retain/revise/reject thresholds.
- Treat unsafe completion as worse than a safe refusal or escalation.
- Measure human review burden and integration rework, not only latency and model cost.
- Do not claim read isolation or scope-read compliance without host-observed evidence.
- Preserve provider-reported cost separately from estimates and unavailable observations.
- Keep benchmark fixtures and scoring rules outside the candidate agent’s writable scope.
- Do not let the candidate alter its own benchmark or evaluate only tasks used during its design.

OpenRouter model or benchmark information may be used only as time-bounded screening evidence after the actual endpoint, fields, provenance, terms, and availability are verified. It should help shortlist models by capability, context, latency, and cost; it must not select architecture, grant a role, or replace project-specific evaluation. Credentials should be supplied only to a dedicated, network-allowlisted selector process, never broadly inherited by implementation children. Persist only sanitized model metadata, retrieval time, and provenance—not credentials or raw sensitive responses.

## installation-and-consumption-review

Terra’s repository-local first-slice baseline is sound only as internal dogfooding. Its proposal to defer the distribution decision entirely is not sufficient for implementation sequencing.

The recommended target consumption model is:

- a **versioned, immutable bundle or package** containing canonical agents, skills, deterministic modules, and thin host adapters;
- **project-local configuration, component records, task state, designs, feedback, issues, and evidence**;
- **private host-local runtime state and credentials**, partitioned by project identity;
- explicit compatibility between bundle version, configuration schema, Pi version, adapters, and supported hosts.

This recommendation is architectural and advisory, not installation authorization.

Before claiming support for other projects, prove:

- installation from a clean consuming fixture without relying on this repository’s undeclared files;
- dependency closure and exact host prerequisites;
- dry-run planning, explicit consent, idempotence, conflict handling, transactional failure behavior, uninstall, and rollback;
- project-local override precedence without weakening fixed safety constraints;
- immutable or version-pinned resource references rather than mutable cross-project links;
- schema migration and downgrade behavior;
- isolation of sessions, traces, registries, temporary worktrees, usage records, and credentials between two concurrent projects;
- no copying or persistence of provider credentials into project files;
- unsupported-host and version-mismatch failure that is clear and non-destructive;
- package integrity and provenance appropriate to the distribution channel.

The current host-setup adapter is useful internal evidence, but symlink wiring and repository-oriented registration do not establish standalone package consumption. A hosted or multi-tenant control plane should remain out of scope until a concrete requirement justifies its substantially larger operational and security boundary.

## agent-and-model-roster-review

The Sol/Terra/Luna hierarchy should not be adopted as the target roster. Functional roles and model assignments must remain separate.

Minimum functional responsibilities are:

- **Design facilitator:** converts human input into reviewable visual and structured proposals; cannot align on behalf of the human.
- **Human design approver:** accountable human or project-defined human group; owns alignment, revocation, and material design decisions.
- **Workflow/task authority:** deterministically verifies alignment and creates or authorizes bounded tasks; cannot infer approval from model output.
- **Implementation agent:** performs one admitted task without self-approval.
- **Evidence collector/validator:** obtains controlled deterministic evidence without integration authority.
- **Semantic result reviewer:** compares actual results to design and task requirements.
- **Integration owner:** accepts eligible results into the parent boundary and reruns integration checks.
- **Recovery supervisor:** applies bounded retry, cancellation, and recovery policy without silently changing worker, scope, or budget.
- **Architecture or specialist reviewer:** advisory or approval-bearing only where an adopted policy explicitly grants that authority.

Existing roles can cover parts of this roster, but no current role clearly owns design governance or design-to-task authorization. A new role is justified only if responsibilities cannot be composed without collapsing authority boundaries.

Model selection should be empirical and task-risk based. Low price is not sufficient for implementation selection, and higher benchmark ranking is not sufficient for architectural or security authority. Record exact model/provider configuration for reproducibility while allowing project-local replacement when compatibility and acceptance evidence remain satisfied.

## target-system-contracts-defined-or-approved

The following are **architecturally required minimum contracts defined or conditionally approved by this advisory review**. They are not implementation authority, do not select a serialization format, and require adoption by the accountable repository owner.

### 1. Design revision and alignment contract — defined

A design revision must have:

- a stable project-local identity and revision;
- goal, requirements, assumptions, constraints, and non-goals;
- references and integrity evidence for visual and structured artifacts;
- feedback and issue disposition;
- material risks and unresolved decisions;
- supersession relationship;
- state: `draft`, `aligned`, `superseded`, or `revoked`;
- a separate human alignment event identifying the revision, approver, decision, scope, time, and conditions.

Alignment must be explicit and human-attributable. It cannot be inferred from silence, conversation continuation, model output, or task creation. A material design change creates a new revision and invalidates downstream launch eligibility until renewed alignment.

### 2. Design-to-task authorization contract — defined

The existing component task record remains the sole implementation-task authority. It must gain a deterministically validated link to:

- the aligned design revision and integrity evidence;
- acceptance conditions derived from that revision;
- risk and review class;
- permitted component and capability scope;
- any required specialist or human gates.

Because the current task schema rejects unknown core fields, this linkage requires an owner-approved schema evolution or another mechanically validated task-control-owned representation. A prose-only task narrative link is insufficient for launch admission.

### 3. Launch admission contract — defined

Launch must fail closed unless:

- design alignment is current;
- task revision and design revision match;
- component ownership and dependency boundaries are valid;
- the configured worker and model are admitted;
- tool, shell, filesystem, network, credential, budget, and external-effect policies are explicit;
- required isolation is available;
- required review capacity and recovery reserve exist.

No worktree fallback to caller CWD is permitted for autonomous implementation. Degraded isolation requires a newly authorized mode, not silent continuation.

### 4. Implementation-result review contract — defined

Every attempt produces a reviewable result identity and disposition. Deterministic validation, semantic review, integration, and completion are separate transitions. No implementation agent may self-accept, and no process exit, model report, trace, or benchmark score may substitute for review.

### 5. Design revocation and re-planning contract — defined

Revocation or supersession blocks new launches immediately. Active work reaches a durable safe checkpoint and becomes blocked, cancelled, or explicitly permitted to finish only under project policy. Partial work is preserved for review but cannot be integrated against a stale design.

### 6. Capability composition contract — defined

Tools may be globally installed, but availability and admission are distinct. Each attempt receives only the capabilities allowed by the intersection of fixed safety policy, host policy, role declaration, task risk profile, and explicit approval. Skills do not enlarge this set or acquire authority through tool composition.

### 7. Project-consumption isolation contract — defined

Each consuming project owns its design and task authority, configuration, evidence, and state. Runtime state and credentials are host-private and project-partitioned. A package or adapter may interpret these contracts but may not become a second task, approval, or configuration authority.

### 8. Existing task and execution contracts — conditionally approved as substrate

The current component task-record protocol and host-neutral execution contract are appropriate foundations for bounded software work, recovery, and integration. Approval is conditional on closing implementation gaps—particularly isolation fallback, credential inheritance, design linkage, review enforcement, and emitted-metadata privacy. Their software- and Git-specific semantics must not be presented as a complete contract for later content or general-task workloads.

## acceptance-gaps

- No test proves that implementation cannot start without current human alignment.
- No test proves that superseding or revoking design blocks a queued launch.
- No test proves that an implementation agent cannot mutate its referenced aligned design.
- No test demonstrates review of all result classes, including timeout and partial uncommitted work.
- No acceptance condition requires an independent semantic comparison between implementation and design.
- No controlled failure proves safe recovery without resetting budget or silently changing the worker.
- The proposed slice does not prove task-specific capability admission or fail-closed isolation.
- No benchmark fixture or decision threshold currently exists.
- No current evidence establishes alternate-family reviewer independence.
- No current evidence validates the asserted OpenRouter model IDs, prices, benchmark fields, or API behavior.
- No clean external-project installation, upgrade, rollback, or isolation test is defined.
- No test proves that two consuming projects cannot see each other’s sessions, traces, registries, temporary artifacts, or credentials.
- No migration acceptance covers active pre-design tasks.
- No acceptance condition addresses release or external-effect authority.
- No extension test shows that non-software workloads can reuse common governance without inheriting inappropriate Git and code-test semantics.

## required-revisions

1. Appoint, through accountable project policy, the design workflow owner and task-authorizing owner; do not derive either from model names.
2. Adopt the minimum design revision, alignment, design-to-task, revocation, launch admission, and result-review contracts above.
3. Revise the first vertical slice to demonstrate:
   - one human-aligned design revision;
   - one isolated bounded implementation attempt;
   - controlled deterministic evidence;
   - independent semantic result review and parent integration;
   - one stale or revoked-design launch rejection;
   - one failed or budget-stopped result reviewed into a recoverable state.
4. Make autonomous implementation fail closed when worktree isolation, capability preflight, durable records, or reviewer availability is missing.
5. Replace broad environment inheritance with an explicit child-environment allowlist and separately scoped provider credentials.
6. Distinguish global tool installation from per-role and per-task admission; explicitly address shell, network, filesystem, subprocess, and credential capabilities.
7. Reconcile `call_subagent` behavior and naming with its actual target capability behavior, and add deterministic nested-admission controls.
8. Define review independence, dispositions, evidence provenance, test-weakening checks, and escalation rules.
9. Split the benchmark into workflow and implementation-boundary experiments; freeze fixtures and scoring; predeclare decision thresholds.
10. Verify the existence and semantics of any OpenRouter benchmark endpoint before depending on it. Use local representative evaluation as the decisive evidence.
11. Select the versioned package/bundle plus thin-adapter consumption boundary before implementing distribution-facing changes.
12. Add clean-project install, two-project isolation, upgrade, rollback, and uninstall designs before claiming external consumption.
13. Use an additive, reversible migration in an isolated fixture or candidate path. Preserve the current task control and launcher as the rollback path until compatibility is proven.
14. Define treatment of existing and in-flight tasks that lack design linkage.
15. Keep self-application behind the same human alignment, independent review, benchmark immutability, and rollback gates as any other project.
16. Preserve unresolved disagreements from Terra, this review, and the alternate-family review rather than averaging them into implicit approval.
17. Return the revised architecture and human-facing design package for explicit user alignment before creating any implementation task.

## alternate-reviewer-profile

Use a reviewer from a **non-OpenAI model family**, selected for demonstrated experience in capability security, reproducible evaluation, package supply chains, and human-governed automation.

The reviewer should adversarially examine:

- whether prompt, CWD, worktree, tool, shell, environment, and credential boundaries match the claims;
- whether design alignment and revocation can be enforced without model judgment;
- whether every implementation result receives independent and attributable review;
- whether the benchmark rewards safe behavior and resists contamination or metric gaming;
- whether package installation, upgrades, and concurrent projects remain isolated;
- whether self-application creates circular approval or benchmark authority.

Where feasible, perform two bounded passes: one with the proposed restricted context to test sufficiency, and one with broader current-state context to discover omitted dependencies. The reviewer remains advisory and receives no task, implementation, approval, integration, credential, or external-service authority.

## residual-uncertainty

- This review was read-only and did not run tests, inspect Git history, invoke Pi, validate provider behavior, or contact OpenRouter.
- Current-state records describe substantial deterministic coverage, but runtime conformance was not independently reproduced.
- Only selected implementation source was inspected; undiscovered enforcement may reduce some risks, while implementation/documentation divergence may introduce others.
- The current OpenRouter model names, prices, provider routes, and any “Benchmark API” remain unverified.
- It is unresolved which accountable human or adopted role should own design workflow transitions.
- The exact boundary between minor clarification and material design change remains project-dependent and needs explicit policy.
- The recommended package model has not been tested against a real external consumer.
- Stronger sandboxing may not be necessary for every task, but the present evidence cannot identify all task classes for which prompt guidance is sufficient.
- Later content and general-task workloads may require artifact, verification, and integration semantics materially different from component-scoped Git development.
- Final architectural adoption, user design alignment, task authorization, and implementation permission remain with accountable humans and repository authorities, not this report.
