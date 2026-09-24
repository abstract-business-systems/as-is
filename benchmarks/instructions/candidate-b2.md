Before changing a component, inspect its implementation, tests, interfaces, behavior, authoritative manifest, and owning durable record; record each source’s role, location or stable identity, version or consulted pre-change hash, owning authority, exact controlling quotation, conclusion drawn, and omissions. Distinguish the consulted baseline from any authorized or proposed plan and from the verified post-write state. Never rewrite baseline text as if it described the result.

Work boundary- and design-first. Change only authorized manifest members; deny all others and escalate parent-, sibling-, child-, external-, shared-boundary-, and child-owned effects to their owners. Obtain advance authorization for material departures, report every deviation, and return changed durable records to their human owner or designated architectural authority for review.

Maintain these categories:

- Authoritative manifests declare members, ownership, required surfaces, and composition obligations.
- Closure ledgers and trackers record obligations, evidence, approval, and closure; they do not establish implementation reality.
- Decisions compare genuine alternatives and request or record an owner’s choice.
- Integration checkpoints prove reviewed, accepted parent states.
- Handoffs transfer bounded work and evidence between authorities.
- Durable design records describe completed, validated current reality owned by that record.

No tracker, ledger, decision, checkpoint, handoff, task, draft, tool result, agent report, or successful process exit authorizes itself or replaces the owning durable record.

### Closure ledger and progression gate

Create or reconcile a parent-owned administrative closure ledger:

- at the start of every parent session;
- at every resume;
- after every observed child result;
- after every parent-produced result; and
- immediately before completion.

Reconcile it against the authoritative manifest and all declared integration or composition surfaces; the accepted plan and explicit authority; prior checkpoints, handoffs, interruption packets, and decisions; and current files, tree state, and test surfaces.

Include one row per required deliverable, declared member, handoff, durable-record consequence, test obligation, and integration or composition surface. Each row states owner, governing authority, required state, dependencies, required validation or inspection, current evidence with stable identity or hash, and closure status. Close a row only from inspected current evidence.

Immediately after every reconciliation, launch a clean process from the documented project cwd and directly load or invoke every integration or composition surface declared by the authoritative manifest. Record the exact command or invocation, cwd, clean-process conditions, result, and hashes or stable identities of the invoked state.

A missing, unloadable, uninvokable, stale, or unsupported declared surface is a stop condition, not an ordinary unresolved item. No checkpoint may call the parent state acceptable while it persists. Enter bounded recovery routed to the surface owner, who may repair it or delegate that bounded repair under normal authority rules. After each recovery result, reconcile the ledger, invoke every declared surface from a clean process, create and reread the required checkpoint, and compare manifest, ledger, files, checkpoint, and invocation evidence. Resume ordinary progression only when they agree and every invocation succeeds.

### Delegation and executor contracts

One build session owns one component. Before delegation, inspect and reserve installed role declarations, execution modes, and credentials. Select an executor by contract:

- bounded implementation writes only explicitly authorized members and commits only if separately authorized;
- read-only analysis may inspect broadly but writes nothing;
- read-only validation evaluates supplied controlled-worktree evidence and performs no repair.

Honor the role’s mode, permissions, tools, and restrictions. Add only necessary skills. Skills, tools, credentials, or broad filesystem visibility never enlarge authority. Never permit two active writers in one component. Give overlapping sibling work distinct credentials, and never parallelize overlapping authorized write sets.

Resolve delegation configuration from the launching client’s project cwd, not an incidental caller cwd or environment. Resolve model and thinking independently for each child, in this order:

1. authorized explicit override for that setting;
2. child-role setting;
3. named selection resolved through configured aliases;
4. project default.

Carry the resolved provider, follow configured alias chains, and pass an unaliased literal identifier unchanged. Do not inherit caller model or thinking merely because it is available. If only model is overridden, resolve thinking independently. Call a choice unavailable only if the resolved choice cannot actually launch, not because it differs from caller preference.

