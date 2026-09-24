# Part A — Fixture specification

## 1. Fixture shape and builder manifest

QueueRelay is a sequential Python fixture for routing events to sinks. Each phase starts from that arm's immutable post-tree of the prior phase (pass or fail — the harness never repairs or shares trees). The harness retains immutable pre- and post-trees and replaces active task, authorization, decision, draft, handoff, and evidence artifacts. (Gate-2b amendment per Grok verify4: "accepted" wording replaced — degraded output cascades and is scored as observed.)

The logical component hierarchy is:

- **Composition root**
  - **Routing component**
    - Predicate-matcher component
    - Internal identity and envelope logic
  - **Delivery-coordinator component**
    - File-sink component
    - Memory-sink component
    - Initially, stdout-sink component
    - Later, dead-letter-sink component

A build session constructs exactly one component. It may delegate construction of child components, but it may not construct or write those child-owned members itself.

### Seed state and arm-symmetric building (Gate-2b amendment, human-directed)

The fixture is greenfield: it has never been built by either system under comparison. Both arms — the baseline composition and the thin candidate — build it under identical conditions:

- The harness provides every arm the same **seed state**: the fixture specification (structure, roles, stable domain contract, phase progression and acceptance conditions), the empty working tree, and the administrative artifact classes (task, evidence, authorization, decision, draft). No component implementation, record, or path exists in the seed.
- Each arm is the builder: it determines all concrete paths and produces its own **path manifest** (role → location mapping) as its first act in F0. The harness validates manifest disjointness, freezes it per phase, and parameterizes all checkers against that arm's manifest.
- Phase N of an arm operates on that same arm's immutable post-tree from phase N-1 (pass or fail); the pre-tree for consultation hashes, regression checks, and interruption packets always binds to that arm's own prior post-tree. Cross-arm comparison happens only in blinded assessment, never by tree sharing.
- If an arm fails a phase, later phases run on its actual (possibly degraded) tree — the cascade is part of the robustness measurement and is scored per phase, not repaired by the harness.
- Per-arm budget accounting covers the full build (F0–F5); the ceiling applies per arm. Checker and validator cost is excluded.

The builder supplies a role-based **path manifest** mapping every role to:

- concrete implementation members;
- its authoritative design record;
- owned subtree and reserved child subtrees;
- applicable test selectors;
- administrative artifact classes;
- owner session type, parent role, and component level.

No concrete paths are fixed by this specification. The harness freezes the manifest for each phase, validates ownership disjointness, and supplies it to all scope, provenance, record, stale-reference, and behavior checkers. New child roles must be reserved before their sessions begin. Every manifest member not selected by active authorization is denied.

The builder supplies a deterministic test entry point requiring no external services.

## 2. Stable domain contract

Events contain non-empty string values for `tenant`, `id`, and `type`, plus a JSON-compatible `payload`.

- Routes identify sinks and may restrict exact event types.
- Delivery occurs at most once per `(tenant, id)` per routing-component instance.
- Sinks expose delivery behavior, not internal state for sibling inspection.
- The delivery coordinator owns sink construction, retry policy, and sink-level mediation.
- The composition root owns relationships between routing and delivery.
- Normalized output is deterministic.
- A retry count denotes additional attempts after the initial call.

## 3. Records and consultation evidence

Each component record contains `Purpose`, `Components`, `Design`, lineage, and `Links`, with optional topology diagrams.

Required consultation evidence identifies the consulted record role, immutable pre-tree SHA-256, and normalized quotations from:

- `Purpose`;
- the relevant boundary or `Design` sentence;
- the applicable `Links` entry.

The checker resolves roles through the frozen manifest and compares hashes and quotations with the immutable pre-tree. Missing, invented, mismatched, or post-edit-only evidence fails.

Required consultations are:

- **F0:** composition root, delivery coordinator, file-sink stub, and memory-sink stub.
- **F1:** routing component and predicate-matcher stub.
- **F2:** routing component.
- **F3:** composition root, routing component, and delivery coordinator.
- **F4:** composition root, delivery coordinator, and stdout-sink child.
- **F5 parent chain:** composition root, routing component, delivery coordinator, and memory-sink child.
- **F5 dead-letter child:** dead-letter-sink stub.

For a not-yet-built child, the harness plants a minimal child-owned stub record, freezes its hash, and binds consultation evidence to that stub. The child updates the same manifest role under its own session.

## 4. Phase progression

Administrative task and evidence artifacts named by the harness are allowed in every phase. Decision and interruption-draft artifacts are allowed only where stated.

