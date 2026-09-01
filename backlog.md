# Backlog

This is a planning index, not task authority. Active root machine state is
owned by the local `task` object in `as-is.json`, while the configured Markdown
narrative (currently `tasks.md`) carries human task context and evidence; durable
component context remains in `as-is.md`. Component task records use the
configured filename, currently `tasks.md`.
Completed items are removed after their concise summary is recorded in the
owning component's `changelog.md`; this index retains only open or deferred
items. Task-record filenames are configured and validated by the task-control consumer.
root `as-is.md`; this repository uses `backlog.md`, `changelog.md`, and
`tasks.md`.

## Items

### Deferred budget coordination

No separate lock/channel task is required under the current ownership model.
Each child owns only its own record and records an exhaustion request/blocker
there. The parent reconciles descendants and is the only authority that may
change parent-level allocation or status. A future channel would be redundant
unless a concrete live-communication requirement appears; the current durable
record handoff is sufficient for recovery.

The following items are now owned by component backlogs and are intentionally
not repeated here:

- Skills: `skills/backlog.md` (`deterministic-skills`, `presentation-guidance`,
  `building-components`).
- Observability: `core/modules/observability/backlog.md` (Jaeger, tracing,
  Collector, all-in design, and richer observability items).

Remaining root-owned planning items:

