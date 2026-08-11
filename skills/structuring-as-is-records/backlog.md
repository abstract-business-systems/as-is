# `structuring-as-is-records` Backlog

This planning index covers reusable structure and diagram rules for durable
`as-is.md` records. It is not task authority.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| add-parent-navigation-to-component-diagrams | open | 3 | 2 | Add reverse navigation from child diagrams to parents | Add an optional parent component link to child component diagrams, targeting the parent's `as-is.md#design` section, while preserving the bounded child view and avoiding hidden-provider disclosure. | structuring-as-is-records:link-as-is-diagram-components | Applicable child diagrams provide a resolving parent link in source and rendered output where supported; parent links are omitted only when parent context is genuinely unavailable or disclosure is inappropriate. | Reverse navigation complements parent-to-child links. |
