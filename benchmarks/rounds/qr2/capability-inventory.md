## 0. System goal

The system supports bounded component work while preserving a deliberate division of labor:

- **Humans own design-level intent, judgment, and accountability** through durable `as-is.md` component records and related design documents. These records express a component’s purpose, design, relationships, hierarchy, boundaries, and durable context for review.
- **Agents implement within that design.** They interpret authorized work, resolve the owning component and its local record, make bounded changes, validate evidence, and update the records they own when implementation changes the represented component.
- **The `as-is` record system is the interface between design and implementation.** It is not merely documentation produced after work. It is the durable, human-reviewable representation through which design intent constrains implementation and through which implementation returns an updated representation of the resulting system.

This does not make every local implementation decision a human approval event. Within an authorized component boundary, agents may make design-conformant implementation decisions, including semantically accurate names, and report material choices in their handoff. But an agent may not silently redefine a parent’s purpose, component relationships, authority boundary, or architecture. A child owns its own record; parent-level, sibling-affecting, or repository-wide design changes require escalation to the appropriate authority.

The intended outcome is therefore not autonomous project ownership or a detached “brief-to-code” pipeline. It is a recoverable design-and-implementation workflow in which humans govern the durable component model and agents perform bounded implementation against it.

## 1. Capability narratives (corrected)

### Narrative A — A bounded component change reaches validated completion and updates its design representation

**Request:** “Add focused behavior to component `X`; do not affect child component `Y`.”

1. **Request interpretation and routing — `as-is` agent.** The router interprets the request and recommends an admitted substantive route. Recommendation is not authorization.
2. **Resolve component and design context — scope, ownership, and record skills.** The implementation route identifies `X` as the owning component, reads `X/as-is.md` and explicitly linked resources, and recognizes `Y` as a separately owned child or sibling boundary.
3. **Human design authority is applied at the appropriate level.** If the requested change fits `X`’s current purpose, design, and boundary, the responsible authority can authorize implementation within that design. If it changes `X`’s stated purpose, public relationship model, child structure, or a parent-owned concern, the agent escalates rather than treating the request as implicit authority.
4. **Task establishment — Component Task-Record Protocol.** The work receives its local machine-readable task metadata and human-readable task narrative. These records represent active work state; they do not replace `as-is.md` as the durable design representation.
5. **Delegation and implementation — `component-builder`, worker route, and delegation skills.** A parent may delegate bounded implementation. The child receives only the task, component context, and explicitly linked resources needed for its own boundary.
6. **Record maintenance as implementation work — `managing-as-is-records`.** If implementation changes `X`’s actual purpose, components, design relationships, navigation, or diagrammed structure, the agent updates **`X`’s own** `as-is.md`, validates links and diagrams, and returns it for human review. It does not update the parent record merely because `X` changed.
7. **Validation and completion handoff.** Focused tests and acceptance comparison produce evidence. The handoff identifies changed implementation artifacts, the updated local design record where applicable, residual risks, and any escalated parent-level design consequence.

**Corrected gap statement:** the system already has a durable human-consumable design interface: component `as-is.md` records. The gap is not necessarily the absence of a separate design brief. The material question is whether implementation routes **reliably require agents to consult, preserve, and—when reality changes—update their owned `as-is.md` record before claiming completion**, while escalating changes outside their authority.

---

### Narrative B — A child discovers that the requested implementation conflicts with the current design boundary

**Request:** “Make component `X` directly manage child component `Y`’s state.”

1. **Read the local design record and links.** The agent resolves `X`’s purpose, Components table, Design section, relationship map, and explicit linked context. It also identifies `Y` as a separately owned component.
2. **Identify the conflict.** The change would cross a child/sibling boundary, alter authority relationships, or require parent composition changes. The design principles prohibit a child from mutating ancestor or sibling state.
3. **Do not implement by inference.** The agent does not broaden `X`’s responsibility, edit `Y`, or amend the parent’s component map to make the request appear valid.
4. **Produce an escalation artifact.** The agent returns a bounded explanation: the current represented design, the proposed departure, feasible alternatives, affected component owners, evidence for the conflict, and the parent- or human-level decision required.
5. **Human design decision.** The appropriate human or designated higher authority may reject the change, authorize a revised parent-level design, split the work into separately owned tasks, or explicitly authorize a boundary change.
6. **Implementation resumes only after authority is clear.** If the decision changes `X`’s local design, the agent updates `X/as-is.md`. If it changes parent composition or shared relationships, the parent owner updates its own record; children do not do so on the parent’s behalf.

