# Sol repair specification — skill naming and purpose-based agent roles

This is a bounded, read-only advisory repair specification requested before the next review. It does not approve the design, create tasks, adopt contracts, or authorize implementation.

## Findings

- The proposed master skill `designing-and-aligning` is imprecise: alignment is a human decision or gate, not a capability owned by a skill.
- Later normative sections sometimes use Sol, Terra, Kimi, or Luna as if they were target agent names. Target architecture must use purpose-based roles; model/profile labels belong only in an explicit exercise assignment mapping.

## Repair specification

1. Rename `designing-and-aligning` to `developing-target-designs`. This is a lowercase-kebab capability phrase describing production and revision of target designs without implying approval authority.
2. Use these purpose-based target roles:
   - design/prototyping agent for high-level design authorship and design-plan review;
   - expert for independent architecture, design, or alternate-family review;
   - component-builder for bounded detail planning, decomposition, integration, and recovery;
   - task-implementer for bounded authorized realization;
   - evidence-validator for acceptance-to-evidence assessment.
3. Replace normative Sol/Terra/Kimi/Luna workflow labels with those purpose-based roles in gates, diagrams, workflow steps, risks, decisions, and next-action text.
4. Retain the four names only in a clearly marked non-target exercise mapping:
   - Sol profile → design/prototyping-agent assignment;
   - Kimi profile → independently admitted expert alternate-review assignment;
   - Terra profile → component-builder detail-planning assignment;
   - Luna profile → task-implementer assignment only if separately authorized.
5. Rename provisional contract questions from “for Sol” to “for target roles.”
6. Keep the existing combined human-facing document, human review of exact design-agent-reviewed detail plans, separate kick-off and task authorization, and workflow-focused benchmark discussion.

## User decision

The user should confirm `developing-target-designs` as the proposed skill name and whether detail planning remains a component-builder responsibility or later warrants a separate role. No implementation or target adoption is implied.
