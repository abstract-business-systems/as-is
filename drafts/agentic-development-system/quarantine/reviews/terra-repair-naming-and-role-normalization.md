# Terra repair specification — skill naming and purpose-based agent roles

This is a bounded, read-only advisory repair specification requested before the next review. It does not approve the design, create tasks, adopt contracts, or authorize implementation.

## Findings

- The proposed master skill `designing-and-aligning` is imprecise because alignment is a human decision or gate, not a capability owned by a skill.
- Later normative sections use Sol, Terra, Kimi, or Luna as if they were final target agent names. The target architecture should use purpose-based roles; model/profile labels belong only in an explicit exercise-only mapping.

## Repair specification

1. Rename `designing-and-aligning` to `developing-target-designs`. Define it as composing goal clarification, prototypes, structured target-design revisions, bounded review preparation, decision presentation, alignment recording, and design-change feedback. It supports alignment but cannot determine or record approval without human decision evidence.
2. Use purpose-based target roles:
   - design/prototyping agent for high-level design authorship and design-plan review;
   - expert for independent architecture, design, or alternate-family review;
   - component-builder for bounded detail planning, decomposition, integration, and recovery;
   - task-implementer for bounded authorized realization;
   - evidence-validator for acceptance-to-evidence assessment.
3. Replace normative Sol/Terra/Kimi/Luna workflow labels with those purpose-based roles in gates, diagrams, workflow steps, risks, decisions, headings, and next-action text.
4. Retain the four names only in an explicit non-target exercise mapping: Sol → design/prototyping-agent assignment, Kimi → independently admitted expert alternate-review assignment, Terra → component-builder detail-planning assignment, and Luna → task-implementer assignment only if separately authorized.
5. Require human review of the exact expert-reviewed detail plan after Sol/design-agent review. Keep this separate from kick-off and task authorization.
6. Present the high-level design as one combined human-facing document grounded in current `as-is.md` records, with appendices or separately owned attachments only where justified.
7. Keep benchmark content focused on workflow comparison. State that no project-specific workflow benchmark has run; do not substitute reviewer/model screening evidence for workflow evidence.

## User decisions

The user should confirm `developing-target-designs` as the proposed skill name and whether bounded detail planning remains a component-builder responsibility or later warrants a separate role. No implementation or target adoption is implied.
