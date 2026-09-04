---
name: managing-changelogs
description: Use when durable histories must be resolved and maintained independently of component-task use; establishes fit, not permission (grants no tools or authority).
---

## Purpose

**Purpose**: Resolve and maintain durable histories independently of component-task use.

## Approach

**Approach**: Locate the owning history from explicit contracts, write concise evidence-backed entries, and state when no durable history is required.

## How it should be done

**How it should be done**: Resolve history from task, component, project, or root contracts; verify the result is durable and owned; write a concise dated or convention-compliant summary with evidence and residual risk; explicitly record no-history outcomes.


## Composition context

Changelog resolution rules (drafts/composable-skills.md lines 150-160):

Changelog management is independently usable and does not depend on a component task. A future history workflow would resolve the appropriate changelog under the governing task and history contract, using explicit configuration, the owning component or project record, or an applicable repository convention as evidence. It must not select a changelog merely because it is the nearest file with that name. Where no applicable durable-history requirement exists, the result must be explicitly recorded as no history required rather than inferred.

A non-component change may therefore use:

```text
resolving-scopes → building-context → writing-code or applying-bounded-edits → validating-changes → locating-changelogs → managing-changelogs
```

A component task that reaches completion still follows the repository's existing task protocol: acceptance validation, terminal descendant closure, concise owning changelog summary, exact backlog reconciliation where applicable, task-artifact cleanup, and the scoped completion handoff remain required. Omitting changelog management is valid only for work whose applicable contract does not require durable history, such as an explicitly exploratory or non-completing result.

Tool-access composition admission (drafts/composable-skills.md lines 112-113): A skill does not grant tools. Before an agent is admitted to a master skill or composition, the composition's required tool set must be compared with the agent's declared tools, permissions, and authority. The agent must have every tool needed for its selected path, or the workflow must stop with a bounded missing-capability blocker; it must not silently substitute a weaker tool, broaden permissions, or ask a read-only agent to perform mutation.