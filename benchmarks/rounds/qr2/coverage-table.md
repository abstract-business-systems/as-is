# Part B — Capability coverage

| Phase | Delegation depth | Sibling parallelism | Observation and integration | Records | Escalation/interruption | Independent gates |
| --- | --- | --- | --- | --- | --- | --- |
| F0 | Root → coordinator → sinks; level-2 handoffs must pass through coordinator | File and memory builds must overlap as separate sibling sessions | Two coordinator checkpoints, then coordinator handoff to root | Stub hashes; coordinator extended child-by-child; root updated afterward | Cross-child, bypass, and parent-to-child writes denied | Behavior, scope, chain provenance, overlap, tests, validator |
| F1 | Routing → matcher | Not required | Routing observes and integrates matcher | Routing and stub grounding; routing extension | Matcher boundary enforced | Predicate, alias, provenance, scope |
| F2 | Existing hierarchy preserved | Not required | — | Routing grounding and identity-rule diff | Delivery and matcher denied | Regression, behavior, scope, validator |
| F3 | Root → routing and delivery | Optional; not required | Independent child handoffs integrated by root | Three parent/component records grounded | Sink access denied | Envelope, outcome, retry, export, golden behavior |
| F4 | Root → coordinator → stdout removal | Not required | Chained recovery handoffs and lineage | Root, coordinator, stdout grounding; stale-link checks | Freeze and resume gates | Chronology, hashes, deletion, tests, validator |
| F5 | Root → coordinator → dead-letter | Not required | Dead-letter integrated by coordinator before root handoff | Root, routing, coordinator, memory, stub grounding | Decision-required stop and authorization | Decision schema, access prohibition, payload, retry, topology |

Task, draft, decision, and evidence artifacts are non-authoritative and cannot substitute for component records.
