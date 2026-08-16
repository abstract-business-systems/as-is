# Pi Adapter Readiness

## Purpose

Record the smallest evidence-backed boundary for a future Pi host adapter without creating `core/adapters/pi/`, moving implementation, changing runtime behavior, or transferring task authority. This is a readiness record; the current static registration and launcher remain authoritative for present behavior.

## Current Surface Inventory

| Surface | Current owner | Consumer | Future Pi-adapter inclusion | Rollback owner and boundary |
| --- | --- | --- | --- | --- |
| `.pi/settings.json` extensions list | Repository static registration | Trusted interactive Pi settings | Remains the recovery/static projection; not moved by readiness | Repository root preserves the settings file and restores the prior extension list if a candidate registration fails |
| `.pi/extensions/worker-tools.ts` | Repository host adapter | Interactive Pi and launcher explicit loading | Candidate adapter may eventually replace only the Pi registration mapping; repository semantic tools remain outside | Launcher/worker owner restores this file and direct registration path |
| `.pi/extensions/worker-tools-observability.ts` | Repository thin evidence registration adapter | No current `.pi/settings.json` or normal launcher loading route; retained as a static compatibility/export surface only | Remains an unregistered/unloaded thin export unless a separately approved consumer is identified; semantic evidence stays in `tools/evidence/` | Evidence-tools owner preserves or removes only this compatibility surface after consumer and recovery evidence; no ambient discovery may activate it |
| `.pi/extensions/mermaid-tools.ts` | Repository Mermaid registration adapter | Interactive Mermaid rendering | Excluded unless a separately approved browser/Pi boundary proves shared ownership | Mermaid consumer retains its current registration and renderer fallback |
| `skills/spawning-pi-subagents/extensions/worker-tools.ts` | Skill package registration boundary | `.pi/extensions/worker-tools.ts` static adapter | Pi registration mechanics may be consumed by a future adapter; host semantics are excluded | Skill/package owner restores the versioned export and service-version gate |
| `skills/spawning-pi-subagents/package.json` and `bun.lock` | Skill package owner | Launcher, package build, extension imports | Exact dependency/distribution contract remains an input; no package split is authorized | Skill/package owner preserves manifest and lockfile and rejects candidates that alter the pinned contract |
| `scripts/pi-version.ts` and launcher Pi resolution | Launcher skill owner | Blocking, detached, dry-run, and version preflight paths | Pi executable selection and exact-version probing are adapter concerns; task and process authority remain excluded | Launcher owner restores current explicit/environment/skill-local/package-fallback resolution and preflight |
| Launcher argument construction and `--no-extensions --extension` loading | Launcher skill owner | Pi child process | Pi-specific argument mapping may be adapter-owned; task prompt, budget policy, process supervision, and path privacy remain excluded | Launcher owner preserves explicit loading and removes candidate argument changes on failure |
| `--approve`, `--no-approve`, and expert forced read-only profile | Launcher/Pi host boundary | Normal roles and evidence-validator role | Host approval-flag mapping may be adapter-owned; durable task approval remains task-control-owned | Launcher owner restores explicit flag mapping and forced expert denial/isolation |
| Evidence-validator inspection extension | Launcher-owned fixed safety profile | Read-only expert validation | Excluded from generic Pi adapter semantics except for explicit host loading mechanics | Launcher/expert owner preserves the fixed allowlist, same-worktree rule, no-approve, and no-provider profile |
| Observability trace emission and path-bearing projections | Observability owner plus launcher producers | Local and optional external trace sinks | Excluded from Pi adapter authority; adapter may provide only host facts after path privacy enforcement | Observability and launcher owners preserve opaque/reference-only output and bounded unavailable behavior |
| Evidence session/trace query projection | `tools/evidence/` owner | Declared agent-facing evidence tools | Excluded from Pi adapter authority; Pi registration is only a consumer surface | Evidence owner restores bounded exact-ID queries and no-path output policy |
| Task-control, process, Git/worktree, and completion evidence | Core task-control/process owners and receiving builder | Launcher and parent orchestration | Explicitly excluded from Pi adapter | Each existing owner retains its own recovery and authority boundary |

## Smallest Future Boundary

The future adapter boundary is limited to mapping the host-neutral execution contract to Pi-specific invocation: Pi executable/package selection, exact-version preflight, Pi session and model arguments, explicit extension loading/registration, and host approval-flag mapping. The adapter receives approved normalized inputs and returns source-labelled host observations. It does not define lifecycle policy, mutate task records, approve work, allocate budgets, supervise process groups, integrate commits, or serialize path-bearing metadata.

