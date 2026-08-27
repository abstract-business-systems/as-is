# Target-design author repair specification — draft 7

This is the target-design author's bounded repair specification in response to the user's requested change. It is advisory design work only; it does not approve the design, adopt target contracts, create tasks, authorize kick-off, or authorize implementation.

## User-requested repairs

The user requested that the target design:

- exclude alternate-model and alternate-family reviews from the target system;
- define parent and child component handling;
- clearly specify the detailed instructions presented to a task implementer, including substantially blind execution within strict boundaries;
- define the disposition of unresolved questions; and
- replace the unnecessarily complex gate model with Interactive Design / Prototyping Phase → Human Review → Near-full-autonomous Implementation.

## Authorial changes applied

A successor to draft 6 was created as `draft7`. The successor:

1. Moves prior model/reviewer exercise details to explicitly non-normative historical provenance and states that alternate-model/family review is not a target-system requirement.
2. Replaces G0–G7 and the review-round lifecycle with three phases and one human decision: Interactive Design / Prototyping, Human Review, and Near-full-autonomous Implementation.
3. Treats task admission, result handoff, validation, parent integration, recovery, and descendant closure as operational controls inside implementation, not additional design gates.
4. Adds a component hierarchy and realization-ownership section covering parent accountability, child boundaries, delegation packets, structured child handoffs, nearest-common-parent ownership for cross-component work, integration, sibling restrictions, and descendant closure.
5. Defines the implementation packet delivered to the task implementer. It includes the accepted envelope revision, owner and escalation route, bounded outcome, ordered instructions, allowed/prohibited scope, capabilities, protected inputs, acceptance, deterministic validation, handoff evidence, budget, recovery, cancellation, and stop conditions.
6. States that the task implementer should be able to implement substantially blindly with respect to broader design discovery, while still obeying authority and safety controls and stopping on contradictions, missing dependencies, prohibited access, failed required validation, or out-of-envelope conditions.
7. Defines unresolved questions as resolved, non-blocking, or blocking. Blocking questions stop affected work and dependent descendants and escalate; permitted non-blocking defaults remain visible; retry does not answer a question.
8. Revises roles, skills, workflows, risks, decisions, unresolved questions, and next action to match the simplified lifecycle and hierarchy.

## Preserved invariants

- Human acceptance remains required for the exact design-and-implementation envelope and consequential changes outside it.
- Current state, accepted target, migration relationship, and realization status remain distinct.
- Skills and tools do not grant authority.
- Deterministic task admission, protected inputs, budgets, validation, recovery, evidence, integration, and closure remain authoritative.
- Parent accountability is not delegated away; a child result is not parent completion.
- Historical review records remain distinguishable from target-system contracts.

## Review readiness

Draft 7 is frozen for the next bounded review. The next reviewer should verify the three-phase lifecycle, absence of alternate-review requirements from target contracts, complete parent/child behavior, implementer packet completeness, unresolved-question handling, and preservation of safety controls. Human Review remains the required next authority-bearing decision; no implementation is authorized.
