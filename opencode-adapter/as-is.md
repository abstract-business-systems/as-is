---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T17:00:05Z
constraints:
  cost:
    currency: USD
    allocated: 0.45
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 240
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Research the installed OpenCode CLI when available using fresh version and
    help output, and consult authoritative OpenCode documentation or repository
    sources where available. Record exact URLs or local commands/output, source
    freshness, and the exact version scope. Do not claim that `--auto`,
    `--yolo`, or any other option enables all-permissions unless authoritative
    source evidence or local installed CLI help verifies it; record conflicts
    rather than resolving them by assertion.
  - Update only this component record with one precise, actionable TODO for
    future adapter work. The TODO must require preflight detection and use of
    the verified supported all-permissions/YOLO option for the installed
    OpenCode version only inside an explicitly authorized disposable run with
    bounded scope; it must not implement adapter behavior or modify related
    components or documents.
  - The TODO must require post-launch fail-closed handling when a permission
    request occurs outside preflight or cannot be auto-approved: record the
    permission reason and state, terminate the OpenCode subprocess/process
    group and associated resources cleanly, and prevent a hung detached run.
  - The TODO and its evidence must define acceptance checks for version/flag
    detection, the selected permission profile, graceful shutdown and cleanup,
    no leftover processes/sessions/runtime entries, and residual risk when the
    CLI option is version-dependent.
  - Validate the durable record without changing parent or sibling records,
    `opencode-host-integration`, subprocess components, systemd history,
    `control-plane.md`, or the root `as-is.md`; record actual host-reported cost,
    host-observed wall-clock use, validation, residual risk, recovery, and next
    action before handoff. There are no child records.
---

# OpenCode Adapter

## Purpose

Preserve a bounded, authoritative research handoff for a future OpenCode
adapter permission-safety change without implementing adapter behavior here.
This component record is the durable task authority for the requested TODO.

## Requirement

Research current OpenCode CLI permission behavior, especially whether `--auto`,
`--yolo`, or another flag enables automatic approval of all permissions, using
fresh local installed-CLI evidence and authoritative official OpenCode sources
where available. Then add one actionable future-work TODO to this record that
covers safe preflight selection and fail-closed post-launch cleanup. Preserve
the existing `opencode-adapter.md` facts; do not modify it or any other
repository artifact.

## Plan

1. Inspect this record and the read-only adapter boundary documentation.
2. Capture the installed OpenCode version and relevant help output if the CLI
   is available; consult official documentation/repository sources and record
   exact provenance, version scope, and any conflict.
3. Add only the requested TODO and evidence to this record, with no adapter
   implementation or changes outside this component directory.
4. Validate the record and hand off the scoped durable update with measured
   host-use and residual-risk evidence.

## Progress

The component task record was created by the orchestrator because the requested
`opencode-adapter/as-is.md` did not exist. The repository already contains the
read-only architectural document `opencode-adapter.md`; it is not part of this
task's writable scope.

The configured `implementer` researched the installed CLI and authoritative
OpenCode sources. This task changed only this record. Adapter behavior,
subprocess handling, permissions, and all related components remain out of
scope.

## Research Evidence

Evidence was captured in fresh processes on 2026-07-27 UTC. No provider or
model was invoked; the local OpenCode commands below stop at version/help
parsing, and the other sources are documentation/repository fetches.

### Installed CLI

Local command/output at `2026-07-27T16:57:44Z`:

```text
$ command -v opencode
/usr/local/nvm/versions/node/v22.18.0/bin/opencode
$ opencode --version
1.17.18
```

The relevant fresh `opencode --help` and `opencode run --help` output was:

```text
      --auto          auto-approve permissions that are not explicitly denied (dangerous!)
                                                                          [boolean] [default: false]
```

The full `opencode run --help` invocation at `2026-07-27T16:58:52Z` returned
exit `0` and repeated that same `--auto` line. It did not display `--yolo` or
`--dangerously-skip-permissions` because those options are hidden in the
authoritative source below. The no-run parser checks
`opencode run --yolo --help` and
`opencode run --dangerously-skip-permissions --help` each returned exit `0`
with empty stderr; neither command contacted a provider or started a model
run.

### Official documentation and source

The current official permissions page, fetched at
`2026-07-27T16:57:56Z` with HTTP `200`, is:

- <https://opencode.ai/docs/permissions/>

Its exact relevant text says:

```text
Start OpenCode with --auto to automatically approve permission requests that are not explicitly denied.
You can also use auto mode with opencode run.
Explicit "deny" rules are still enforced. Auto mode only changes requests that would otherwise ask for approval.
```

The same page documents a configuration profile, not a CLI flag:
`"permission": "allow"` can set all permissions at once. This is not evidence
that `--auto` bypasses explicit denies or that the configuration is a supported
substitute for a version-detected CLI option.

The official tag `v1.17.18` exists at
<https://api.github.com/repos/anomalyco/opencode/git/ref/tags/v1.17.18>
and resolves to commit `b1fc8113948b518835c2a39ece49553cffe9b30c`. The tagged
CLI source fetched at `2026-07-27T16:58:32Z` is:

- <https://raw.githubusercontent.com/anomalyco/opencode/v1.17.18/packages/opencode/src/cli/cmd/run.ts>

Relevant source lines `242-252`, `274`, and `800-811` report:

