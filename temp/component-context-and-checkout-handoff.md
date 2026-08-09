# Component Context and Checkout Handoff

## Status and scope

This is temporary, non-authoritative planning context. It records the current
conversation's decisions about component context, child handoff, and checkout.
It does not authorize implementation, configuration migration, reader-tool
creation, sparse worktrees, or removal of existing records.

## Decisions recorded

### Durable parent-to-child context

The parent component is responsible for durably recording the context a child
needs, or explicit links to that context, in the child's `as-is.md` before the
child is built. A child does not automatically inherit or read its parent's
`as-is.md`. Parent context may be supplied through deliberate context,
contracts, designs, or other explicit references.

### Component checkout

The initial implementation should check out the complete relevant component
folder, including child component directories. It should not use sparse
worktrees or exclude child directories yet. Boundary enforcement remains a
semantic ownership and delegation rule for now; mechanical restrictions can be
introduced later if evidence shows they are needed.

### Source state

The current repository/worktree source is the practical context for the active
flow. Parallel repository work and complex snapshot coordination are out of
scope for this first slice. If source-state consistency becomes a problem, it
will be addressed with evidence rather than assumed in advance.

### Linked context

A future bounded linked-resource/context reader may allow a component builder
to read explicitly linked files and context outside its current component.
The initial design should remain simple and avoid a generalized recursive
context graph. Child `as-is.md` is the durable entry point for child context;
explicit contracts and designs may be linked when required.

### `as-is.md` miscellaneous content

The `as-is.md` structure will include a `Miscellaneous` section for information
that does not yet fit the proposed structured sections. This section is a
holding area for later review, not a second task authority or a replacement for
configuration, task records, backlogs, or changelogs.

## Deferred follow-up work

1. Separate project/component configuration from `as-is.md` without replacing
   agent files or merging `as-is.md` content into `AGENTS.md`.
2. Define and implement a simple bounded tool for reading explicitly linked
   context/resources, with enough provenance and failure reporting for safe
   use.
3. Review and revise the `as-is.md` structure, including parent/child context
   links and the `Miscellaneous` section.
4. Revisit mechanical boundary enforcement only if complete component checkout
   creates demonstrated ownership or safety problems.

## Non-decisions

- No `as-is.md` files are removed or renamed.
- No `AGENTS.md` migration is authorized.
- No sparse checkout is authorized.
- No child may edit a parent record, parent budget, or parent status.
- No implementation task is activated by this handoff.