**Corrected gap statement:** escalation and decision-presentation capabilities exist, but the extract does not prove that every implementation route deterministically detects all record/authority conflicts or blocks completion until the right record owner has acted. That is an **enforcement and production gap**, not evidence that the repository lacks a human design language.

---

### Narrative C — A human evaluates an architectural option before authorizing implementation

**Request:** “Should we introduce a `design-prototyper` role, or extend the component-builder route?”

1. **Use the existing design interface.** The human and supporting agents inspect the `agents/as-is.md` roster, which explicitly records the installed F8 roles and states that no `design-prototyper` role is installed.
2. **Develop bounded analysis — `thinking-companion`, `expert`, and decision skills.** Agents may gather facts, compare alternatives, identify affected records and runtime surfaces, and present a recommendation. They do not make the architectural decision.
3. **Represent the design change at the owning level.** If the human chooses to alter the roster or role relationships, the design decision belongs in the appropriate durable records—principally the relevant `agents/as-is.md` and child role records, with other records updated only where their own represented relationships change.
4. **Authorize implementation.** The human authorizes the bounded implementation needed to realize the approved design. That authorization is distinct from an agent’s routing recommendation or a skill’s procedure.
5. **Agents implement and return updated records for review.** The implementation route changes the relevant role contracts, runtime admission/control surfaces, tests, and owned records. It returns evidence that the recorded design and implementation agree.

**Corrected gap statement:** a separate short “design authorization brief” can still be useful for a consequential decision, but it is not the only or primary missing capability. The existing `as-is.md` structure is the durable architecture review artifact. The missing proof is a consistent workflow that turns human decisions into authorized implementation and requires the implementation to update the authoritative component records.

---

### Narrative D — A child exhausts budget or is interrupted while changing an owned component

**Request:** “Investigate and repair a failing behavior within the allocated session budget.”

1. **Route and establish task state.** The work is assigned to its component, with a local JSON/Markdown task pair holding active task state and acceptance conditions.
2. **Consult the durable design record.** The worker uses the component’s `as-is.md` as the design-level context and follows only explicitly exposed links or policy-approved resources.
3. **Perform bounded implementation and observation.** The child works within its component boundary; parent observation and Pi accounting record session status and usage.
4. **Budget exhaustion or interruption.** Runtime accounting and reconciliation produce a terminal/recoverable state rather than silently continuing.
5. **Preserve design-record integrity.** An incomplete or unvalidated implementation must not be represented as a completed design update. If an `as-is.md` edit was started but not justified by completed work, recovery must distinguish draft/proposed record changes from current authoritative design.
6. **Authorization fork.** A human budget or task authority may approve an extension, narrow the task, accept a partial outcome, or stop the work. An execution advisor can analyze evidence and prepare a request but cannot approve it.
7. **Resume with bounded recovery.** Resumption requires restored task-pair integrity and clear status of implementation evidence and any pending design-record update.

**Corrected gap statement:** runtime support for accounting and reconciliation is stronger than proof of end-to-end design-record lifecycle enforcement. Fixtures should test that interruption cannot leave an unreviewed or misleading `as-is.md` change presented as completed architecture.

## 2. Capability matrix reference

| Capability | Current enabling surface | Corrected maturity/implication |
| --- | --- | --- |
| Human design-level ownership | `as-is.md` Purpose, Components, Design, relationship maps, links, and parent/child lineage | Strong durable representation. Records are explicitly for human architecture review as well as agent orientation. |
| Agent implementation within design | `component-builder`, worker route, scoped task records, reusable skills | Strong intended composition model; implementation must remain bounded by the relevant record and authority. |
| Record-to-implementation interface | `managing-as-is-records`; component records; design principles | Core capability. Agents owe record consultation, accurate owned-record maintenance when needed, validation, and escalation outside ownership. |
| Child/parent authority boundary | Design principles; hierarchical component records | Explicit rule: child updates only its own boundary/record; parent or shared changes require escalation. |
| Non-authorizing routing | `as-is` agent | Explicitly supported; routing is not approval. |
| Human decision support | `thinking-companion`, `expert`, `presenting-decisions`, `consulting-humans` | Available support, but agents do not replace human architectural authority. |
| Design-record production/enforcement | Record-management skill and validators | **Gap/uncertainty:** existence of the skill does not prove all implementation routes require record update/review when implementation changes represented design. |
| Task state and recovery | Task-record protocol; reconciliation | Task records are transient execution state, distinct from durable design records. |
| Independent evidence validation | `evidence-validator` and controlled-worktree surfaces | Available and testable; not evidenced as mandatory for every route. |
| Budget/accounting controls | Pi budgeting, usage accounting, recovery | Runtime-supported; extension authorization remains external to the advisor. |

