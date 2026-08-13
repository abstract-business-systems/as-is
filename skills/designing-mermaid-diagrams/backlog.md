# Mermaid Component Diagrams Backlog

This is the planning index for the `skills/designing-mermaid-diagrams`
component, not task authority. Active work belongs to the component's
configured task record; completed items are removed after their summary is
recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| test-rendered-mermaid-navigation | open | 3 | 2 | Test rendered Mermaid navigation | Define a deterministic, local renderer-backed test that renders linked Mermaid nodes and verifies that generated output preserves resolving repository-relative targets, using the validation-fixtures containment map as bounded integration evidence and avoiding external services. | - | A documented local command or test renders the fixture map, verifies all four child-node URLs survive in its output and resolve to their `as-is.md#design` anchors, detects absent or rewritten links, records renderer/version/security assumptions and unsupported-renderer behavior, and keeps Markdown fallback validation distinct. | User-requested after fixture diagram links were restored. Generic renderer mechanics belong here; host-specific structural-container and fallback rules remain owned by `skills/managing-as-is-document`. |