```text
.option("auto", { ... describe: "auto-approve permissions that are not explicitly denied (dangerous!)" ... })
.option("yolo", { type: "boolean", hidden: true, default: false })
.option("dangerously-skip-permissions", { type: "boolean", hidden: true, default: false })
const auto = args.auto || args.yolo || args["dangerously-skip-permissions"]
if (auto) { ... permission.reply({ ..., reply: "once" }) ... }
... auto-rejecting ... permission.reply({ ..., reply: "reject" }) ...
```

Therefore the exact installed-version source scope (`1.17.18`) supports
`--auto` and also accepts hidden `--yolo` and
`--dangerously-skip-permissions` aliases that feed the same auto-approval
path. The source does not establish unrestricted permissions: the official
documentation's explicit-deny rule remains the applicable semantic limit.

For a current-source comparison, the official `dev` branch endpoint reported
at `2026-07-27T16:58:52Z`:

```text
name: dev
sha: 78f57643194c30c44da93ff3c052d6c5adffc139
```

The source and documentation at that pinned commit were fetched at
`2026-07-27T16:58:58Z`:

- <https://raw.githubusercontent.com/anomalyco/opencode/78f57643194c30c44da93ff3c052d6c5adffc139/packages/opencode/src/cli/cmd/run.ts>
- <https://raw.githubusercontent.com/anomalyco/opencode/78f57643194c30c44da93ff3c052d6c5adffc139/packages/web/src/content/docs/permissions.mdx>
- Branch metadata: <https://api.github.com/repos/anomalyco/opencode/branches/dev>

Those pinned current-source files report the same `auto`, hidden `yolo`, and
hidden `dangerously-skip-permissions` handling and the same explicit-deny
documentation. There is no semantic source conflict on `--auto`. There is a
documented-surface difference: the help and permissions page expose `--auto`,
while the exact `v1.17.18` and current pinned source retain the two hidden
aliases. That difference is version/source dependent and must not be resolved
by assuming that a hidden alias is portable.

## Future TODO (implementation out of scope)

- **TODO — add a version-gated, disposable permission-safe launch path in the
  future adapter:** Before launching OpenCode, run a fresh version/help or
  equivalent authoritative capability preflight, detect the exact installed
  version, and select only the verified supported all-permissions/YOLO option
  for that version. For the currently installed `1.17.18`, the documented
  choice is `--auto`; the hidden `--yolo` and
  `--dangerously-skip-permissions` aliases are source-verified but not exposed
  by help/docs, and `--auto` still preserves explicit denies. Use the selected
  option only inside an explicitly current-turn-authorized disposable run with
  bounded scope, and record the selected permission profile and launch scope.
  After launch, fail closed if a permission request occurs outside the
  preflight profile or cannot be auto-approved: record the permission reason,
  request, and state; cleanly terminate the OpenCode subprocess/process group
  and associated resources; await/verify termination; and enforce a bounded
  shutdown fallback so a detached run cannot remain hung. Acceptance evidence
  must show exact version/flag detection including an unsupported or version
  drift path, the effective permission profile and deny behavior, graceful
  shutdown/cleanup, no leftover processes/sessions/runtime entries, and the
  residual risk from version-dependent aliases or documentation/source drift.
  Do not implement this behavior or modify the adapter, parent, sibling, or
  related records in this task.

## Validation

Passed the task-specific evidence checks and record-scope checks:

- `opencode --version`, `opencode --help`, and `opencode run --help` were run
  fresh; version `1.17.18` and the documented `--auto` help line were observed.
- `opencode run --yolo --help` and
  `opencode run --dangerously-skip-permissions --help` both exited `0` without
  provider/model execution, confirming local parser acceptance while preserving
  the fact that the flags are hidden from help.
- Official docs and pinned official `v1.17.18`/current-`dev` source evidence
  were fetched and quoted above with timestamps, URLs, and version/commit
  scope. No unsupported all-permissions claim was made.
- `git diff --check -- opencode-adapter/as-is.md` passed after the record-only
  edit. The only intended durable change is this component record; there are no
  child records, so descendant closure is vacuously terminal.

Host-reported monetary cost is unavailable for this record update. The
configured fallback metric is validation elapsed-seconds (not monetary cost);
no provider/model call was made. The final local validation command measured
`2.229141` seconds using `node` `process.hrtime.bigint()` (host-observed
monotonic validation wall-clock; this is the validation phase, not a claim of
OpenCode run duration).

## Result

Completed the bounded research and durable handoff. The evidence verifies
`--auto` for installed OpenCode `1.17.18`, records the hidden source aliases
without overstating them as portable or unrestricted, and adds exactly one
future TODO. Implementation of adapter behavior is explicitly out of scope.

## Blockers And Escalations

None. The installed CLI and authoritative sources were available and did not
conflict semantically; the remaining documented-surface difference for hidden
aliases is preserved as residual risk rather than inferred away.

## Recovery

Recovery checkpoint: the completed record contains the exact local evidence,
official URLs/commit scopes, selected-option conclusion, one future TODO, and
validation/accounting limitations. Resume from this checkpoint with a future
explicitly authorized adapter implementation task; preserve the
component-only boundary and pre-existing unrelated work in the worktree.

## Next Action

The orchestrator should review this completed record and its scoped commit.
Future adapter work must begin with the version-gated disposable-run TODO
above; this task requires no adapter behavior change.
