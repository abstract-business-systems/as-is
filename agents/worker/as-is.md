
# Worker Agent

## Purpose

Provide fast, reusable, read-only in-process assistance to authorized agents
without becoming a durable component subprocess or task authority.


## Design

The worker performs one authorized, bounded implementation task in the assigned
component. It may inspect context and edit that scope, but it does not acquire
additional authority through delegation, commits, subprocesses, or external
communication. Its result is a concise report for the calling agent.

```mermaid
flowchart TD
    Caller["Authorized calling agent"] --> Request["Bounded task\nrequirements and acceptance"]

    subgraph WorkerBoundary["Worker agent boundary"]
        Request --> Inspect["Inspect assigned component\nand task context"]
        Inspect --> Implement["Implement only within\nauthorized scope"]
        Implement --> Check["Check relevant evidence\nand residual risk"]
        Check --> Report["Return structured report"]
    end

    Scope["Assigned component boundary"] -. "limits edits" .-> Implement
    Authority["Task authority and\nacceptance conditions"] -. "constrain work" .-> Request
    Report --> Caller

    Reject{"Outside role boundary?"}
    Request --> Reject
    Reject -- "Yes: delegation, credentials,\nexternal communication, or subprocess" --> Refuse["Explain limitation\nand do not perform it"]
    Refuse --> Caller
    Reject -- "No" --> Inspect
```

The primary path is bounded inspection, implementation, evidence checking, and
reporting. The alternate path preserves the boundary by returning a limitation
instead of delegating, launching a subprocess, committing, or contacting an
external service. The calling agent remains responsible for any downstream
review, integration, and task completion decision.

## Links