## 3. Runtime/instruction reference

| Concern | Runtime-carried | Instruction/design-record-carried |
| --- | --- | --- |
| Agent process, tools, sessions, budgets | Pi launcher, admission, accounting, reconciliation, controlled-worktree tools | Delegation scope, expected handoff, escalation expectations |
| Component design context | Bounded resolver/validator support where implemented | `as-is.md` purpose, design, relationships, links, hierarchy, and boundaries |
| Authority boundary | Some task/control-plane checks where implemented | Parent/child ownership rules, design principles, role and component contracts |
| Record correctness | Link/diagram/as-is validator tooling | Requirement to update the owned record only when it accurately reflects implementation |
| Human authorization | No general automatic approval mechanism evidenced | Human review and decision at the owning architectural level |
| Completion claim | Test and validation tooling can provide evidence | Interpretation that implementation, record, and authority state are aligned |

A portable instruction bundle can carry the right-hand column, but cannot by itself enforce process isolation, tool bounds, budget accounting, task integrity, or record-update gates. Conversely, runtime enforcement cannot infer design intent if the relevant `as-is.md` record is absent, stale, or not consulted.

## 4. Fixture implications

1. **Require record-grounded implementation.** Give the agent an owned component record and require it to cite the relevant purpose, boundary, and explicit links before proposing changes.
2. **Test owned-record maintenance.** Make an implementation change that materially changes a component’s represented design. Require an accurate update to that component’s `as-is.md`, including Components/Design/relationship/navigation changes where applicable, plus record validation.
3. **Test non-owned-change escalation.** Give a child a request that requires a parent-map, sibling, or repository-wide design change. Passing behavior must return an escalation artifact, not edit the parent record or silently broaden scope.
4. **Separate task state from design state.** Require a local task JSON/Markdown pair for active work, while rejecting use of task records as substitutes for the durable `as-is.md` design representation.
5. **Test interrupted record work.** Interrupt a task after an implementation or record draft change. Require recovery to distinguish current approved design from incomplete proposed edits and prevent an unsupported completion claim.
6. **Test human reviewability.** Evaluate whether the resulting record lets a human identify the component’s purpose, changed relationship/boundary, implementation consequence, validation evidence, and unresolved escalation without reconstructing them from traces.
7. **Retain independent validation and budget fixtures.** Continue testing read-only evidence review, bounded delegation, accounting, and stop/recovery behavior; add the requirement that those outcomes remain consistent with the durable component record.

## 5. Briefing recommendation for Sol

**Yes.** Attaching real record examples to Sol’s briefing would materially improve it.

The representation error arose because an abstract inventory can make `as-is.md` look like passive repository documentation. The examples show that records actually carry the human-facing architecture: purpose, immediate children, lineage, relationship maps, boundaries, authoritative classifications, and explicit statements of what is and is not authorized. They also show that the hierarchy is operational: a root maps immediate areas, each area owns its descendants, and a child’s record does not replace or mutate the parent’s design responsibility.

The most informative examples are:

1. **Root `as-is.md`.** It best demonstrates repository-level human design ownership, immediate-child mapping, explicit non-ambient context, and the rule that each area owns detailed descendant records.
2. **`agents/as-is.md`.** It demonstrates a human-reviewable role architecture: installed roster, excluded role (`design-prototyper`), role relationships, runtime boundaries, and the distinction between recommendation and authorization.
3. **`skills/as-is.md`.** It demonstrates that records can carry durable classification, ownership maps, runtime cross-references, and normative distinctions without turning directory layout into implicit authority.

The component-scoped context design is also valuable supplementary material because it shows how `as-is.md` links become bounded agent context. But the three records above are the strongest correction to the inventory because they directly evidence the design-level interface that humans own and agents must faithfully implement and maintain.