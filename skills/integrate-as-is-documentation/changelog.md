# Changelog

- 2026-08-13: Corrected parent-container guidance after a duplicate-navigation refinement removed interactive child links. Structural child boxes retain resolving links, while Components tables provide required Markdown and renderer fallback. Focused diagram-target/fallback, content, task-record, and whitespace checks passed; Mermaid rendering remains untested.

- 2026-08-13: Refined record-adoption validation so Links contain only distinct working context, do not repeat Components, parent-navigation, or diagram-fallback targets, and omit routine source and test files absent the managing skill's stated exception. Focused contract inspection, `bun skills/managing-as-is-document/content-test.ts`, `python3 components/task-record-validator/task_record_validator.py .`, and `git diff --check` passed; Mermaid rendering remains untested.

- 2026-08-13: Aligned adoption guidance and durable context with the managed diagram convention: a named subsection for every view, an at-least-one-diagram invariant, contextual Links, and readable ELK/TB flowcharts where applicable. Focused contract inspection, `git diff --check`, and read-only consistency review passed; Mermaid rendering remains untested because no repository renderer is configured.

- 2026-08-12: Completed `integrate-as-is-documentation` by adding the reusable review-first adoption procedure, its durable component record, and focused content validation. The procedure covers whole-project and directory-scoped setup, semantic candidate evidence, human disposition, bounded records, parent diagrams, navigation, flow-view treatment, and path validation; no external project was modified.
