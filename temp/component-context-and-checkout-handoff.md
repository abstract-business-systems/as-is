# Component Context and Checkout Handoff

## Status and scope

This is temporary, non-authoritative planning context. It records the current
conversation's decisions about component context, child handoff, checkout, and
the first resolver slice. It does not authorize configuration migration,
sparse worktrees, or removal of existing records.

The initial resolver implementation now lives in `components/as-is-data/` and
is limited to preparation-time `as-is.json` resolution. It does not migrate
current configuration or inject the result into worker execution yet.

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

### Linked context and machine-readable companion data

A future bounded tool may read machine-readable companion data from
`as-is.json`. The companion file is related to `as-is.md` but is not a JSON
replacement for the human-facing context document. `as-is.json` is an
extensible data holder; it does not require fixed top-level keys. The tool may
classify data into views such as configuration and state when useful, while
preserving unclassified data.

Configuration is the first explicitly cascading category. State is normally
component-local, and unknown data is not automatically cascaded. Task
authority remains in task records. Ordinary file tools are sufficient for
reading `as-is.md`; a separate context reader is not currently required.

The initial resolution direction is to traverse the relevant distributed
`as-is.json` files during preparation/build time, produce an effective view for
the target component, and never copy inherited values back into source files.
The result may initially be in memory; a temporary derived artifact remains an
option if retries or independently launched workers need to reuse the exact
resolution. Provenance, source revision or digest, diagnostics, and
completeness should accompany a reusable derived result.

The larger-tree view of directories, files, Markdown sections, JSON objects,
JSON keys, and links is philosophical context for understanding relationships,
not a current implementation requirement. Do not build a generalized recursive
context graph for this work.

### `as-is.md` miscellaneous content

The `as-is.md` structure will include a `Miscellaneous` section for information
that does not yet fit the proposed structured sections. This section is a
holding area for later review, not a second task authority or a replacement for
configuration, task records, backlogs, or changelogs.

## Deferred follow-up work

1. Define the preparation-time resolver and focused tool for effective
   `as-is.json` data, including configuration cascading, local state,
   unclassified data, provenance, diagnostics, and stale-result handling.
2. Decide whether the first result is in memory or a temporary derived artifact;
   do not copy inherited values into source files.
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
