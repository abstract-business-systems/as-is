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

| id | priority | component | outcome | dependencies | acceptance | status (open/deferred only) |
| --- | --- | --- | --- | --- | --- | --- |
| persisted-client-detection | High | `components/as-is-setup/` | Detect client setup from persisted files and folders with explicit ambiguity reporting. | `setup.ts`; host configuration conventions. | Detection is deterministic, does not use executable availability, and reports zero, one, or multiple persisted client signals without silently choosing an unsupported adapter. | open |
| canonical-resource-inventory | High | `components/as-is-setup/` | Inventory all canonical skills and agents from their respective bundle folders before wiring. | `skills/` and `.agents/agents/` conventions. | Every eligible `skills/<name>/SKILL.md` and `.agents/agents/<name>/agent.md` is considered; alternate folders and generated resources are ignored; inventory is test-covered. | open |
| host-wiring-adapters | Medium | `components/as-is-setup/` | Separate host-specific wiring from shared detection and linking flow. | `persisted-client-detection`, `canonical-resource-inventory`. | Pi, OpenCode, and generic agent wiring have explicit contracts, preserve unrelated configuration, and reject malformed configuration without partial replacement. | open |
| collision-and-recovery | Medium | `components/as-is-setup/` | Make collisions, stale links, and interrupted setup safe and diagnosable. | `host-wiring-adapters`. | Existing targets are never overwritten; broken or stale links are classified; rerunning is idempotent; recovery guidance is emitted and tested. | open |
| host-discovery-validation | Medium | `components/as-is-setup/` | Validate that each supported client actually discovers linked skills and agents. | `host-wiring-adapters`. | Fresh, non-destructive host inspection commands are documented and run where available; restart/trust requirements and unsupported-host residual risk are recorded. | open |
