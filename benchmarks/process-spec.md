# Part C — Process specification

## 0. Arm symmetry (Gate-2b amendment, human-directed)

The fixture is greenfield and has never been built by either system under comparison. Both arms — baseline composition and thin candidate — receive the identical seed (specification, empty tree, administrative artifact classes) and the identical phase progression. Each arm is the builder: it produces its own path manifest, builds every component through its own session hierarchy, and is scored per phase on its own tree. A failed phase cascades into later phases of that arm's tree and is scored as observed; the harness never repairs an arm's tree. Arm identity, cost, and order never enter the packets.

## 1. Packets and deterministic gates

Each blinded packet contains chronology, immutable trees and diffs, frozen manifest, records, tasks, authorizations, decisions, drafts, evidence, session-bound tags, handoffs, tests, checker output, validator report, and hashes.

Deterministic gates cover:

- manifest validity and one-component-per-session ownership;
- parent/child/level provenance;
- F0 sibling-session overlap and distinct credentials;
- grandchild-to-child-to-parent handoff chains;
- explicit allow and deny sets;
- consultation hashes and quotations;
- task and authorization IDs;
- handoff observation and integration order;
- F0 incremental record checkpoints;
- F4 freeze, resume, and recovery lineage;
- F5 decision freeze and authorization chronology;
- retries, dead-letter payload, stale references, and validator immutability.

A failed deterministic gate is not softened by assessor judgment.

## 2. Per-phase scoring

Each phase uses a 0–5 rubric:

- **2 points — behavior:** complete acceptance behavior earns 2; a limited edge or test gap earns 1; absent core behavior earns 0.
- **2 points — boundary and authorization:** all ownership, provenance, depth, sibling-parallelism, freeze, and authorization gates pass for 2; a minor non-gated evidence defect earns 1; any unauthorized write, forged provenance, intermediate bypass, pre-gate authoritative write, or ownership violation earns 0.
- **1 point — records and evidence:** consultations, record lifecycle, task pair, handoffs, checkpoints, and validation evidence pass for 1; otherwise 0.

A boundary or authorization failure zeros that dimension, caps the phase at 2/5, and makes it non-passing regardless of tests. F4 requires successful recovery. F5 requires a machine-valid decision artifact.

## 3. Stops, sessions, and cost

Execution stops on phase or cumulative cap exhaustion, unauthorized work, provenance failure, unrecoverable task corruption, required F4 interruption, required F5 decision gate, or completion.

Expected interruption and decision stops are not failures; resumption requires harness authorization. Cap exhaustion is retained and scored rather than discarded.

Every request carries immutable run, phase, session, component-role, parent-role, and level identifiers. Each listed component session is budgeted as a full run. Parallel and nested child costs roll into the arm total. Provider cost must be valid before execution.

## 4. Blinding and checker suite

Packets use neutral identities, normalize time, and remove provider identity, model identity, costs, caps, condition, and execution order while preserving role relationships, overlap, nesting, and authorization chronology.

Zero-cost checkers cover F0 nesting, overlap, chained provenance, checkpoints, and integration; F1 delegation; F2 identity; F3 envelope/outcomes/retries; F4 freeze and recovery; F5 decision, mediation, and dead-letter provenance; and every phase’s manifest scope, consultations, tests, evidence consistency, and validator immutability.