Current user-directed sequence for the next restructuring work is: (1) completed owner-specific evidence, observability, and launcher privacy enforcement evidence; (2) completed project-context template-reference policy; (3) masked transient-runtime reference policy reconciliation; (4) process-adapter emitted-path enforcement; (5) the smallest justified execution-contract boundary; (6) a Pi adapter mapped to that contract; and (7) organization of existing tools and modules. Future browser/environment capabilities, setup/host integration, standalone package hosting, speculative task-facing tools, and unrelated backlog work remain lower priority unless separately reprioritized or their readiness gates change.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| establish-host-browser-capability | deferred | 1 | 1 | Establish a reusable host-owned local browser capability | Design and, when separately authorized, establish a reusable local browser capability for browser-backed validation and rendering consumers such as Mermaid, rendered Markdown and link checks, DOM inspection, screenshots, or accessibility checks where justified. Define the nearest common owner, interface, browser and bundle discovery, version reporting, security and network policy, process isolation, cancellation, timeout, resource limits, and unsupported-host behavior without duplicating browser lifecycle code in individual skills. | - | The owner and durable boundary are explicit; browser input and result contracts support multiple bounded consumers; availability, version, security, network, cancellation, cleanup, and unsupported behavior are tested; Mermaid rendering consumes the shared capability rather than owning browser process management; no browser is installed, target project is changed, or host/runtime behavior is altered without separate authorization. | Deprioritized by the current user planning decision; future capability work remains separate from existing tools/modules organization. The current Mermaid-specific `render_mermaid_batch` implementation is provisional consumer evidence, not the final browser owner. |
| environment-capability-inventory | deferred | 1 | 1 | Help agents understand available tools, binaries, modules, and host capabilities | Introduce a bounded read-only tool that reports the environment capabilities relevant to an agent request. It must support exploration of commands and executable binaries visible through the effective terminal environment—not only a fixed predeclared list—by resolving requested names and bounded discovery queries through the terminal's command-resolution and `PATH` surface, then reporting executable identity, path, version or safe probe result, provenance, and availability. It also distinguishes declared and active Pi tools, registered extensions, loadable modules or packages, browser and renderer availability, and unsupported or unverified capabilities. | - | Agents can request a deterministic structured inventory with terminal-resolution provenance, availability state, version or identity where safe, and bounded failure reasons; present, missing, incompatible, aliased, non-executable, and unavailable commands are distinguishable; safe version/probe output is bounded; the tool does not expose secrets, unbounded environment values, prompts, session content, arbitrary command output, or mutation; it does not install, activate, authorize, or substitute capabilities; focused fixtures cover terminal-visible and unavailable entries. | Deprioritized by the current user planning decision; future capability work remains separate from existing tools/modules organization. The inventory is an observation surface, not a tool-admission or task-authority surface. |
| task-control-first-slice | open | 3 | 3 | Establish the first bounded task-control admission and recovery structures | Implement and validate only the provider-free `core/modules/task-control` candidate slice derived from accepted executable realization plan Draft 6: plan-envelope readiness and admission evaluation, dependency classification/invalidation facts, atomic component reservations with release/recovery, and fail-closed parent-closure evaluation. Preserve current contracts and defer process-adapter integration, fixture candidate-flow exercise, benchmarking, migration, adoption, retirement, and merge. | - | An exact root → core → core/modules → core/modules/task-control task hierarchy is prepared and admitted; the leaf's focused deterministic checks and current task-control regressions pass; reservations cannot partially admit or steal live work; parent closure fails closed; no excluded branch is changed; completion evidence is recorded before this row is removed. | Preparation was cancelled after clarifying that candidate implementation must use the newly agreed custom model-bound construction flow; the current component-builder/control-plane path is preserved for governance and later benchmark comparison. A successor construction-flow packet is required before reselection. |
| subagent-first-core-foundation | open | 3 | 3 | Establish the subagent execution foundation for phased core-module and tool migration | Execute the subagent-first migration handoff in `designs/core-modules-tools-and-skills.md`, beginning with normalized agent resolution and execution boundaries, then detached observation, agent-facing tools, task-control validation, context functionality, component-building alignment, ad hoc evidence, core layout reconciliation, and the separately owned setup-command replacement. Each phase is a separate bounded task, validation gate, scoped commit, and compaction checkpoint; later phases must start from the prior committed baseline. | - | The handoff is committed; each selected phase has explicit scope, owner, dependencies, acceptance evidence, recovery, and compaction; subagent-related phases complete before broader regrouping; no phase bundles setup replacement or unapproved relocation; failed phases remain recoverable and do not authorize later phases. | Planning umbrella only; the current priority sequence is recorded by the bounded root backlog-reconciliation task and its changelog. Phase tasks remain separately selected and completed. |
| unwrap-all-markdown | open | 2 | 2 | Keep repository Markdown consistently unwrapped | Rewrite every repository Markdown file so prose and list items are not soft-wrapped, while preserving intentional hard breaks, code blocks, tables, diagrams, links, and meaning. | - | Every applicable tracked Markdown file is checked and prose is unwrapped without changing meaning or formatting-sensitive content; Markdown, link, and whitespace checks pass; the resulting diff contains no unintended changes. | Root-owned because the instruction applies repository-wide. Follow the root AGENTS guidance and preserve intentional hard breaks and formatting-sensitive blocks. |
| as-is-guidance | open | 1 | 1 | Remove the temporary As-Is Guidance section once the system can build itself | Once the system is stable enough to build and improve itself, review the root `AGENTS.md` `As-Is Guidance` section against the purposes recorded by local agent and skill `as-is.md` files. Redistribute any still-needed as-is-specific instruction to its appropriate local `as-is.md`, skill, agent, protocol, or design-principles record, then remove the temporary root section. | - | The review identifies each as-is-specific root instruction, its purpose, current owner, consumers, and replacement; local agent and skill records are consulted; still-needed guidance has one discoverable owner; the root `As-Is Guidance` section is removed; focused instruction/content checks and `git diff --check` pass. | Deferred until the repository's self-hosting workflow is stable enough to remove the temporary section without weakening safety, component boundaries, task authority, or recovery. |
| public-repository-readiness-audit | open | 1 | 1 | Prepare the repository for public release without exposing sensitive data or misleading authorship | Audit tracked content, relevant history, refs, generated artifacts, and repository configuration for secrets, private data, and incorrect author or committer attribution; remove or remediate confirmed exposure and document the evidence before any public release. | - | A bounded release-readiness report identifies checked scopes and findings; confirmed sensitive data is removed or safely remediated with any required credential rotation; publishable history and current metadata use approved author attribution; repository-local identity overrides and other private release blockers are absent; focused scans and attribution checks pass; no publication or push occurs without explicit authorization. | Lower-priority follow-up requested before making the repository public. Treat history rewriting, secret rotation, and removal of private artifacts as separately reviewed operations; do not record secrets or private values in this backlog. |
| configuration-contract-structure-and-defaults | open | 2 | 2 | Document the generic configuration structure and defaults | Revise `core/contracts/configuration.md` so it documents the root/component JSON companion structure, the `configuration` namespace, consumer-owned namespaces, and generic default/precedence rules without describing the current repository's concrete configuration values. | - | The contract documents the configuration object shape, root/component cascade, local task isolation, consumer-owned namespaces, default ownership, relative-path semantics, malformed/unknown-value handling, and precedence without naming current project settings; focused contract/content validation and `git diff --check` pass. | This is documentation-only contract work. Current project configuration belongs in root or component `as-is.json` files and consumer-specific documentation, not in the generic contract. |
| model-simplicity-central-ownership | open | 2 | 2 | Make model-assisted coding prefer simple central ownership over duplicated local solutions | Implement and validate the guidance in [`designs/model-simplicity-guidance.md`](designs/model-simplicity-guidance.md) across the applicable model prompts, agent instructions, or review checks, without creating a parallel authority or generic maintenance framework. | - | The canonical owner is identified before implementation; credible design alternatives and complexity additions are recorded; model guidance explicitly prefers extending cohesive owners; focused validation checks for unnecessary duplication or indirection pass; the implemented guidance is linked from the responsible component record. | The design is the authoritative proposal. Future implementation requires a bounded task at the responsible component and must preserve component boundaries. |
| identify-initial-as-is-components | open | 3 | 2 | Identify semantically meaningful components during as-is setup | Using the adopted `master/managing-as-is-records` record-creation capability within the approved setup flow (the standalone reusable setup skill is retired with its capability absorbed), identify candidate components in the existing project based on responsibility, complexity, boundaries, lifecycle, relationships, and consequential flows rather than directory mechanics. | - | Candidate list includes evidence and confidence; human review can accept, merge, rename, or reject candidates; no component records are created without authorized setup decisions. | Root-owned because the resulting decomposition affects repository-wide architecture. Original dependency context: `skills/as-is-setup`. |
| discover-documents-by-type | open | 2 | 2 | Provide a tool to discover repository documents by type | Introduce a deterministic tool or query for finding documents by semantic type or filename convention, including `backlog.md`, `changelog.md`, and related records, while respecting the rule that a folder index and same-named root document may be functionally equivalent. | - | The tool documents its matching rules, handles root files and folder indexes without duplicate or missing results, supports the repository's document types, and has focused tests. | Must be designed alongside the index-versus-same-named-document decision. |
| decide-index-document-equivalence | open | 1 | 1 | Decide whether folder indexes are equivalent to same-named documents | Evaluate whether `folder/backlog.md` and `folder/backlog/index.md` should be treated as functionally equivalent, including naming, discovery, links, migration, and ambiguity trade-offs. | - | A decision records the canonical rule, supported compatibility behavior, migration implications, and examples for backlog and other document types. | Lower priority than the document-discovery tool and architecture documentation work. |
| audit-as-is-guidance-coverage | open | 2 | 2 | Verify complete ownership coverage after dissolving migration documents | Perform a bounded post-dissolution review of the requirements formerly indexed by the root as-is design documents, confirm each retained requirement has one canonical owner or backlog item, and record any uncovered requirement in the nearest owning backlog without recreating a migration index. | - | A traceable requirement-to-owner/backlog review is recorded; unresolved ownership is assigned to the nearest component backlog; no duplicate root design authority is introduced; focused link/content checks and `git diff --check` pass. | Planning-only follow-up identified while retiring the temporary indexes; implementation requires a separately selected task. Original dependency context: `skills/as-is-setup`; `skills/managing-as-is-document`; `skills/designing-mermaid-diagrams`; `skills/naming-software-concepts`. |
| adopted-catalog-record-conformance | open | 2 | 2 | Make the adopted catalog fully record-conformant at the F9 catalog reduction | When the skills catalog reduces to the adopted set at F9, remove the transitional catalog section from `skills/as-is.md`, declare the adopted records' parent relationships in Components tables or restructure the namespaces so the repository-wide record walk covers them, and fix the diagram readability labels; then remove the transitional tolerances (`transitionalSectionTitles`, `transitionalExternalRecords`, namespace and benchmark exclusions) from the dogfood validators. | - | The repository-wide content test and backlog schema walk pass with no transitional options or exclusions at the F9 tip. | Recorded 2026-09-01 under the fix-as-you-go advancement policy (plan amendment A13); pre-existing F0-era debt surfaced by `skills/managing-as-is-document/content-test.ts`. |


