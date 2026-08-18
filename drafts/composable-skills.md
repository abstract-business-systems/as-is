# Composing Skills Approach

## Skill name

**Composing Skills**

This name describes the proposal's central property: small skills remain useful on their own, while larger master skills compose them into complete workflows. It avoids implying that every skill is atomic or that users must manually assemble workflows.

## Purpose

Make reusable skills easier to read, edit, reuse, and compose without weakening authority, validation, recovery, or ownership boundaries. Small skills should express one independently useful capability. Master skills should compose those capabilities into safe, outcome-oriented procedures that users can invoke without activating each underlying skill manually.

The approach must support both component-based and non-component changes. A change may use a component task when its scope, ownership, risk, or delegation requires one, but a smaller change may resolve an artifact, project, or root scope without creating a component task. Durable history is resolved separately through the appropriate owning changelog.

## Approach

### Two levels of skill

**Reusable skills** are independently usable procedures with one primary capability. The candidate list below is non-exhaustive; each candidate requires separate evidence for its structure, owner, name, independent consumer, and validation before it becomes a repository skill. Examples include building context, resolving scope, identifying an owner, applying a bounded edit, writing code, writing tests, running tests, validating a change, recording evidence, locating a changelog, designing a diagram, rendering a diagram, delegating bounded work, observing delegated work, and preparing a scoped commit.

**Master skills** compose reusable skills into an outcome-oriented workflow. The candidate list below is non-exhaustive and is not an adoption decision. Examples include building a component, making a general change, maintaining a component, managing as-is records, managing a backlog, managing a changelog, spawning subagents, exploring execution evidence, consulting a human, and committing completed work. A master skill selects the path, orders the work, enforces required gates, handles optional policy, and defines recovery. Users invoke the master skill or request the outcome; they do not need to assemble the underlying skills manually.

### Change scope resolution

A future general change workflow would first resolve the smallest valid scope and would not assume a component task. This is a proposed pilot contract, not current authority. Until an approved implementation establishes who decides task applicability, scope ownership, and the applicable history contract, unresolved cases stop for explicit direction rather than being reclassified as taskless. Scope may be:

- a documented component with a component task;
- an artifact or project scope without a component task; or
- the repository root when the change is genuinely root-owned.

Component identification is therefore a reusable capability, not a universal prerequisite. If ownership or scope is ambiguous, the workflow stops and asks for direction rather than choosing by path proximity alone.

### Writing code and editing artifacts

Writing code and applying a bounded edit are separate capabilities. `writing-code` supports new or substantially generated implementation from a bounded requirement. `applying-bounded-edits` makes surgical changes to existing artifacts while preserving unrelated content. A master skill chooses between them according to the change, scope, and risk. Other capabilities may include drafting content, creating an artifact, refactoring code, updating documentation, and repairing a failing test when those distinctions provide independent reuse.

### Changelog resolution

Changelog management is independently usable and does not depend on a component task. A future history workflow would resolve the appropriate changelog under the governing task and history contract, using explicit configuration, the owning component or project record, or an applicable repository convention as evidence. It must not select a changelog merely because it is the nearest file with that name. Where no applicable durable-history requirement exists, the result must be explicitly recorded as no history required rather than inferred.

A non-component change may therefore use:

```text
resolving-scopes → building-context → writing-code or applying-bounded-edits → validating-changes → locating-changelogs → managing-changelogs
```

A component task that reaches completion still follows the repository's existing task protocol: acceptance validation, terminal descendant closure, concise owning changelog summary, exact backlog reconciliation where applicable, task-artifact cleanup, and the scoped completion handoff remain required. Omitting changelog management is valid only for work whose applicable contract does not require durable history, such as an explicitly exploratory or non-completing result.

### Master workflow examples

```text
making-changes = resolving-scopes → building-context → choosing-change-methods → writing-code or applying-bounded-edits → validating-changes → managing-changelogs when required
```

```text
building-components = resolving-scopes → building-context → implementing-tasks → writing-code or applying-bounded-edits → writing-tests → validating-changes → managing-changelogs → preparing-scoped-commits
```

```text
exploring-execution-evidence = building-context → inspecting-execution-evidence → recording-evidence
```

The arrows describe a proposed composition, not a new runtime engine. Existing task, backlog, changelog, delegation, and commit authorities remain authoritative until a later approved implementation changes them.

## Proposed reusable skill set

