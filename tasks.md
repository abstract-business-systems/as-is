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
The preceding package-ownership task established `@earendil-works/pi-coding-agent@0.84.0` as the skill-owned direct dependency and committed the package lock. The launcher resolves `--pi`, `PI_BIN`, nearest local `.bin/pi`, or the package fallback; it now derives the exact expected version from the skill manifest, probes the selected invocation with `--version --no-extensions`, and fails closed before dry-run output or child launch. Added `scripts/pi-version.ts` with the pure contract/parser/probe policy and focused launcher tests. The current extension entry points remain under `.pi/extensions/` and are out of scope for relocation.

No descendants are authorized.

## Validation
Focused validation passed: Pi version contract/parser/probe and source-branch tests passed (6 tests, 24 expectations), covering exact matching, malformed/ambiguous output, mismatch, unavailable, nonzero probe, explicit binary, `PI_BIN`, discovered skill-local binary, package fallback, and incompatible `PI_PACKAGE`; the full launcher suite reported 40 passes with three known unrelated baseline failures: repository thinking declaration, late-success budget fixture timeout, and caller-worktree ancestry fixture. The late-success timeout is a pre-existing lifecycle-fixture issue exposed while adapting stubs to the new probe; version-focused tests pass independently. Package launcher build passed. Direct version observations remain `0.84.0` for the skill-local binary and package fallback with `--version --no-extensions`. Task-record validation reported `VALID`; as-is/content navigation passed with 52 records and 50 diagrams; backlog content validation, JSON parsing, and `git diff --check` passed.

## Result
Implementation and required validation are complete within the bounded version-preflight scope. Fresh configured-preset expert validation reported PASS and judged the change safe to complete. No descendants were authorized; closure is vacuously terminal. The three broader launcher failures remain documented unrelated baseline risks.

## Blockers And Escalations
The normal local Pi invocation can discover repository extensions and report an unrelated missing-module error in this shell context; the extension-suppressed version probe reports `0.84.0` and is the bounded compatibility observation. The full launcher suite retains three known unrelated baseline failures recorded above. Final expert validation used only configured `large` → `@preset/abs-large` and found no scoped blocker. No provider or external service was used by the implementation or checks.

## Recovery
Preserve `as-is.json`, `tasks.md`, and the selected backlog row until the completion patch is ready. If version output is unavailable, ambiguous, or cannot be obtained without starting a child/provider, fail closed and retain the task active with the exact observation. Revert only the bounded preflight changes if implementation is interrupted; do not touch extension placement or host settings.

## Next Action
Write changelog evidence, remove the exact selected backlog row, delete task artifacts, and create the second completion commit.
