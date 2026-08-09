# Model Simplicity and Central Ownership

## Purpose

Define repository guidance that helps coding models prefer a simple, centralized
implementation over locally convenient duplication or unnecessary abstraction.
The guidance applies to design proposals, implementation prompts, and review of
model-generated changes.

## Problem

A coding model may optimize for the smallest local patch or immediate test
success. Without repository-wide discovery and explicit architectural
constraints, it can reproduce an existing rule, add a parallel fallback, or
introduce indirection instead of extending the canonical owner. This increases
concept count, maintenance cost, and the risk that equivalent behavior drifts.

## Design Decision

Model-assisted implementation must optimize for **one clear owner per rule**,
not for one giant module. A model should extend an existing cohesive owner when
that owner can satisfy the requirement. It may introduce a new component only
when repository evidence shows that the existing owner would cross a boundary,
create an incohesive responsibility, or fail a required acceptance condition.

Centralization is therefore a responsibility and ownership decision, not a
requirement to create a god service.

## Required Workflow

1. **Reconnaissance first.** Before editing, locate all existing
   implementations, callers, tests, configuration, and documentation for the
   behavior. Identify the canonical owner and its component boundary.
2. **Design proposal.** Describe the smallest viable change before writing
   code. Compare extending the canonical owner, adding a local implementation,
   and introducing an abstraction when those options are plausible.
3. **Central-owner preference.** Choose the canonical owner when it remains
   cohesive and can satisfy the requirement. Reuse established interfaces and
   patterns before adding a new class, wrapper, option, dependency, fallback,
   or execution path.
4. **Complexity budget.** Keep new files, concepts, branches, interfaces,
   configuration, and duplicated rules to the minimum needed for acceptance.
   Explain each material addition and record why reuse was insufficient.
5. **Implementation.** Implement only the approved design. Do not silently
   broaden the task because a local workaround appears convenient.
6. **Review pass.** Check for duplicated behavior, parallel ownership,
   unnecessary indirection, dead compatibility paths, and scattered policy.
   Confirm that callers use the canonical implementation.
7. **Focused validation.** Run the smallest relevant existing checks, including
   tests or static checks that detect duplicate ownership where such checks
   exist. Record residual risk when repository evidence cannot prove uniqueness.

## Prompt Contract

Prompts or agent instructions for model-assisted coding should include the
following constraints when central ownership is relevant:

> Inspect the repository before changing code. Find the canonical owner of this
> behavior and all existing implementations. Prefer extending that owner over
> adding a parallel implementation. Do not introduce a new abstraction,
> configuration option, wrapper, fallback path, or dependency without evidence
> that the existing design cannot satisfy the requirement. First describe the
> simplest proposed design and compare credible alternatives. Keep the patch to
> the fewest new concepts, branches, files, and duplicated rules. After
> implementation, verify that equivalent behavior remains centrally owned.

The contract is guidance, not permission to violate component boundaries,
security constraints, user approvals, or the task record protocol.

## Review Heuristics

A change needs reconsideration when it:

- duplicates validation, policy, transformation, or error handling already
  owned elsewhere;
- adds a fallback path without evidence of a real unavailable or incompatible
  dependency;
- creates a wrapper whose only purpose is to rename or forward an existing API;
- adds configuration for a single speculative use case;
- spreads one rule across multiple components without a deliberate boundary;
- passes local tests while leaving callers inconsistent; or
- claims that centralization requires a broad manager or god service.

A new abstraction is justified when its ownership, boundary, and acceptance
benefit are explicit and the simpler alternatives fail for a concrete reason.

## Acceptance Signals for Future Implementations

An implementation task using this design should demonstrate that:

- the canonical owner was identified before editing;
- the chosen design was compared with at least one credible simpler or local
  alternative;
- every new abstraction or execution path has a recorded concrete rationale;
- equivalent behavior is not duplicated across callers or components; and
- focused tests or static checks cover the centralized behavior and its callers.

## Scope and Ownership

This document governs model-assisted design and review guidance. It does not
replace component `as-is.md` records, backlog planning, task authority, or
component-local implementation contracts. A built implementation belongs in
the lowest component that can own it correctly; its design should then be
linked from that component's record.
