
# Skills

## Purpose
Maintain the durable organization and authority context for reusable skills.

## Design

### Request and execution flow

```mermaid
flowchart TD
    U[User request] --> A[agents/as-is/agent.md\nUser-facing router]
    A --> O[Orient repository\nskills/as-is/scripts/orient.ts]
    O --> R{Current task record\nrequires action?}
    R -- Yes --> T[Read root/component\ntasks.md]
    R -- No --> B[Read owning backlog.md\nvia managing-backlog]
    B --> Q[Recommendation only\nstartsWork: false]
    T --> D{Substantive or\nmulti-source work?}
    D -- No: bounded mechanical path --> M[Focused command/check\n30-second guard]
    D -- Yes --> C[agents/component-builder/agent.md]
    C --> P[Plan review\nexpert validation]
    P --> I[Implement within\ncomponent boundary]
    I --> X{Child component boundary?}
    X -- No --> V[Validate diff and behavior]
    X -- Yes --> CB[Create/reuse child as-is.md\nand tasks.md]
    CB --> S[spawning-pi-subagents\nseparate Pi process/worktree]
    S --> I
    V --> H[Write changelog.md\nremove tasks.md]
    H --> G[Scoped Git commit]
    G --> E[Parent rereads record\nand verifies handoff]
    E --> Z[Report result, blockers,\nresidual risk, next action]
```

### Authority and artifact flow

```mermaid
flowchart LR
    CFG[Root as-is.md\nproject configuration] -. configures .-> REC[Record filenames\nbacklog.md / tasks.md / changelog.md]
    CAT[agent-skills.md\nskill catalog] --> SK[skills/<name>/SKILL.md\nreusable procedure]
    CTX[skills/<name>/as-is.md\ndurable component context] --> SK
    SK --> AG[Agent role\n../agents/*/agent.md]
    AG --> TASK[Component tasks.md\ncurrent task authority]
    TASK --> VAL[Validation evidence]
    VAL --> CH[Component changelog.md\nhistorical summary]
    CH --> COMMIT[Scoped Git commit\ndurable handoff]
    RUNTIME[Pi process / log / JobId\nobservational only] -. never authoritative .-> TASK
    BACK[backlog.md\nplanning only] -. proposes work .-> TASK
```

### Component boundary rule

```mermaid
flowchart TD
    ROOT[Component directory\ncontains as-is.md]
    ROOT --> FILES[Descendants without\ntheir own as-is.md\nare in this boundary]
    ROOT --> CHILD[Descendant with as-is.md\nnew component boundary]
    CHANGE[Requested change] --> OWNER[Lowest owning component]
    OWNER --> LOCAL[Edit only local boundary]
    OWNER --> DELEGATE[Delegate child component-builder\nwhen crossing CHILD boundary]
```

**Key:** solid arrows are control/data flow; dotted arrows are configuration,
planning, or observation only. Skills provide procedures, agents hold
authority, durable task records hold current state, and runtime artifacts never
replace them.

## Requirement
Skill procedures live in `skills/<name>/SKILL.md`; their component records
live beside them. This scope record links the catalog and notable entry points
without duplicating skill contracts. Backlog prioritization is defined by
`managing-backlog`; task implementation and lifecycle are defined by
`implementing-component-tasks`.

## Plan
Add the skills-scope record and make the canonical context-building skill
discoverable.

## Progress
Created this durable record and added the context-building skill component.

## Validation
Root integration should validate task-record structure, links, naming, and
`git diff --check`. No runtime behavior is changed.

## Result
Completed the skills-scope documentation record and authority rule.

## Blockers And Escalations
None. Skill changes require their own bounded component record.

## Recovery
Resume from this record and the named skill component; do not duplicate
procedures in the catalog.

## Links
- `../agent-skills.md` — concise capability catalog.
- `context-building/SKILL.md` — high-priority context-building contract.
- `structuring-content/SKILL.md` — reusable organization procedure.
- `verification-discipline/SKILL.md` — validation selection procedure.
- `managing-backlog/SKILL.md` — backlog capture and prioritization.
- `implementing-component-tasks/SKILL.md` — transient task implementation and lifecycle.
- `backlog.md` — skills-component planning index for reusable skill work.
- `changelog.md` — concise completed handoff history for this component.

## Next Action
Keep catalog entries concise and link detailed procedures from their owning
skill documents.
