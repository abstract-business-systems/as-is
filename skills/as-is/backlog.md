# Managing As-Is Document Backlog

This is the planning index for the proposed `managing-as-is-document` skill
component. It currently accompanies the existing `skills/as-is/scripts/`
utilities and records the bounded work needed to establish the discoverable
skill and its durable component record. It is not task authority.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| as-is-diagram-communication-guidance | open | 3 | 2 | Make `as-is.md` diagrams explain the complete reader-understandable component context | Define in the managing-as-is-document skill what an `as-is.md` diagram must communicate: the component's purpose, actors or users, one or many meaningful subcomponents, their responsibilities, relationships, interactions, boundaries, authority changes, consequential flows, alternate or rejected paths, and observable outcomes. Require reader-oriented functional labels and exclude implementation details unless a separate technical view is explicitly requested. | skills/functional-context-diagrams:generic-mermaid-diagram-design | The skill guidance states when a diagram is useful, selects an appropriate Mermaid diagram type through the generic diagram skill, and requires diagrams to make the component and subcomponent context understandable without implementation knowledge; the guidance preserves authoritative prose, validates Mermaid syntax and links, and records assumptions or omitted detail. | This is the follow-up previously recorded in the skills-component backlog; it belongs here because `managing-as-is-document` owns the `as-is.md` maintenance procedure. The generic Mermaid skill owns reusable diagram design, while this item owns how that procedure is applied to `as-is.md`. |
