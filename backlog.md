# Backlog

This is a planning index, not task authority. Active root work is owned by
`tasks.md`; durable component context remains in `as-is.md`. Component task
records use the configured filename, currently `tasks.md`.
Completed items are removed after their concise summary is recorded in the
owning component's `changelog.md`; this index retains only open or deferred
items. Record filenames are configured through
`configuration.records.filenames` in root `as-is.json`.
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
- Task-record validator: `components/task-record-validator/backlog.md`
  (`task-record-validator-bun`).
- Observability: `components/observability/backlog.md` (Jaeger, tracing,
  Collector, all-in design, and richer observability items).

Remaining root-owned planning items:

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |

| public-repository-readiness-audit | open | 1 | 1 | Prepare the repository for public release without exposing sensitive data or misleading authorship | Audit tracked content, relevant history, refs, generated artifacts, and repository configuration for secrets, private data, and incorrect author or committer attribution; remove or remediate confirmed exposure and document the evidence before any public release. | - | A bounded release-readiness report identifies checked scopes and findings; confirmed sensitive data is removed or safely remediated with any required credential rotation; publishable history and current metadata use approved author attribution; repository-local identity overrides and other private release blockers are absent; focused scans and attribution checks pass; no publication or push occurs without explicit authorization. | Lower-priority follow-up requested before making the repository public. Treat history rewriting, secret rotation, and removal of private artifacts as separately reviewed operations; do not record secrets or private values in this backlog. |
| model-simplicity-central-ownership | open | 2 | 2 | Make model-assisted coding prefer simple central ownership over duplicated local solutions | Implement and validate the guidance in [`designs/model-simplicity-guidance.md`](designs/model-simplicity-guidance.md) across the applicable model prompts, agent instructions, or review checks, without creating a parallel authority or generic maintenance framework. | - | The canonical owner is identified before implementation; credible design alternatives and complexity additions are recorded; model guidance explicitly prefers extending cohesive owners; focused validation checks for unnecessary duplication or indirection pass; the implemented guidance is linked from the responsible component record. | The design is the authoritative proposal. Future implementation requires a bounded task at the responsible component and must preserve component boundaries. |
| add-diagrams-to-existing-components | open | 3 | 3 | Add appropriate architecture diagrams to existing components | After the as-is setup and diagram-design procedures are available, review all existing component records and add the appropriate bounded component-to-component diagram, followed by key-flow or other diagrams only where complexity warrants them. | `skills/as-is-setup-skill`; `skills/managing-as-is-document`; [`as-is-document-improvements.md`](as-is-document-improvements.md); [`hierarchical-component-documentation-design.md`](hierarchical-component-documentation-design.md) | Every existing component is reviewed; applicable records receive a structural diagram with correct scope and navigation links; unnecessary diagrams are explicitly left out with rationale; Markdown, Mermaid, link, and whitespace checks pass. | High priority follow-up to the setup and diagram-definition work. The linked root documents preserve the former temporary planning context. |
| identify-initial-as-is-components | open | 3 | 2 | Identify semantically meaningful components during as-is setup | After the reusable as-is setup skill exists, use it to identify candidate components in the existing project based on responsibility, complexity, boundaries, lifecycle, relationships, and consequential flows rather than directory mechanics. | `skills/as-is-setup-skill` | Candidate list includes evidence and confidence; human review can accept, merge, rename, or reject candidates; no component records are created without authorized setup decisions. | Root-owned because the resulting decomposition affects repository-wide architecture. |
| document-shared-component-boundary-information | open | 3 | 2 | Decide where shared component-boundary information is stored | Determine how durable information used by multiple components and skills—such as component boundary definitions—should be stored, linked, and maintained without duplicating authority between component-builder and as-is documentation skills. | - | A bounded design identifies the canonical owner, access/link pattern, update authority, alternatives, migration impact, and validation; shared information remains discoverable without creating conflicting copies. | Example shared information includes the definition of component boundaries used by component-building and as-is-related skills. |
| discover-documents-by-type | open | 2 | 2 | Provide a tool to discover repository documents by type | Introduce a deterministic tool or query for finding documents by semantic type or filename convention, including `backlog.md`, `changelog.md`, and related records, while respecting the rule that a folder index and same-named root document may be functionally equivalent. | - | The tool documents its matching rules, handles root files and folder indexes without duplicate or missing results, supports the repository's document types, and has focused tests. | Must be designed alongside the index-versus-same-named-document decision. |
| decide-index-document-equivalence | open | 1 | 1 | Decide whether folder indexes are equivalent to same-named documents | Evaluate whether `folder/backlog.md` and `folder/backlog/index.md` should be treated as functionally equivalent, including naming, discovery, links, migration, and ambiguity trade-offs. | - | A decision records the canonical rule, supported compatibility behavior, migration implications, and examples for backlog and other document types. | Lower priority than the document-discovery tool and architecture documentation work. |



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
| Authority | This file is a planning index; active root state belongs to the root `tasks.md`; other components use their configured local task record. |
| Hierarchy | A descendant backlog does not authorize changes to this backlog's scope, an ancestor, a sibling, or a shared boundary. Broader structural or authority decisions must be recorded in the nearest affected ancestor backlog; descendant backlogs may hold linked bounded follow-ups only after that decision. |
| Context | Component purpose and design belong to component `as-is.md`. |
| History | Completed summaries belong to component `changelog.md`. |
| Tracing | Telemetry is supplementary and never replaces task records, validation, recovery, or completion authority. |
| Configuration | Root `as-is.json.configuration` is the sole project machine-configuration source; `as-is.md` remains human context and `docs/configuration.md` documents the JSON structure. Record filenames are configured at `configuration.records.filenames`. |
| Completion | Remove completed items from the owning component backlog after recording their concise summary in the owning component's `changelog.md`. |
| Budget and recovery | Child allocations subtract parent spent use and reserve; excess cost or wall-clock requirements bubble to a durable approval/blocker. Failed, cancelled, or budget-stopped descendants remain accounted for and do not silently trigger duplicate attempts. |
| Integration | Child commits remain recoverable source evidence; the parent consolidates related worktree commits into one scoped integration commit before merging into the original branch and records source/result SHAs. |
