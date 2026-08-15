# Task

## Requirement
Complete `skills/spawning-pi-subagents:skill-owned-package-dependencies` by verifying and, where necessary, minimally reconciling the skill-local package manifest, lockfile, scripts, and runtime imports. Keep the package boundary limited to third-party runtime and focused-test dependencies. Do not move Pi extensions, implement Pi version preflight, change host integration, alter launcher/task authority, or broaden runtime behavior.

## Plan
1. Inspect the skill package manifest, lockfile, scripts, imports, package-owned node_modules, and prior dependency-ownership evidence.
2. Obtain a read-only expert plan review; if unavailable, record the provider blocker and use the repository evidence to avoid speculative changes.
3. Add only the smallest package-boundary or validation changes needed to make the acceptance contract observable.
4. Run package-local install/test/build checks and repository task/content/JSON/whitespace validation.
5. Obtain final expert validation when available, record residual risk, write changelog evidence, remove the exact backlog row, delete task artifacts, and create the second completion commit.

## Progress
The skill already has a private `package.json`, committed `bun.lock`, and installed package-local dependencies from prior evidence commit `9ee4c89`. Runtime-bearing package imports are either Bun/Node built-ins or the declared Pi and TypeBox dependencies. The package manifest currently exposes only a repository-root-relative worker-tool test script and does not provide a package-local launcher/build check. The existing launcher suite assumes repository-root cwd and therefore cannot be claimed as a package-local standalone suite without a separately bounded test-fixture refactor.

Plan review was attempted through the read-only expert role but was unavailable because the configured Mistral provider had no API key. No implementation edits have been made after task selection.

## Validation
Pending implementation. Baseline evidence from the committed package setup: `skills/spawning-pi-subagents/bun.lock` resolves the declared Pi `0.84.0` and TypeBox `1.3.7` dependencies; `bun build --no-bundle --target bun` succeeds for `scripts/spawn-pi-subagent.ts` and `scripts/evidence-validator-inspection-extension.ts`; the package-local dependency tree contains both direct dependencies. Running the launcher tests from the skill directory currently fails because the tests assume repository-root paths, and the worker-tool package command currently reaches the repository-root test but has one unrelated model-runtime fixture failure. These failures are recorded as residual baseline evidence, not completion.

## Result
Pending. The package manifest and lockfile are existing evidence, but the acceptance contract still requires a bounded package-local command/install proof and durable reconciliation. No completion claim is made from existing artifacts alone.

## Blockers And Escalations
Required expert review is unavailable in the configured provider environment (`No API key found for mistral`). This is a review-gate blocker for completion unless the authority explicitly permits a documented unavailable-review disposition. The package-local standalone acceptance is also not yet proven because focused tests contain repository-root assumptions; refactoring those tests may exceed the smallest package-dependency scope and requires review before expansion.

## Recovery
The task-start pair is `as-is.json` and `tasks.md`; preserve both until completion evidence and the second commit are ready. No descendants are authorized. If the package-local proof cannot be established without changing launcher test scope, leave the backlog row and task pair intact and request a narrower acceptance decision or a separate test-portability task.

## Next Action
Decide whether to narrow this task to reconciling existing package-ownership evidence or authorize a bounded package-test portability adjustment. Do not finalize while the acceptance gap and unavailable expert review remain unresolved.