The package-owned extension is a reusable registration library, not proof of standalone installed-package worker semantics. Repository semantic services remain injected by the static adapter until a separately versioned host-services boundary is selected and proven. The Mermaid extension and evidence-validator profile remain separate consumers with their current safety and ownership boundaries.

## Provider-Free Fixture Matrix

| Fixture family | Owner and likely location | Expected bounded result | Future implementation gate |
| --- | --- | --- | --- |
| Static settings loading | Repository/Pi adapter owner; `.pi/settings.json` and launcher tests | The settings file declares only `worker-tools.ts` and `mermaid-tools.ts`; the observability export is not declared or ambiently loaded | Preserve the two declared settings entries and report missing/invalid declared extension as bounded load failure; unregistered observability export remains unavailable |
| Explicit launcher loading | Launcher owner; `scripts/spawn-pi-subagent.test.ts` | Normal roles explicitly load `.pi/extensions/worker-tools.ts` with `--no-extensions`; evidence validation explicitly loads its separate inspection extension; the observability export is not loaded | Candidate adapter must preserve both approved explicit routes, reject missing path/registration, and keep the unregistered observability export unavailable |
| Registration validation | Package owner; `extensions/worker-tools.test.ts` | Version mismatch, duplicate tool, invalid tool, and thrown registration fail closed before registration completes | Preserve package service-version and tool-name validation |
| Pi version success and failure | Launcher owner; `scripts/pi-version.ts` and launcher tests | Exact `0.84.0` succeeds; mismatch, unavailable, nonzero, malformed, and ambiguous probes fail before launch | Version preflight remains exact but is not treated as provider or extension compatibility |
| Package and lock consistency | Skill package owner; package build/inspection fixtures | Manifest and lockfile agree on pinned Pi and TypeBox dependencies; package-local build remains bounded | Reject candidate distribution changes without dependency, trust, and rollback evidence |
| Approval mapping | Launcher/Pi adapter owner; launcher dry-run tests | Normal `--approve` and `--no-approve` map explicitly; conflicting flags reject; expert profile forces `--no-approve` and fixed read-only tools | Durable approval remains task-control authority; CLI flags are host controls only |
| Evidence-validator isolation | Launcher/expert owner; launcher tests and inspection extension | No provider, no session persistence, same-worktree, fixed read-only tool allowlist, and no approval override | Candidate adapter cannot broaden expert capabilities or bypass the fixed profile |
| Package self-containment | Package/host-services owner; package export/build inspection | Current export is classified as repository-service-injected and not standalone; hidden relative/dynamic host imports remain prohibited | Independent operation requires separate versioned host-services evidence |
| Candidate rollback | Launcher/package owner; provider-free loading fixture | Candidate load/compatibility failure leaves static settings, static adapter, package export, manifest/lock, and current launcher route usable | Revert only candidate changes; preserve task authority and working registration |
| Direct path emission | Observability, launcher, and evidence owners; focused output tests | Absolute path input is omitted, replaced by opaque reference/resource class, or returns bounded unavailable; never serialized | Runtime enforcement must pass before claiming privacy conformance |
| Nested/configured/component-derived emission | Same owners; structured output and configuration fixtures | Nested path, configured directory, component/worktree/session/task/log path is omitted or bounded unavailable across every output surface | Shared policy may be reused only if it does not create a second authority or generic speculative framework |
| Handle/registry/diagnostic/trace/recovery output | Launcher/recovery and observability owners; lifecycle fixtures | No path-bearing handle, registry line, diagnostic, trace attribute, or recovery observation escapes | Each owner must prove its own projection and failure behavior |

## Compatibility And Recovery

The exact Pi `0.84.0` contract proves only selected executable/version preflight. It does not prove provider availability, Pi extension-loader behavior, project trust, package distribution, or standalone operation. Package fallback may install a pinned package into a local cache on first use and is an external setup effect, not provider-free evidence.

The recovery path is the unchanged `.pi/settings.json` registration list, static `.pi/extensions/` adapters, package export, manifest/lock contract, explicit launcher loading, and current task/process authority. A candidate is failed when loading, registration, exact-version, approval/isolation, package-boundary, rollback, or path-classification evidence is missing, contradictory, or unsafe. Remove or revert only candidate adapter artifacts and restore these working paths; never delete the static registration surface, weaken task authority, or infer compatibility from a successful process exit.

## Non-Authorizations

This readiness record does not authorize `core/adapters/pi/`, file moves, package splitting, ambient extension discovery, provider-policy changes, trust overrides, target writes, browser capability creation, path-emission implementation, task-control changes, process-supervision changes, Git integration, or standalone installed-package worker semantics.
