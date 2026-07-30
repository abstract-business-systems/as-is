---
name: context-building
description: Builds the smallest authoritative context set needed to make a bounded decision or handoff.
---

# Context Building

Build decision-ready context without copying the repository into a prompt or
creating a second source of truth.

## Procedure

1. State the bounded question, decision, or handoff and its acceptance need.
2. Identify authoritative records, applicable constraints, direct dependencies,
   and unresolved assumptions; prefer links and targeted excerpts.
3. Check freshness, authority, scope, and contradictions. Separate facts,
   inferences, and unknowns.
4. Compress only after preserving decision-relevant provenance and next action.
5. Stop when the acceptance need is supported; escalate missing authority or
   material ambiguity instead of guessing.

## Contract

**Input:** bounded objective, scope, and available repository context.
**Output:** a concise context set with sources, supported claims, assumptions,
unknowns, constraints, and the next safe action.
**Checks:** sources are authoritative and in scope; no duplicated authority,
secrets, or unnecessary detail; material uncertainty is explicit.
**Escalate:** when sources conflict, required context is unavailable, or the
objective would require expanding the authorized boundary.