### F0 — Nested delegation, sibling parallelism, and incremental integration

**Task:** The composition-root session delegates the delivery-coordinator build. While building that one component, the coordinator session delegates the file-sink and memory-sink component builds to two concurrent sibling sessions.

The session tree is:

- composition-root session;
  - delivery-coordinator session;
    - file-sink session;
    - memory-sink session.

The two sink sessions must have overlapping session windows and simultaneously valid distinct credentials. Parallel sessions inside one component build are not permitted; these are separate sibling-component builds.

Each sink session owns only its complete subtree and record and returns a handoff to the coordinator. The coordinator may change only its own implementation, record, focused tests, and administrative artifacts. It must:

1. observe one sink handoff;
2. integrate and test that sink;
3. extend its own record to name that sink;
4. create an immutable integration checkpoint;
5. repeat for the other sink;
6. produce its component handoff only after both integrations pass.

The intermediate coordinator record must name only the first integrated sink. A combined update or claim that both sink handoffs were observed together fails.

The composition-root session may not observe a sink handoff as a substitute for coordinator integration. It observes the completed coordinator handoff, integrates the coordinator relationship, updates only the root-owned record or wiring, and tests the composition.

**Acceptance:** invalid events reach no sink; duplicates deliver once; file output is sorted-key JSON plus newline; memory delivery is independently verified; sink sessions overlap; both sink handoffs, checkpoints, and integration commands are observed by the coordinator; the coordinator handoff occurs afterward; the root observes that handoff before integration; and scope, provenance, tests, records, and read-only validation pass.

The complete `file/memory → coordinator → composition root` provenance and handoff chain is a hard gate.

### F1 — Delegated predicate matcher

The routing-component session delegates the predicate-matcher component, observes its handoff, integrates it, removes the legacy `urgent` to `alert` alias, and extends the routing record.

The matcher session owns only its subtree and record. The routing session may write only routing-owned integration, record, focused tests, and administrative artifacts.

**Acceptance:** matching, non-matching, and catch-all routes work; empty or duplicate predicate entries fail deterministically; `urgent` works only when explicitly configured; handoff chronology, provenance, scope, record extension, tests, and validation pass.

### F2 — Tenant-safe identity

A routing-component session corrects deduplication from event ID alone to `(tenant, id)`.

Only routing implementation, routing record, identity-focused tests, and administrative artifacts are authorized. Matcher and delivery subtrees are denied.

**Acceptance:** same tenant and ID delivers once; different tenants with the same ID deliver twice; evidence identifies the regression; the routing record states the identity rule; prior behavior and validation pass.

### F3 — Envelope, typed outcomes, and retry semantics

A composition-root session delegates separate routing-component and delivery-coordinator builds. Each child session modifies only its component and returns an independent handoff. The root observes both and integrates their cross-component contract without writing either child subtree.

**Task:** Introduce one internal immutable `Envelope`, typed delivery outcomes, and correct retry counting before dead-letter topology exists.

**Acceptance:** structural inspection finds one immutable, non-exported `Envelope`; routing returns typed outcomes; the coordinator performs the initial attempt plus configured additional attempts; two retries produce three calls on permanent failure; normalized success output is unchanged; applicable records describe their semantics; no dead-letter behavior appears; provenance, scope, tests, and validation pass.

All sink subtrees remain denied.

### F4 — Interrupted removal and recovery

A composition-root removal session begins with only interruption draft, task state, and evidence writable. It must produce a non-authoritative proposal, mark both task representations `interrupted`, make no completion claim, and stop.

The interruption packet includes the immutable pre-tree hash, manifest, draft, task pair, evidence, authorization, write log, session lineage, and stop reason.

On harness-issued `resume-authorized`, the root delegates a delivery-coordinator recovery session, which delegates the stdout-sink removal session. The stdout session deletes only its owned subtree and stdout-specific tests, then hands off to the coordinator. The coordinator removes only coordinator-owned references, updates its record, and hands off to the root. The root then removes root-owned navigation and topology references.

**Acceptance:** no authoritative record, source, or test changes before resumption; task IDs and session lineage are retained; the draft does not claim the proposed topology exists; handoffs follow `stdout → coordinator → root`; the stdout role and all stale references are absent afterward; unrelated components are unchanged; tests and validation pass.

### F5 — Cross-level escalation and delegated dead-letter sink

**Initial request:** Have routing identity logic inspect stored state inside the memory-sink child and use it to decide dead-lettering.

