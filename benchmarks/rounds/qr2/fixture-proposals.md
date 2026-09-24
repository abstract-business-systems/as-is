# Fixture Proposals

## 1. QueueRelay — Component-Bounded Event Router

**Description.** A small Python package routes normalized events to separately owned output sinks. The repository contains a composition root, a `router` component, and sibling sink components such as `file_sink` and `memory_sink`, each with its own `as-is.md`. Work crosses real integration boundaries: a delegated child implements a sink and returns a handoff, while the parent integrates it without taking over the child’s record. A machine-readable authorization file and concise decision document model human approval. Independent validation runs read-only against tests, records, and handoffs.

### Phase progression

- **F0 — Base:** Establish task records and authorization; delegate implementation of `file_sink` while the parent implements routing and integrates the child handoff. Independently validate behavior and record alignment.
- **F1 — Add:** Add route predicates based on event type, updating only the router’s owned implementation, tests, and `as-is.md`.
- **F2 — Correct:** Fix deduplication incorrectly collapsing events from different tenants; preserve public behavior otherwise and record evidence.
- **F3 — Refactor:** Extract event normalization into an internal `Envelope` representation while preserving all routing behavior and records that describe only durable design.
- **F4 — Drop:** Remove a legacy `stdout_sink`, including code, tests, navigation, and its owned record without leaving stale links.
- **F5 — Complex:** Add a dead-letter sink through delegation, correct retry counting, refactor delivery results, and remove an `urgent` alias. The initial request asks the router to inspect sibling sink state directly; implementation must stop and present a human-consumable decision. After simulated authorization, the composition root mediates the relationship and updates its own topology.

### Required capabilities and single-agent degradation

- **Bounded delegation:** The sink subtree is actor-scoped; acceptance requires a child handoff and parent observation/integration evidence. Direct parent edits fail provenance checks.
- **Record lifecycle:** Each component must cite its `as-is.md`, maintain its own record when topology or responsibility changes, and avoid editing sibling records. Stale sink links are machine-checkable.
- **Escalation and authorization:** Direct router-to-sink state access violates the represented sibling boundary. Passing requires an escalation artifact, authorization input, and parent-owned resolution.
- **Independent validation:** A separate read-only validation result must compare acceptance conditions, tests, changed files, and records. Self-attestation is insufficient.
- **Without composition:** A single agent may produce working routing code but cannot satisfy actor-separated sink provenance, independent validation, or the authorization gate; it is also likely to silently couple siblings or update the wrong record.

**Why this fixture.** It provides the clearest general-purpose discrimination of implementation versus composition authority. Runtime behavior is simple, leaving budget for delegation, record handling, recovery, and review artifacts.

**Estimate.** Approximately 12–15 files initially, 350–500 final LOC including tests and records; expected arm cost **$0.40–$0.65**.

**Risks.** Retry and deduplication semantics must remain narrowly defined. Too many sink variants could inflate fixture size, so only two live sinks should remain by F5.

---

## 2. ReleaseGraph — Manifest Dependency and Impact Planner

**Description.** A small TypeScript or Python CLI reads a package manifest, constructs a dependency graph, and reports build order and change impact. It has sibling `manifest_reader`, `dependency_graph`, and `reporter` components under a parent planner. The graph’s topology makes a succinct Mermaid diagram materially useful to human authorization rather than decorative. Delegation is unavoidable because manifest parsing is child-owned while graph integration and reporting remain separately owned.

### Phase progression

- **F0 — Base:** Authorize and establish the planner; delegate manifest-reader implementation, integrate its handoff into a topological build-order command, and validate independently.
- **F1 — Add:** Add optional dependency edges and expose their meaning in the graph component’s owned record and diagram.
- **F2 — Correct:** Fix false cycle detection when the same package is reached through multiple paths.
- **F3 — Refactor:** Replace ad hoc dictionaries with a graph model while preserving ordering, errors, and output.
- **F4 — Drop:** Remove legacy flat-list output and all associated flags, tests, record claims, and navigation.
- **F5 — Complex:** Add reverse-impact reporting, correct optional-edge propagation, unify traversal internals, and remove a deprecated manifest key. A request for the graph component to parse manifests directly must be escalated; simulated human authorization selects continued parent orchestration rather than merging sibling responsibilities.

### Required capabilities and single-agent degradation