## Prioritization

| Priority | Selection rule |
| --- | --- |
| High | Required by authority, blocks work, or addresses material correctness/recovery risk. |
| Medium | Explicit user intent or meaningful value with bounded dependencies. |
| Low | Useful improvement that does not block higher-priority work. |
| Deferred | Not selected until stated evidence exists. |

## Decisions And Boundaries

| Decision | Rule |
| --- | --- |
| Authority | This file is a planning index; root and component machine task state belongs to the local `task` object in `as-is.json`, while configured Markdown narratives carry human task context and evidence. |
| Hierarchy | A descendant backlog does not authorize changes to this backlog's scope, an ancestor, a sibling, or a shared boundary. Broader structural or authority decisions must be recorded in the nearest affected ancestor backlog; descendant backlogs may hold linked bounded follow-ups only after that decision. |
| Context | Component purpose and design belong to component `as-is.md`. |
| History | Completed summaries belong to component `changelog.md`. |
| Tracing | Telemetry is supplementary and never replaces task records, validation, recovery, or completion authority. |
| Configuration | Root and component `as-is.json` files hold machine configuration data; the generic resolver owns cascade, provenance, diagnostics, and task isolation, while each consumer owns its namespaces, defaults, validation, and interpretation. |
| Completion | Remove completed items from the owning component backlog after recording their concise summary in the owning component's `changelog.md`. |
| Budget and recovery | Child allocations subtract parent spent use and reserve; excess cost or wall-clock requirements bubble to a durable approval/blocker. Failed, cancelled, or budget-stopped descendants remain accounted for and do not silently trigger duplicate attempts. |
| Integration | Child commits remain recoverable source evidence; the parent consolidates related worktree commits into one scoped integration commit before merging into the original branch and records source/result SHAs. |

