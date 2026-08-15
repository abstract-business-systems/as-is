# Task

## Requirement
Complete `skills/spawning-pi-subagents:pi-version-aligned-subagent-tools` using only the configured Pi package preset and the skill-owned package boundary. Define one explicit compatible Pi version contract, verify local binaries and package fallback before child start, and fail closed on mismatch or unavailable version evidence. Do not relocate extensions, change host integration, alter task authority, install a browser, contact a provider, or broaden launcher behavior beyond bounded version preflight.

## Plan
1. Inspect the skill package version, launcher resolution branches, extension loading paths, host-required entry points, and focused test conventions.
2. Obtain a read-only expert plan review using only the configured expert preset from root configuration.
3. Implement the smallest pure version-observation and fail-closed preflight surface; keep version parsing independent of process launch and provider access.
4. Add focused tests for exact matching, mismatch, unavailable, malformed, local binary, skill-local binary, and package-fallback cases.
5. Run focused tests, builds, task/content/backlog/JSON/whitespace checks, obtain configured-preset final expert review, and complete with the two-commit flow.

## Progress
The preceding package-ownership task established `@earendil-works/pi-coding-agent@0.84.0` as the skill-owned direct dependency and committed the package lock. The launcher currently resolves `--pi`, `PI_BIN`, nearest local `.bin/pi`, or the `@earendil-works/pi-coding-agent@0.84.0` Bun fallback without checking a resolved executable version. The Pi executable reports `0.84.0`; the fallback package reports `0.84.0`. The current extension entry points remain under `.pi/extensions/` and are out of scope for relocation.

No implementation edits have been made after task selection. No descendants are authorized.

## Validation
Pending implementation. Baseline observations: `skills/spawning-pi-subagents/node_modules/.bin/pi --version` reports `0.84.0`; `bun x --bun @earendil-works/pi-coding-agent@0.84.0 --version` reports `0.84.0`; the package manifest and lockfile declare/resolve `0.84.0`. These are direct observations, not yet a preflight contract.

## Result
Pending. The launcher currently has no version preflight, so the selected acceptance conditions are not yet satisfied.

## Blockers And Escalations
A local `pi --version` invocation attempted normal extension discovery and reported missing `typebox` from the repository extension imports in this shell context; the version output itself was still observed as `0.84.0`. This task must keep version checks independent of extension startup and should use `--no-extensions` or an equivalent bounded executable probe. No provider or external service is authorized.

## Recovery
Preserve `as-is.json`, `tasks.md`, and the selected backlog row until the completion patch is ready. If version output is unavailable, ambiguous, or cannot be obtained without starting a child/provider, fail closed and retain the task active with the exact observation. Revert only the bounded preflight changes if implementation is interrupted; do not touch extension placement or host settings.

## Next Action
Obtain configured-preset expert plan review, then implement and test the bounded version contract.
