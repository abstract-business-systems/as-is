# as-is Agent Backlog

Planning index for the `agents/as-is` component. Active work belongs to
its configured transient task record; completed items are removed after their
summary is recorded in `changelog.md`.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| separate-as-is-configuration-and-linked-context | open | 3 | 3 | Separate configuration from `as-is.md` while preserving explicit parent-context propagation | Design and later implement a separately scoped project/component configuration model without replacing `AGENTS.md` or treating it as an `as-is.md` substitute. Define how parent and component `as-is.md` records explicitly link to one another, and provide policy-enforced reader tools that resolve and expose the linked context needed by a component implementation without relying on ambient file discovery. Preserve `as-is.md` as the current authority until the replacement contract is reviewed. | Current `as-is.md` structure; `docs/configuration.md`; `docs/execution-contract.md`; `docs/component-task-record-protocol.md`; applicable reader/tool and component-builder launcher contracts. | A reviewed design specifies configuration scope and precedence, explicit parent/component links, bounded reader-tool APIs, provenance and incomplete-resolution behavior, authority boundaries, brownfield `AGENTS.md` coexistence, and migration compatibility. No implementation or `as-is.md` removal is authorized by this backlog item alone. | Follow-up discussion required before implementation. This item intentionally does not replace agent files or merge `as-is.md` content into `AGENTS.md`. |