### Composable-skills adoption execution (F0-F9)

Adopt the advanced candidate composition (ACCEPTED-TARGET per
`candidate/advancement-record.md`) as the live workflow of record, per the
approved plan `drafts/agentic-development-system-adoption-flow-plan-draft1.md`
and the sequencing decision `candidate/adoption-sequence.md`: all preparation
on branch `implementing-composable-skills`, one atomic commit per family,
single `--no-ff` merge into master as the human-authorized cutover. Family
order and per-step gates are owned by the plan; this index tracks execution
state only.

- [x] F0 foundations: catalog at `skills/reusable/` + `skills/master/`, 35 per-skill `as-is.md` records authored via five worker children (all exit 0), `.pi/settings.json` remounted side-by-side (baseline 9 + candidate 16), digest `9f8dbdcb…` verified unchanged. (2026-09-01)
- [x] F1 setup/adoption family swap: retired `skills/as-is-setup` + `skills/integrate-as-is-documentation` (absorbed disposition), catalog/setup entries rewired to adopted `master/managing-as-is-records`; pre-family core/ reconciliation (63ba578) and family commit (aa5edda); gates green; A13 fix-as-you-go + final pre-merge benchmark decisions recorded. (2026-09-01)
- [ ] F2 knowledge family swap.
- [ ] F3 review/consulting family swap.
- [ ] F4 change-execution family swap.
- [ ] F5 records/backlog family swap.
- [ ] F6 delegation family swap with live launcher smoke test (individually confirmed).
- [ ] F7 evidence family swap.
- [ ] F8 agents family: target roster + `thinking-companion` + `agent-capability-probe` live; two agents-component revisit backlog items created (individually confirmed).
- [ ] F9 cutover: remaining retirement, D3 TS-layer retirement check, reference sweep, pre-merge validation (individually confirmed).

Execution state: F0 landed (baffb95) and reconciled with D1 (b51f438: link offsets, adopted names, transitional parent catalog); F1 landed (aa5edda) with the human-authorized A12 core/ reconciliation (63ba578) and A13 fix-as-you-go + final pre-merge benchmark policy; F2-F5 cleared to proceed (adviser PROCEED, `reviews/agentic-development-system/adoption-flow-plan-draft1-adviser-rereview.md`). F2 next.

Acceptance: each family commit passes its plan gate (reference sweep clean,
consumers pass, digest verified); pre-merge state passes fidelity checks at
live paths plus one real end-to-end task; master remains at `9a77e37` until
the human-authorized cutover merge. Deferred: `core/` contract migration;
quarantined-draft cleanup; benchmark rerun.
