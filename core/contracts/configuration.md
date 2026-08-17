# Root JSON Companion Configuration

**Contract collection:** [Core Contracts](index.md)

The root JSON companion is the repository machine-data entry point. This document records only the generic data and authority boundary; it is not a central registry of configuration keys, defaults, or consumer semantics. Each consumer owns the keys it reads, its defaults, validation, interpretation, and migration behavior. The root component owns only settings whose scope is genuinely repository-wide.

## Generic Data Boundary

| Data | Location | Generic rule |
| --- | --- | --- |
| Project configuration | Root or component JSON companion under `configuration` | The context resolver cascades JSON configuration from repository to target and reports provenance and diagnostics. |
| Task metadata | Root or component JSON companion under `task` | Task-control owns its schema and keeps task metadata local; it never cascades. |
| Durable component context | Component `as-is.md` | The managing-as-is-document skill owns purpose, design, relationships, and navigation. |
| Task narrative | Component task-control-selected Markdown filename | Task-control owns task-record naming and narrative shape. |
| Runtime state | Private user or temporary state | Runtime observations remain subordinate and cannot become configuration authority. |

The generic resolver owns JSON parsing, repository and symlink containment,
root-to-target configuration merge, provenance, diagnostics, and local-task
isolation. It does not define configuration namespaces, defaults, or consumer
policy. A consumer validates and interprets only its own configuration surface.
Unknown or malformed values are rejected by the owning consumer when its
contract requires strict validation. Fixed safety constraints remain higher
authority than project configuration.

## Consumer-Owned Configuration

Configuration ownership follows the implementation boundary rather than this
collection. Current examples include:

- `core/modules/task-control/task-record-policy.ts` owns task-record filename defaults and safe-basename validation.
- `core/modules/task-control/control-plane.ts` owns task-control scheduling and launch-admission interpretation.
- `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` owns launcher agent/model/provider/thinking configuration and defaults.
- `core/modules/observability/tracer.ts` owns observability configuration, defaults, retention, and sink behavior.
- The root component owns only repository-wide settings that have no narrower consumer.

This list is an orientation aid, not a second schema authority. The owning
implementation or its component contract is authoritative for each key. A new
namespace requires an identified consumer, bounded key set, defaults, validation,
precedence, and focused tests before it is introduced.

## Environment Controls

Environment variables are host controls or process facts, not project
configuration. They may provide approved secrets or local executable selection
where a host contract permits them, but they do not override project policy.
Secrets must not appear in JSON companion data, task narratives, logs, or other
tracked artifacts. The opt-in `AS_IS_LIVE_INTEGRATION=1` control enables the
provider-backed routing test; `PI_BIN` selects an explicitly approved local Pi
executable for the spawning launcher and live test. Keep these controls out of
JSON companions, `as-is.md`, and task records.

## Runtime Resolution

A host may derive an immutable normalized configuration view for one bounded
attempt and pass it to a detached worker. That copy is execution input, not
policy authority. The resolver provides source provenance and incomplete
status; the consumer remains responsible for applying defaults and deciding
whether an incomplete view blocks use. Runtime metadata must obey the emitted-
path policy and must not become a second configuration source, backlog, task tree,
history, approval store, or completion authority.
