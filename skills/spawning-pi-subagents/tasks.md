# Task

## Requirement
Create a readiness-only contract for `package-owned-subagent-extension`. Define the smallest stable package-to-host boundary, dependency/distribution model, supported Pi loading paths, compatibility-shim policy, focused validation, recovery, and scope exclusions needed before implementing package-owned worker-tool registration. Do not move files, change `.pi/settings.json`, alter launcher behavior, install packages, change trust policy, relocate Mermaid/evidence-validator functionality, or change task/runtime authority.

## Plan
1. Inspect the current package, extension topology, launcher explicit loading, repository-owned tool semantics, and Pi package/trust documentation.
2. Record the expert advice and the bounded readiness decision in this task and the durable component record.
3. Define the implementation-ready host-services contract and distinguish package-owned generic registration from repository-owned authority and adapters.
4. Record exact future artifacts, tests, compatibility conditions, recovery, residual risks, and exclusions.
5. Validate task records, content/navigation, backlog, JSON, and whitespace; obtain configured-preset final expert review; complete through the two-commit flow.

## Progress
Task-start selection is being prepared for the component-local readiness task. The configured expert (`large` → `@preset/abs-large`) advised that the implementation is blocked until a stable host-services contract is chosen. Current semantic implementation remains in `tools/agent/subagent-tools.ts` with repository-relative imports for role/configuration/context/tracing/evidence behavior; `.pi/extensions/worker-tools.ts` remains a thin registration adapter; the launcher explicitly loads the tools entry under `--no-extensions`; `.pi/settings.json` separately loads the worker and Mermaid extensions. Pi supports local packages with a `pi.extensions` manifest, but package loading is trust-gated and the current launcher must not silently switch to ambient project discovery.

The recommended readiness boundary is a versioned `SubagentHostServices` contract. The future package owns Pi-facing schemas, registration, bounded call mechanics, and configured-tool exposure. The repository host retains canonical role resolution, model/provider/configuration policy, component-context authority, task budget observation, trace persistence, and evidence scope policy. Environment-driven dynamic imports are rejected. The preferred future distribution path is a local/package-owned Pi manifest plus an explicit launcher entry, with the existing `.pi` adapter retained until package loading and no-duplicate behavior are proven. Mermaid and evidence-validator remain separate.

No implementation move or runtime change has been made. No descendants are authorized.

## Validation
Pending final record reconciliation. The expert plan review passed using only the configured `large` preset and identified implementation readiness blockers rather than authorizing a move. Pi documentation was read for extensions, packages, settings, and security/trust behavior. Validation scope for this readiness task is record/content/JSON/whitespace integrity; package loading and behavioral implementation tests belong to the later implementation task.

## Result
Pending. This task will produce a durable readiness contract, not a package move.

## Blockers And Escalations
The later package implementation remains blocked until this contract is accepted and a concrete host-services injection/loading route is implemented. The current Pi extension factory receives only `ExtensionAPI`; repository-specific services cannot be made self-contained by retaining hidden relative imports or environment-selected dynamic imports. No external service, provider, target write, package installation, or trust override is authorized.

## Recovery
Preserve `skills/spawning-pi-subagents/as-is.json`, this configured task narrative, and the selected backlog row until the readiness changelog evidence and completion commit are durable. If the host API or distribution decision remains ambiguous, leave the task active or blocked and do not authorize the package implementation. A future implementation must retain the current `.pi/extensions/worker-tools.ts` compatibility surface until package loading, launcher explicit loading, trust behavior, and duplicate-registration checks pass.

## Next Action
Write the readiness contract into the durable `as-is.md` record, update navigation/changelog evidence, validate the records, obtain final configured-preset review, and complete this readiness task before selecting the package implementation.