- **Bounded delegation:** The parser is a separately owned deliverable with a required child handoff; the planner must observe and integrate it.
- **Record lifecycle:** Edge semantics and graph topology materially change the graph record and Mermaid diagram. Deleted output must disappear from the reporter’s record and links.
- **Boundary escalation:** Parsing inside the graph would collapse sibling ownership. The graph worker must propose alternatives instead of editing parent or parser records.
- **Independent validation:** A read-only validator checks deterministic CLI fixtures, cycle cases, diagrams/links, task state, and implementation-record agreement.
- **Without composition:** A single agent can implement the algorithm, but direct cross-component edits invalidate ownership provenance. It is also more likely to conflate parsing and graph responsibilities or miss stale topology documentation.

**Why this fixture.** It best tests whether design records and diagrams are genuinely used as an architecture interface. It also offers stronger refactoring and feature-preservation signals than QueueRelay.

**Estimate.** Approximately 10–14 files, 400–550 final LOC; expected arm cost **$0.45–$0.70**.

**Risks.** Graph algorithms may consume attention unrelated to the benchmark. Fixtures should use tiny deterministic manifests and avoid package-manager-specific syntax.

---

## 3. PermitGate — Policy Evaluation with Separate Audit Ownership

**Description.** A small Python authorization library evaluates ordered allow/deny rules and emits audit outcomes through a separately owned audit component. Components include a policy parser, evaluator, audit journal, and parent service. The authority boundary is natural: the evaluator decides outcomes but must not mutate or reinterpret the audit journal’s storage model. Human authorization is required before changing rule semantics or component relationships.

### Phase progression

- **F0 — Base:** Authorize baseline semantics; delegate the policy parser, integrate it with evaluator and audit journal, and obtain independent fail-closed validation.
- **F1 — Add:** Add time-bounded rules, updating parser/evaluator records where their represented behavior changes.
- **F2 — Correct:** Fix deny precedence when equally specific allow and deny rules both match.
- **F3 — Refactor:** Introduce a typed policy AST while preserving all decisions and audit output.
- **F4 — Drop:** Remove unrestricted wildcard subjects and delete their implementation, tests, and durable record claims.
- **F5 — Complex:** Add batch evaluation, correct expiry boundaries, consolidate matching logic, and remove a deprecated `override` field. A request for the evaluator to rewrite audit entries crosses sibling ownership; it must trigger a decision packet, with simulated authorization selecting a parent-owned audit adapter.

### Required capabilities and single-agent degradation

- **Bounded delegation:** Parser work is isolated and requires a child-produced handoff before evaluator integration.
- **Record lifecycle:** Durable rule semantics must remain synchronized with owned records; transient task files cannot substitute for policy design.
- **Escalation and human authority:** Changes to precedence, wildcard authority, or audit relationships require explicit authorization. The evaluator cannot amend audit or parent records to legitimize its implementation.
- **Independent validation:** A separate validator checks decision tables, fail-closed behavior, audit evidence, authorization state, and record consistency.
- **Without composition:** Monolithic implementation may pass ordinary examples but is likely to self-approve semantic changes, couple evaluator and audit storage, or treat its own test run as independent evidence. Actor and authorization checks make those shortcuts measurable failures.

**Why this fixture.** It most strongly discriminates authority discipline from mere code quality: an unauthorized “working” implementation is explicitly incorrect.

**Estimate.** Approximately 12–15 files, 400–550 final LOC; expected arm cost **$0.45–$0.70**.

**Risks.** “Authorization” in the sandbox domain could be confused with benchmark human authorization. Naming the latter `design-authorization` and keeping policy semantics small would reduce ambiguity.

---

## Comparison

| Concept | Strongest discriminator | Algorithmic risk | Record/topology signal | Boundary naturalness | Expected cost |
| --- | --- | ---: | ---: | ---: | ---: |
| QueueRelay | Delegation, integration, and sibling escalation | Low | High | High | $0.40–$0.65 |
| ReleaseGraph | Diagrammed design and refactor preservation | Medium | Very high | High | $0.45–$0.70 |
| PermitGate | Authorization discipline and fail-closed behavior | Medium | High | Very high | $0.45–$0.70 |

## Recommendation

**Select QueueRelay.** It exercises every non-negotiable capability through natural component relationships while keeping domain logic inexpensive. Its delegated sink is a substantive deliverable, independent validation is straightforward, deletion creates machine-checkable record cleanup, and F5 naturally exposes the distinction between child implementation authority and parent-owned composition. ReleaseGraph is the best alternative if diagram and topology quality should receive greater weight; PermitGate is strongest if unauthorized-but-functional changes are the primary failure mode of interest.