| Skill | Purpose |
| --- | --- |
| `building-context` | Assemble the smallest authoritative context for a bounded decision or handoff. |
| `resolving-scopes` | Resolve component, artifact, project, or root scopes without assuming a component task. |
| `identifying-owners` | Identify the authorities and owners for the resolved scopes. |
| `locating-changelogs` | Resolve the changelogs owned by the target scopes. |
| `choosing-names` | Select semantically accurate names using local conventions. |
| `structuring-content` | Choose a durable location, hierarchy, and representation. |
| `drafting-content` | Produce a bounded proposal without claiming adoption or completion. |
| `writing-code` | Create or substantially implement code from a bounded requirement. |
| `applying-bounded-edits` | Make surgical changes to existing artifacts. |
| `writing-tests` | Add or update focused coverage for a stated behavior. |
| `running-tests` | Run the smallest relevant test or check and return observations. |
| `validating-changes` | Map observable evidence to acceptance conditions and residual risk. |
| `recording-evidence` | Preserve observations, provenance, assumptions, and validation results. |
| `designing-diagrams` | Design bounded reader-oriented visual explanations. |
| `rendering-diagrams` | Render and inspect diagrams when rendering is material. |
| `inspecting-execution-evidence` | Investigate bounded traces, sessions, or execution results. |
| `assessing-determinism` | Identify evidence-supported deterministic improvements. |
| `recording-backlog-items` | Prepare bounded backlog proposals for the owning backlog procedure. |
| `drafting-changelog-entries` | Prepare concise history entries for the owning changelog procedure. |
| `delegating-bounded-work` | Prepare a bounded child handoff without transferring authority implicitly. |
| `observing-delegated-work` | Observe delegated progress, results, budgets, and terminal status. |
| `preparing-scoped-commits` | Prepare authorized validated changes without staging unrelated work. |
| `presenting-decisions` | Present bounded decisions, alternatives, uncertainty, and recommendations. |
| `choosing-change-methods` | Select appropriate change capabilities for bounded scopes and risks. |

These names follow the proposed `<present-continuous-verb>-<object>` pattern, such as `writing-code` for Writing code. Where the object is countable, use its plural form: `writing-tests` for Writing tests and `building-components` for Building components. Master skills use the same pattern. The names are a proposal, not current skill authority. Existing skills should be retained until an approved migration task establishes replacements, compatibility links, and validation.

## Proposed master skills

| Master skill | Outcome |
| --- | --- |
| `making-changes` | Make and validate general changes with the smallest applicable scopes and history treatments. |
| `building-components` | Build bounded component tasks with delegation, validation, history, and completion handoffs. |
| `implementing-tasks` | Run the existing task lifecycle for authorized bounded requirements. |
| `maintaining-components` | Inspect and apply the smallest evidence-supported component improvements. |
| `managing-as-is-records` | Create, align, and navigate durable component records. |
| `designing-mermaid-diagrams` | Produce bounded Mermaid views and validate their syntax and rendering when needed. |
| `managing-backlogs` | Maintain planning indexes and perform evidence-gated reconciliation. |
| `managing-changelogs` | Resolve and maintain durable histories independently of component-task use. |
| `spawning-subagents` | Launch, observe, recover, and hand off bounded delegated work under existing authority. |
| `exploring-execution-evidence` | Investigate bounded execution evidence and produce a cautious finding. |
| `consulting-humans` | Guide bounded decisions while preserving human agency. |
| `committing-completed-work` | Verify completion gates and prepare scoped durable handoffs. |

A master skill may be larger than a reusable skill because it carries workflow ordering, mandatory gates, optional modules, recovery, and stopping rules. It should compose reusable skills rather than duplicate their complete contracts.

## Design constraints

- Users select outcomes or master skills; they do not need to activate each reusable skill manually.
- Reusable skills remain independently usable for focused work, testing, review, and reuse by more than one master skill.
- Composition does not transfer authority. Task status, component records, backlog state, changelog ownership, delegation, and commits remain with their existing owners.
- Every workflow chooses the smallest applicable scope and may proceed without a component task when the change does not require one.
- Every consequential change has an explicit validation path and states residual risk.
- A master skill may omit changelog handling only when the applicable work contract explicitly permits no durable history; component-task completion retains the current changelog requirement.
- Existing repository behavior is not changed by this proposal. Adoption requires a separate bounded implementation and migration decision.

## Reserved for later

The following are deliberately deferred until the composition approach has been adopted and real consumers demonstrate a need:

- machine-readable skill metadata;
- formal `requires`, `produces`, `effects`, or dependency schemas;
- a skill registry or composition engine;
- automated ordering and compatibility checks;
- generic workflow profiles or a universal task abstraction;
- replacing all current operational skills with newly split files;
- a global rule that every change must use a component task;
- a global rule that every change must update a changelog.

The current proposal remains readable from the skill names, purposes, approach, examples, and design constraints. Future metadata must remain a compact aid to composition and must not duplicate the authoritative skill, task, component, backlog, or changelog contracts.

## Status and next decision

This is a proposal in the root `drafts` component. It is not a live skill catalog, repository-wide policy, task authority, or implementation plan. The next decision is whether to approve a bounded pilot that adds one general master workflow and a small set of reusable skills while preserving current skill contracts and validating component and non-component changes separately.
