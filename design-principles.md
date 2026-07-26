# Design Principles

`as-is` treats human attention, interpretation, and repeated decision-making as
costly. It provides safe, usable defaults; permits explicit overrides; and
applies higher-authority constraints when they limit the valid choices.

## Authority Order

The effective behavior of `as-is` follows this order, from highest to lowest
authority:

1. Fixed safety invariants.
2. External, system, platform, governance, security, legal, and repository
   constraints.
3. Component-local policy.
4. Explicit user and project overrides.
5. Installed-bundle defaults.

A constraint narrows valid choices. An override chooses among otherwise valid
choices. A lower-authority setting cannot weaken a higher-authority constraint.

## Principles

- **Defaults first:** Begin with the safe, likely choice. Request human input
  only when a material decision cannot be safely inferred, delegated, or
  deferred.
- **Explicit override:** Every meaningful default has a visible, local, durable
  way to be overridden.
- **Names carry concepts:** Names usually represent concepts, roles, and
  responsibilities, not just markers. Prefer established de facto and de jure
  terminology so artifacts align with existing paradigms. Agents may select
  design-conformant names within their delegated boundary and communicate
  material, user-visible choices in their handoff or status report.
- **Exception escalation:** When evidence supports departing from an applicable
  non-fixed instruction, surface the proposed deviation, alternatives, reasons,
  and material effects to the caller, whether user, orchestrator, or delegating
  agent. Proceed only with the required authority; a lower-authority request
  cannot weaken a higher-authority constraint.
- **Purposeful presence:** An artifact, setting, abstraction, process, or
  retained state should exist only while it serves a concrete need. Before
  removing something as unneeded, assess its current consumers, recovery or
  audit value, ownership, and cost to recreate; remove or retain it deliberately
  rather than by default.
- **Established practice by default:** Follow applicable practices, norms, and
  standards. Make an exception only for a concrete reason, and make that reason
  understandable from the surrounding context.
- **Reusable, composable blocks:** Prefer small capabilities and artifacts that
  can be combined in more than one context over one-off, tightly coupled
  solutions.
- **Minimal change:** Select the smallest design and change that satisfies the
  stated acceptance conditions. Reuse an established local pattern before
  adding a new abstraction, configuration surface, artifact, or execution path;
  record the concrete need when introducing one. Treat that rationale and the
  changed-artifact set as reviewable evidence, not an implied assumption.
- **Hierarchical composition:** Coherent blocks build larger blocks, which in
  turn build the next level as needed. Place responsibility at the lowest level
  that can own it correctly.
- **Avoid premature optimization:** Do not add abstraction, configuration,
  complexity, or performance work before evidence shows it is needed.
- **Humans and systems collaborate:** Systems reduce mechanical and cognitive
  work, reveal consequential choices and constraints, and preserve human
  authority for intent, judgment, and accountability.
- **Least cognitive interruption:** Ask only questions whose answer materially
  changes a safe action.
- **Recoverable work:** Durable project context lets a new agent recover the
  current task and its next safe action without a chat transcript or local
  cache.
- **Progressive disclosure:** Start with the simplest successful path; expose
  advanced controls only when they become relevant.
- **Evidence over assertion:** Ground actions, completion claims, and exceptions
  in observable evidence.
- **Self-hosting consistency:** `as-is` uses its own skills and principles to
  establish and improve itself, and periodically checks that implementation and
  stated principles remain aligned.
