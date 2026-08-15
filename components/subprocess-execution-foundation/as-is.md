
# Subprocess Execution Foundation - as-is

## Purpose

Own the cross-cutting, host-neutral launch foundation that submits a bounded
worker attempt without making the submitting as-is/OpenCode/orchestrator turn
wait for worker completion.


## Design

The component is organized around detached launch and lifecycle boundaries for
bounded worker attempts. The Pi launcher currently consumes the shared
mechanical process boundary in
[`skills/spawning-pi-subagents/scripts/bounded-process-supervisor.ts`](../../skills/spawning-pi-subagents/scripts/bounded-process-supervisor.ts)
without transferring task-record, Git, worktree, or handoff authority into that
module; this is an adapter relationship, not a second task authority.


**Lineage**: [as-is](../../as-is.md#design) / [Components](../as-is.md#design) / **Subprocess Execution Foundation**

### Detached bounded worker launch

```mermaid
flowchart TD
    A["Bounded worker attempt"] --> B["Detached launch<br/>foundation"]
    B --> C["Lifecycle and<br/>host-neutral boundary"]
```

- Submit a bounded worker attempt through a detached process-group foundation.
- Preserve the non-blocking launch and lifecycle boundary for the submitting
  agent.
- Implement only the supervisor portion of the shared task-record and
  host-neutral execution contracts.
- Historical investigation found synchronous nested delegation and blind
  waiting increased elapsed time; host capability and attribution limitations
  remain residual risks.
- The shared launcher seam is mechanically tested by the launcher's provider-free
  behavioral suite; the foundation's own provider-free suite remains the
  lifecycle and durable-record regression anchor.
## Links

- [`supervisor.ts`](supervisor.ts) — host-neutral detached lifecycle implementation.
- [`supervisor.test.ts`](supervisor.test.ts) — provider-free lifecycle and durable-record behavioral tests.
- [`../../skills/spawning-pi-subagents/scripts/bounded-process-supervisor.ts`](../../skills/spawning-pi-subagents/scripts/bounded-process-supervisor.ts) — launcher adapter's shared mechanical process boundary.