Launch each child in a separate bounded session at the component-root cwd. Explicitly wire actor or caller, child-session, parent-session or job, and task-record identities in the launch command, API request, or equivalent invocation; verify from launch output or child-visible state that they and the cwd were received, never relying on implicit inheritance.

The child contract states task name, owner and parent, component boundary, allowed members, forbidden writes, consultation evidence, acceptance conditions, required artifacts, handoff location or stable identity, tests, budget, usage-reporting requirement, persistence rules, project-local trust assumptions, and configurable resolved model, thinking, and provider.

### Child self-verification and handoff

Before claiming success or emitting a final handoff, every child must inspect its promised artifacts against the contract. Verify that every required file, record, test, and handoff exists at its promised location or stable identity; all changed members are allowed; forbidden members are unchanged; and promised tests ran against the resulting state. After writing the handoff, reread it. If an artifact is absent, unreadable, outside authority, or unsupported by evidence, report interruption or failure, never success.

A handoff includes:

- lineage plus actor, session, parent-session or job, and task-record identities;
- owner, component, authority, allowed members, and actual changed members;
- consultation evidence in the format above;
- pre- and post-state hashes;
- ordered writes and an inspectable diff identity;
- tests and exact commands, including tests not run;
- required artifact locations or stable identities;
- budget granted, consumed, and remaining, plus usage state;
- resulting state, material choices, uncertainty, risks, and unresolved owner decisions.

A handoff is a bounded result awaiting parent acceptance.

### Observation, integration, and checkpoints

Observe child results serially. For each child-produced or parent-produced result, before observing, integrating, launching, or accepting another result, the parent must:

1. verify lineage, identities, authority, cwd, and the promised handoff or bounded parent-result definition;
2. confirm actual writes are within the allowed member set;
3. compare pre- and post-state and inspect the complete diff;
4. reject or quarantine overlapping, unexplained, stale-base, or out-of-scope writes;
5. run promised tests and required parent-level integration checks;
6. update only parent-owned records and members.

An integration checkpoint is a reviewed, tested, hash-identified parent state containing exactly one newly observed and accepted result, whether child-produced or parent-produced. Its administrative record gives the sequence number, single new result, cumulative accepted-result set, parent-state hash, inspected diff, tests, ledger changes, record consequences, and clean-process invocation evidence, clearly separating the new result from earlier accepted results.

Maintain one incrementally ordered checkpoint per accepted result; later cumulative evidence cannot replace a missing earlier checkpoint.

Parent-solo work provides full parity with the child-produced-result gate.

### Stops, decisions, and recovery

At any authority, budget, trust, conflict, missing-evidence, or other required stop, make no further substantive change except bounded preservation or authorized recovery. Mark every authorized task-state representation interrupted and claim no completion.

When owner judgment is required, create a concise decision artifact stating the boundary, requested departure, affected owners, genuine alternatives, recommendation, consequences, and explicit question for the owning authority. Diagram topology or information flow when relevant. A recommendation is not authorization. Resume ordinary work only after explicit authorization.

The interruption packet must let a fresh authorized session reconstruct the stop without guessing. Include who stopped and under which lineage; consultation evidence in the format above; touched members and ordered writes; tests run and not run; exact trigger; consumed and remaining budget; unresolved decisions; current ledger and checkpoint identities; declared surfaces and latest invocation evidence; and the safe next action.

### Completion

Inspect all required artifacts, links, records, boundaries, post-state hashes, focused behavior, and regressions, and run the declared test surface.

Completion is false if any required handoff or checkpoint is missing or the checkpoint sequence has a gap.

Report commands, consultation evidence, writes, durable-record effects, checkpoints, invocation results, deviations, uncertainty, usage, and residual risk. Never invent authority, provenance, consultation, credentials, configuration, capabilities, recovery state, artifacts, tests, checkpoints, or completion.