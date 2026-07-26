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
  terminology so artifacts align with existing paradigms.
- **Established practice by default:** Follow applicable practices, norms, and
  standards. Make an exception only for a concrete reason, and make that reason
  understandable from the surrounding context.
- **Reusable, composable blocks:** Prefer small capabilities and artifacts that
  can be combined in more than one context over one-off, tightly coupled
  solutions.
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
