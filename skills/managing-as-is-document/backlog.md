# Managing As-Is Document Backlog

This is the planning index for the proposed `managing-as-is-document` skill
component. It currently accompanies the existing `skills/managing-as-is-document/scripts/`
utilities and records the bounded work needed to establish the discoverable
skill and its durable component record. It is not task authority.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| add-parent-navigation-to-component-diagrams | open | 3 | 2 | Add reverse navigation from child diagrams to parents | Add an optional parent component link to child component diagrams, targeting the parent's `as-is.md#design` section, while preserving the bounded child view and avoiding hidden-provider disclosure. | - | Applicable child diagrams provide a resolving parent link in source and rendered output where supported; parent links are omitted only when parent context is genuinely unavailable or disclosure is inappropriate. | Restored from the removed `structuring-as-is-records` backlog during skill consolidation. The former dependency `structuring-as-is-records:link-as-is-diagram-components` has no current mapped backlog item, so it is preserved here as migration context rather than invented as a structured dependency. |
