---
name: organizing-knowledge
description: Organizes notes, discussion, and project artifacts into durable, discoverable knowledge. Use when deciding where information belongs or restructuring project documentation.
---

# Organizing Knowledge

Turn information into durable, discoverable project knowledge without creating
documentation that duplicates, obscures, or outlives its value.

## Method

1. Extract facts, decisions, assumptions, open questions, and transient status.
2. Identify the information's owner, audience, authority, and expected lifetime.
3. Place it in the smallest durable artifact that has the required scope.
4. Link related authoritative artifacts instead of duplicating their contents.
5. Separate settled decisions from proposals and active task state.
6. Review for discoverability, accuracy, and stale or superseded content.

## Placement Rules

- Put enduring cross-project behavior in `design-principles.md`.
- Put executable, reusable procedures in `skills/<skill-name>/SKILL.md`.
- Put current project policy and durable task context in `as-is.md`.
- Put architecture, protocols, and design rationale in subject-named documents.
- Put host-specific integration instructions in a host-specific adapter or skill.
- Keep private runtime state, credentials, caches, verbose logs, and temporary
  tool output outside authoritative project knowledge.

## Quality Checks

- Prefer one authoritative home for a decision or rule.
- Preserve meaningful context, source, and rationale when compressing notes.
- Use hierarchy to group related knowledge, but do not create a level that has
  no distinct ownership or navigational purpose.
- Remove or clearly mark superseded material once its replacement is
  authoritative.
