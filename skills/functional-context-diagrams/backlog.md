# Mermaid Component Diagrams Backlog

This is the planning index for the `skills/functional-context-diagrams`
component, not task authority. Active work belongs to the component's
configured task record; completed items are removed after their summary is
recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| generic-mermaid-diagram-design | open | 3 | 3 | Make diagram guidance generic and useful for understanding complete component context | Generalize the functional-context-diagrams skill into a reusable Mermaid diagram-design skill that selects among appropriate Mermaid diagram types and explains a component's purpose, subcomponents, relationships, interactions, boundaries, consequential flows, and outcomes for readers of `as-is.md`, while excluding implementation detail unless a technical view is explicitly requested. | - | The skill has a generic name and description, bounded inputs, a method for selecting an appropriate Mermaid diagram type, reader-oriented guidance for component and subcomponent relationships and interactions, output requirements, validation checks, and escalation boundaries; focused documentation checks pass; existing functional-context guidance and links are migrated without duplicate authority. | User requested this as the reusable procedure to be called by `as-is` record guidance. Preserve authoritative prose and component ownership; do not require one universal diagram type. |
