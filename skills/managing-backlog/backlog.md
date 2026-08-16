# Managing Backlog Backlog

Planning index for the `skills/managing-backlog` component. Active work belongs
to its configured task record; completed items are removed after their summary
is recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| component-ownership-and-reconciliation | selected | 3 | 3 | Place each backlog proposal with the correct component and prevent competing entries | Extend backlog management to identify the owning component from `as-is.md` purpose and boundary, search ancestor and child backlogs for equivalent work, and safely split, move, combine, or remove entries while preserving identity, history, dependencies, notes, and links. | - | Focused checks demonstrate correct placement for new items, parent removal when an equivalent child item exists, bounded split/move/combine behavior, preserved historical rationale, valid schema and dependencies, and no changes outside authorized backlog components. | Requested after repository-wide backlog review. Coordination belongs at the nearest common ancestor; bounded implementation belongs in the owning child component. |
