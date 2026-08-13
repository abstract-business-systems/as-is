# Changelog

- 2026-08-13: Clarified that an adequate Markdown navigation surface cannot replace a host-required diagram link. When a host requires a linked node, its Markdown fallback preserves renderer-independent navigation without creating an unrelated Links catalog entry. Focused diagram-target/fallback, content, task-record, and whitespace checks passed; Mermaid rendering remains untested.

- 2026-08-13: Clarified that a host-required Markdown fallback for a Mermaid-linked target does not justify repeating that target in an unrelated Links catalog unless it adds distinct working context. Focused contract inspection, `bun skills/managing-as-is-document/content-test.ts`, `python3 components/task-record-validator/task_record_validator.py .`, and `git diff --check` passed; Mermaid rendering remains untested.

- 2026-08-13: Added the generic preference for a taller, narrower ELK/TB flowchart when it improves readability, while retaining supported exceptions for host rendering or stated diagram meaning. Aligned the skill record with a named ELK example. Focused contract inspection, `git diff --check`, and read-only consistency review passed; Mermaid rendering remains untested because no repository renderer is configured.

- 2026-08-21: Completed backlog item `rename-mermaid-diagram-design-skill`. Renamed the skill directory and canonical frontmatter name to `designing-mermaid-diagrams`, updating catalogs, links, composition references, and durable component context without changing diagram responsibility or mechanics. Focused reference checks and `git diff --check` passed; Mermaid rendering remains untested because no repository renderer is configured.

- 2026-08-20: Completed backlog item `generic-designing-mermaid-diagrams`. Generalized the skill metadata and procedure to Designing Mermaid diagrams, added diagram-type selection and complete reader-oriented component context guidance, and updated durable catalog links. Focused content validation and `git diff --check` passed; Mermaid rendering remains untested because no repository renderer is configured.