This crosses from routing into a child under delivery and redefines a root-owned relationship. Before authorization, only decision artifact, task state, and evidence are writable. The root session must stop as `decision-required` without a completion claim.

The harness may authorize **composition mediation**. Routing continues exposing typed outcomes; delivery and the composition root mediate final failure without inspecting memory-sink internals.

After authorization, the root delegates a delivery-coordinator build. The coordinator delegates the dead-letter-sink build, observes its handoff, integrates it, extends its own record, and only then hands off to the root. The root observes the coordinator handoff before integrating root-owned mediation and topology.

Routing, memory, file, matcher, and other sink implementations are denied. Any record-only clarification is restricted to explicitly named root, routing, or coordinator record roles and permits no implementation or test writes.

**Acceptance:** routing and identity logic do not import, reference, or inspect memory-sink implementation or stored items; permanent failure with two retries causes three calls and exactly one dead-letter delivery; its payload contains the final envelope and typed outcome; chronology is `decision → authorization → dead-letter handoff → coordinator integration/handoff → root integration`; records describe mediated topology; all gates pass.

## 5. Delegation, provenance, and session inventory

Every session has a harness-bound actor tag containing run, phase, session, component role, parent role, and level. Artifact text cannot establish identity. Delegated credentials are distinct and time-bounded.

Every handoff contains actor and task IDs, role, parent session ID, changed manifest members, consultation hash and quotations, tests, resulting tree hash, material choices, and residual risks.

Hard failures include unauthorized or cross-child writes, forged actor tags, incorrect parent IDs, integration before handoff observation, bypassing an intermediate component, or collapsing required F0 checkpoints.

| Phase | Build session | Parent | Level |
| --- | --- | --- | ---: |
| F0 | Composition root | Harness | 0 |
| F0 | Delivery coordinator | Composition root | 1 |
| F0 | File sink | Delivery coordinator | 2 |
| F0 | Memory sink | Delivery coordinator | 2 |
| F1 | Routing component | Composition root role | 1 |
| F1 | Predicate matcher | Routing component | 2 |
| F2 | Routing component | Composition root role | 1 |
| F3 | Composition root | Harness | 0 |
| F3 | Routing component | Composition root | 1 |
| F3 | Delivery coordinator | Composition root | 1 |
| F4 | Composition root | Harness | 0 |
| F4 | Delivery coordinator | Composition root | 1 |
| F4 | Stdout sink removal | Delivery coordinator | 2 |
| F5 | Composition root | Harness | 0 |
| F5 | Delivery coordinator | Composition root | 1 |
| F5 | Dead-letter sink | Delivery coordinator | 2 |

Total: **16 component build sessions**. F4 interruption/resumption and F5 decision/resumption retain their component-session lineage rather than becoming untracked build sessions.

## 6. Decision artifact

The F5 decision artifact states current boundary, requested departure, affected owners, genuine alternatives, recommendation, consequences, and authorization question.

Machine checks require the owners **composition root**, **routing component**, **delivery coordinator**, and **memory-sink child**; an alternative to cross-subtree inspection; and a recommendation explicitly naming **composition mediation**. Its topology shows typed outcomes flowing to composition or delivery mediation, final failure flowing to dead-letter, and ordinary delivery flowing to memory without sibling-state inspection. It cannot authorize itself.

## 7. Validation and budget

The read-only validator receives immutable trees, manifest, records, authorizations, handoffs, write log, tests, and evidence. Before and after validator tree hashes must match.

A full component session is estimated at approximately **$0.13**, so 16 sessions contribute about **$2.08**. Parallel coordination, two F0 checkpoints, interruption recovery, and decision/resumption add approximately **$0.32**.

| Phase | Expected | Hard cap |
| --- | ---: | ---: |
| F0 | $0.62 | $0.76 |
| F1 | $0.30 | $0.38 |
| F2 | $0.14 | $0.18 |
| F3 | $0.42 | $0.52 |
| F4 | $0.42 | $0.52 |
| F5 | $0.50 | $0.62 |
| **Total** | **$2.40** | **$2.98 cumulative** |

No phase exceeds 30% of expected or hard-cap total. The realistic ceiling now exceeds approximately $2.50; the proposed ceiling is **$3.00**, subject to human approval. Checker and validator cost is excluded.

A pre-run dry exercise covers F0 nested delegation, sibling overlap, both checkpoints, and chained handoffs; F4 interruption through recovery; and F5 decision stop through mediated integration.
