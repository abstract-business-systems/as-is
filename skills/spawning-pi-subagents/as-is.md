
# Launcher Host-Config Resolution And Run Observability - as-is

## Purpose

The `spawning-pi-subagents` launcher is the repository's bridge between an agent
file and a Pi child process. Agent contracts own ordinary capability
declarations; this package owns admission, validation, and forwarding of those
declarations, while the Pi host/package owns tool implementations. The launcher
is a Pi adapter/procedure consumer of the host-neutral execution-contract
concepts; it does not define task authority or become the future contract owner.
The readiness decision retains the conceptual observation contract in
`docs/execution-contract.md` and does not create a shared runtime API until an
additional independent host adapter provides a concrete compatibility need.
Shared
agent front-matter parsing, canonical role lookup, declared-tool parsing, and
identity extraction are provided by the focused `agent-resolution.ts`
functionality consumed by both the launcher and in-process worker adapter. No
launcher branch may silently inject ordinary tools because of role identity.
Unsupported or unavailable declarations fail closed, with stricter read-only
safety profiles remaining explicit host caps. The focused agent-resolution behavior is covered by `scripts/agent-resolution.test.ts` and the launcher/worker behavioral suites.

### Parent integration ownership

The receiving `component-builder` owns semantic child-result review and
nearest-common-ancestor integration. This launcher performs only mechanical
handoff, durable evidence collection, and caller-HEAD ancestry observation; it
never merges, cherry-picks, resolves conflicts, or decides integration.

An isolated child commit is `pending-parent-integration` until the receiving
builder integrates it and ancestry proves it reachable from caller `HEAD`.
Parent-owned worktree changes, same-component in-process assistance, and
no-change work have no separate child merge; the parent must record an explicit
`no-separate-integration` disposition and still satisfy validation, descendant
closure, and scoped-commit gates.

Both subprocess and in-process delegation resolve the target agent's `model:`
and `thinking:` values through project configuration, so a child can name a
model preset and thinking level without inheriting caller-session settings or
relying on environment variables. The subprocess launcher passes the resolved
values explicitly to Pi; the in-process adapter resolves the corresponding
configured Pi model before creating its isolated session. The launcher fallback
uses the skill-owned compatible Pi package version and child runs remain
observable by default. The launcher now derives one exact Pi version from the
private package manifest and performs an extension-suppressed local version
preflight before dry-run output or child launch. The private package manifest
and lockfile own the direct Pi and TypeBox dependencies used by package scripts
and extension-facing checks; package-local build commands provide a bounded
dependency-resolution check. Repository-wide launcher fixtures retain their
repository-root execution contract because they exercise canonical agents,
skills, tools, and task records outside this component.


## Design

The component is organized around the following relationships and flow.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Launcher Host-Config Resolution And Run Observability**


### Delegation launch and observation flow

```mermaid
flowchart TD
    A["Delegation request"] --> B["Pi subprocess launcher"]
    B --> C["Detached child and<br/>observation"]
```



| Concern | Rule |
| --- | --- |
| Admission | Any agent declaring `call_subagent` may target any canonical role under `agents/<role>/agent.md`. |
| Diagnostic metadata | Caller name, parent job ID, target identity, and runtime lineage are diagnostic only, not authorization gates. |
| Target behavior | The target contract and host safety profile govern tools and behavior. |
| Execution authority | Task records, budgets, worktree/session boundaries, and completion gates remain authoritative for execution and handoff. |
| In-process adapter | The Pi extension resolves canonical targets independently of caller identity. |
| Expert profile | The expert target retains its fixed read-only inspection profile.
## Links

- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../../core/modules/agent-resolution/agent-resolution.ts](../../core/modules/agent-resolution/agent-resolution.ts) — shared canonical role, front-matter, declared-tool, and identity resolution functionality.
- [scripts/spawn-pi-subagent.ts](scripts/spawn-pi-subagent.ts) — subprocess launcher and detached supervisor adapter; it collects handoff observations but delegates pure eligibility to task control.
- [`../../core/modules/task-control/handoff-eligibility.ts`](../../core/modules/task-control/handoff-eligibility.ts) — pure task-control handoff decision consumed by the launcher.
- [`../../core/modules/context-resolution/configuration-resolver.ts`](../../core/modules/context-resolution/configuration-resolver.ts) — shared configuration-resolution functionality consumed by launcher and worker configuration adapters.
- [../../core/adapters/process/bounded-process-supervisor.ts](../../core/adapters/process/bounded-process-supervisor.ts) — shared mechanical process-group, timer, signal, stdio, and exit-observation boundary.
- [../../tools/evidence/worker-tools-observability.ts](../../tools/evidence/worker-tools-observability.ts) — focused bounded session and trace query functionality consumed by the Pi registration adapter.
- [../../tools/agent/subagent-tools.ts](../../tools/agent/subagent-tools.ts) — repository-owned bounded agent-tool implementation and host-service composition that retains role admission and call-subagent authority.
- [extensions/worker-tools.ts](extensions/worker-tools.ts) — package-owned, host-neutral versioned registration boundary; it has no repository-relative or environment-selected host imports.
- [package.json](package.json) — private package manifest owning direct Pi and TypeBox dependencies plus bounded package-local build commands.
- [bun.lock](bun.lock) — committed package dependency resolution and integrity evidence.
- [scripts/pi-version.ts](scripts/pi-version.ts) — manifest-derived exact version contract, bounded output parser, and probe-argument policy.

### Package-owned extension readiness

The package-owned subagent extension now provides a bounded Option A implementation. `skills/spawning-pi-subagents/extensions/worker-tools.ts` owns only a versioned, fail-closed registration boundary; `tools/agent/subagent-tools.ts` remains the repository host implementation; and `.pi/extensions/worker-tools.ts` is the explicit static adapter for interactive settings and launcher loading. The launcher loads `.pi/extensions/worker-tools.ts` under `--no-extensions`, so child behavior does not depend on ambient project package discovery or trust. This task does not claim independent installed-package operation.

The package boundary is a versioned host-services contract. The package owns Pi-facing registration mechanics and validates service version/tool identity; repository authority remains outside the package:

- canonical role and declared-tool resolution remains in `core/modules/agent-resolution`;
- model, provider, and thinking configuration remains in repository configuration resolution;
- component-context authority remains with the linked-context resolver and its tool boundary;
- task budget observation remains outside the package and never becomes a second task authority;
- trace persistence and session/evidence scope remain with observability and evidence owners.

The package entry must receive these services through an explicit, versioned API or a repository-owned adapter with a documented loading route. Hidden repository-relative imports and environment-selected dynamic imports are not acceptable installed-package boundaries. The contract must choose whether the distribution unit is repository-local or distributable; Pi-provided imports and `typebox` must follow the selected Pi peer/dependency rules without weakening the launcher’s exact `0.84.0` contract.

The supported Option A loading path keeps `.pi/settings.json` unchanged and continues to load the static `.pi` adapter for trusted interactive projects. The launcher explicitly loads the same adapter under `--no-extensions`; it does not rely on package discovery or alter trust behavior. Mermaid remains independently registered, and `evidence-validator-inspection-extension.ts` remains a separate fixed read-only launcher profile. The package entry is exported as a library boundary rather than advertised as an independently functional installed extension. The implementation retains rollback to direct registration if package or adapter validation fails. Independent installed-package host services remain a lower-preference backlog item.

### Restart reconciliation

`--jobs` now performs bounded restart reconciliation as an observation: when a runner is dead or missing, has no completion line, and its task record is non-terminal or unavailable, it appends one idempotent, source-labelled `recovery-candidate` event to the configured best-effort registry. The event records the job, observation time, reason, record state, and explicit `automaticRestart: false` with `retryAuthority: parent-or-user`; it must not emit task-record, worktree, session, log, component, or configured-directory paths, including through nested preservation references. Terminal records and completed registry entries are not reconciled. This does not mutate task records, restart children, reallocate budgets, cancel subtrees, or create retry authority; parent or user authorization remains required. The launcher retains internal filesystem operands for execution, but every handle, registry line, diagnostic, and lifecycle trace is subject to the fixed no-emitted-filesystem-path invariant and uses opaque logical references or bounded availability instead.
