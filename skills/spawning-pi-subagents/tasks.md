# Task

## Requirement
Implement the narrowed Option A for `package-owned-subagent-extension`: add a package-owned generic Pi registration/runtime boundary and route the existing repository worker implementation through an explicit static host adapter. Preserve worker semantics, role-declared admission, launcher `--no-extensions` loading, project trust behavior, Mermaid separation, and evidence-validator isolation. Do not claim independent installed-package operation.

## Plan
1. Add the lower-level package-owned registration/runtime boundary with a narrow versioned host-services contract and no repository-relative or environment-selected host imports.
2. Adapt the repository implementation through a static host adapter while preserving existing exports and focused worker semantics.
3. Keep `.pi/settings.json`, Mermaid registration, evidence-validator loading, and launcher explicit extension suppression/selection behavior unchanged except for the explicit adapter path if needed.
4. Add focused package/adapter tests and update existing launcher/worker tests only where the ownership boundary changes.
5. Validate package builds, focused behavioral suites, launcher dry-run, evidence-validator and Mermaid non-regressions, records/content/JSON/whitespace, and final configured-preset review.
6. Complete through the two-commit lifecycle; retain the lower-preference `standalone-package-worker-host` backlog item for future independent package operation.

## Progress
Task selected after the completed readiness contract and expert trade-off review. The user chose the easier Option A and requested that the larger independent-package goal remain backlogged with lesser user preference. Current worker semantics are in `tools/agent/subagent-tools.ts`; `.pi/extensions/worker-tools.ts` is the interactive registration adapter; the launcher explicitly loads `tools/agent/subagent-tools.ts` under `--no-extensions`; Mermaid and evidence-validator remain separate. No implementation changes have yet been made.

The implementation boundary must be explicit and static: package code owns generic Pi registration/runtime mechanics and public service types; repository code supplies existing role/configuration/context/budget/tracing/evidence services through a static adapter. No package code may infer host services from cwd, environment module paths, or hidden relative imports. A bare package registration must fail closed or remain a library entry until services are injected.

No descendants are authorized.

## Validation
Pending implementation. Readiness expert review concluded that direct installed-package operation is blocked by Pi's `ExtensionAPI`-only factory and the absence of a documented service injection channel. The chosen bounded Option A is implementable without changing worker semantics, but does not claim independent package operation. The lower-preference future backlog item records that larger scope.

## Result
Pending.

## Blockers And Escalations
Do not expand into a separately distributed host-services package, broad tools relocation, project settings/trust change, automatic package installation, Mermaid migration, evidence-validator merge, task/runtime redesign, or provider/live-network validation. If the package/adapter boundary cannot be implemented without duplicating authority or hidden host discovery, stop and record the blocker rather than weakening the contract.

## Recovery
Retain the current `.pi/extensions/worker-tools.ts` and direct repository worker implementation until focused package, adapter, duplicate-registration, launcher, and existing worker tests pass. On package import, service-version, build, or behavioral failure, restore the adapter's direct registration path without changing settings, trust, launcher safety profiles, Mermaid, or evidence-validator behavior. Keep this task record and the selected backlog row until the changelog completion evidence and second commit are durable.

## Next Action
Implement the package boundary and static adapter, then validate and obtain final configured-preset expert review before completion cleanup.
