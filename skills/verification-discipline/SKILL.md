---
name: verification-discipline
description: Establishes whether a bounded task satisfies its acceptance conditions using appropriate evidence. Use when selecting task-specific checks, collecting evidence, and recording supported completion claims and residual risk.
---

# Verification Discipline

Match validation depth to risk, from lightweight checks through end-to-end or
operational validation, and ground completion claims in observable evidence
rather than assertion.

## Method

1. Read the task's acceptance conditions and identify the smallest set of
   observable checks that establish sufficient completion for the task's risk
   level.
2. Select task-specific tools and checks that distinguish passing from failing
   behavior; prefer existing local automation over new checks.
3. Distinguish observation from inference: record what a tool reported directly
   and label derived conclusions as such.
4. Collect evidence from authoritative sources, recording provenance and
   freshness; note contradictions between sources.
5. Evaluate the evidence against each acceptance condition, not against a
   general sense of "done."
6. Record supported completion claims with the evidence that backs each claim
   and the residual risk that remains after the selected checks.
7. Stop when the evidence satisfies the acceptance conditions for the task's
   risk tier; escalate only when evidence is insufficient or contradicts a
   claimed outcome.

## Risk Tiers

- **Lightweight:** A bounded, low-risk change. Validate with the smallest
  relevant existing check (for example, a configuration schema validation, a
  discoverability command, or a static lint pass).
- **Standard:** A change with moderate impact or dependencies. Add a focused
  functional or integration check that exercises the changed path.
- **End-to-end:** A change with broad, user-visible, or operational impact.
  Validate with a full path through the affected behavior and confirm no
  regression in adjacent capabilities.

## Evidence Recording

- State the check performed, the command or tool used, and the observed result.
- Link or quote the authoritative output rather than restating it.
- Label inferred conclusions explicitly and keep them tied to supporting
  observations.
- Record residual risk: what the selected checks do not cover and what could
  still be wrong.

## Quality Checks

- The selected checks map directly to the task's acceptance conditions.
- Evidence is drawn from authoritative sources, not from assertion or
  repetition.
- Observation and inference are distinguishable in the record.
- Residual risk is stated alongside the completion claim.
- No specialist test procedure is duplicated; this skill selects and applies
  existing checks rather than defining them.
