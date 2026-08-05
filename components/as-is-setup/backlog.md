# as-is Setup Backlog

This is a planning index for bounded work owned by the `as-is-setup`
component. It is not active task authority; selected work gets a transient
the configured task record (default `tasks.md`) beside `as-is.md` and follows the component-task record protocol.
Completed work is removed from this index after its concise summary is recorded
in the component `changelog.md`; only open or deferred planning items remain.

## Flow For Agents

1. Read `as-is.md` and this backlog before changing setup behavior.
2. Determine whether the request is a resource-move, client-detection,
   host-wiring, collision/recovery, or validation concern.
3. Select the smallest open or deferred item whose dependencies are satisfied.
   If no item fits, add a bounded item here rather than expanding an existing one.
   Remove completed items after recording their durable summary in `changelog.md`.
4. Record the selected item, exact artifact boundary, acceptance conditions,
   and any external dependency in the configured task record before editing.
5. Keep the canonical setup skill and implementation in this component. Do
   not recreate the removed `skills/setting-up-as-is` path or maintain a second
   skill implementation.
6. Validate the focused component tests and the affected host inspection
   behavior, then record the handoff and residual risk.

## Items

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| collision-and-recovery | open | 2 | 3 | Make setup collisions and interrupted runs safe to recover | Make collisions, stale links, and interrupted setup safe and diagnosable. | components/as-is-setup:host-wiring-adapters | Existing targets are never overwritten; broken or stale links are classified; rerunning is idempotent; recovery guidance is emitted and tested. | Original dependency text: `host-wiring-adapters`. |
| host-discovery-validation | open | 2 | 1 | Verify that supported clients discover their configured resources | Validate that each supported client actually discovers linked skills and agents. | components/as-is-setup:host-wiring-adapters | Fresh, non-destructive host inspection commands are documented and run where available; restart/trust requirements and unsupported-host residual risk are recorded. | Original dependency text: `host-wiring-adapters`. |
