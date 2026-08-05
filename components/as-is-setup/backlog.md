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
| persisted-client-detection | open | 3 | 3 | Detect configured clients from durable persisted evidence | Detect client setup from persisted files and folders with explicit ambiguity reporting. | - | Detection is deterministic, does not use executable availability, and reports zero, one, or multiple persisted client signals without silently choosing an unsupported adapter. | Original dependency text: `setup.ts`; host configuration conventions. |
| canonical-resource-inventory | open | 3 | 3 | Discover canonical skills and agents from their authoritative folders | Inventory all canonical skills and agents from their respective bundle folders before wiring. | - | Every eligible `skills/<name>/SKILL.md` and `agents/<name>/agent.md` is considered; alternate folders and generated resources are ignored; inventory is test-covered. | Original dependency text: `skills/` and `agents/` conventions; `.agents/agents/` is the client projection path. |
| host-wiring-adapters | open | 2 | 2 | Keep client-specific setup wiring explicit and separate from shared detection | Separate host-specific wiring from shared detection and linking flow. | components/as-is-setup:canonical-resource-inventory, components/as-is-setup:persisted-client-detection | Pi, OpenCode, and generic agent wiring have explicit contracts, preserve unrelated configuration, and reject malformed configuration without partial replacement. | Original dependency text: `persisted-client-detection`, `canonical-resource-inventory`. |
| collision-and-recovery | open | 2 | 3 | Make setup collisions and interrupted runs safe to recover | Make collisions, stale links, and interrupted setup safe and diagnosable. | components/as-is-setup:host-wiring-adapters | Existing targets are never overwritten; broken or stale links are classified; rerunning is idempotent; recovery guidance is emitted and tested. | Original dependency text: `host-wiring-adapters`. |
| host-discovery-validation | open | 2 | 1 | Verify that supported clients discover their configured resources | Validate that each supported client actually discovers linked skills and agents. | components/as-is-setup:host-wiring-adapters | Fresh, non-destructive host inspection commands are documented and run where available; restart/trust requirements and unsupported-host residual risk are recorded. | Original dependency text: `host-wiring-adapters`. |
