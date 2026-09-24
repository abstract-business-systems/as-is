// QR2 machinery: seed builder. Creates the identical seed state both arms receive:
// fixture specification (Part A), harness facilities doc, delegation configuration
// surface, empty working tree, and administrative artifact classes (harness-named paths).
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { MODEL } from "./config.ts";
import { join } from "node:path";

export const ADMIN = {
  taskActive: ".harness/task/active.md",
  taskState: ".harness/task/state.md",
  authorization: ".harness/authorization",
  evidence: ".harness/evidence",
  decision: ".harness/decision",
  draft: ".harness/draft",
  handoffs: ".harness/handoffs",
  checkpoints: ".harness/checkpoints (harness-managed, read-only)",
};

export const DELEGATION_CONFIG = {
  provider: "openrouter",
  defaultModel: MODEL,
  defaultThinkingLevel: "high",
  models: { balanced: MODEL },
  roles: {
    implement: { model: null, thinking: "high", mode: "write-own-subtree-no-commit" },
    analyze: { model: null, thinking: "high", mode: "read-only" },
    validate: { model: null, thinking: "high", mode: "read-only-validation-of-supplied-evidence" },
  },
};

export function writeSeed(ws: string, fixtureSpecPath: string): void {
  rmSync(ws, { recursive: true, force: true });
  mkdirSync(join(ws, ".harness"), { recursive: true });
  for (const d of ["task", "authorization", "evidence", "decision", "draft", "handoffs"]) {
    mkdirSync(join(ws, ".harness", d), { recursive: true });
  }
  cpSync(fixtureSpecPath, join(ws, "FIXTURE-SPEC.md"));
  writeFileSync(join(ws, "HARNESS.md"), HARNESS_MD);
  writeFileSync(join(ws, ".harness", "delegation-config.json"), JSON.stringify(DELEGATION_CONFIG, null, 1));
  writeFileSync(join(ws, ".harness", "task", "active.md"), "(harness writes the active task here at phase start)\n");
  writeFileSync(join(ws, ".harness", "task", "state.md"), "(harness writes the task-state representation here at phase start)\n");
}

export const HARNESS_MD = `# Harness facilities (identical for both arms)

## Your operating context

You are building QueueRelay from scratch per FIXTURE-SPEC.md. The working tree is empty except for this harness area. Your phase task and authorization are in \`.harness/task/active.md\` and \`.harness/authorization/\`. Administrative artifact classes and their harness-named paths:

- Task pair: \`.harness/task/active.md\` (the active task) and \`.harness/task/state.md\` (the task-state representation). Both are writable when the phase's authorization allows task-state writes; mark both when the phase requires marking state (e.g. \`interrupted\`).
- Authorization: \`.harness/authorization/<phase>.md\` (harness-issued; read-only for you).
- Evidence: \`.harness/evidence/\` (your consultation evidence, test evidence, validation reports).
- Decision: \`.harness/decision/\` (decision artifacts where a phase requires one).
- Draft: \`.harness/draft/\` (non-authoritative proposals and interruption drafts).
- Handoffs: \`.harness/handoffs/<session-id>.md\` — every session must write its handoff here before finishing, with the fields required by FIXTURE-SPEC §5.

Keep task state, authorization, drafts, decisions, and evidence in these administrative artifacts — never in durable design records. Proposed, interrupted, or unvalidated work is not design.

## Tools

- \`freeze_manifest(manifest)\` — your first act (level-0 session only). The manifest maps every component role to: \`level\`, \`parent\` (manifest role name or null), \`subtree\` (your owned directory, e.g. "src/delivery"), \`record\` (your authoritative design record path inside your subtree), \`impl\` (implementation member paths), \`tests\` (test file paths), \`children\` (reserved child role names). Plus \`admin\` (at minimum \`evidence\` — where you put evidence; harness-named classes above stay where they are) and \`entrypoint\` (see below). The harness validates ownership disjointness (subtrees must not overlap; records and members inside own subtree; parent/child declarations consistent), freezes it, plants a stub record at each role's record path, and enforces it for the rest of the run.
- \`delegate(component, role, task, model?, thinking?)\` — start a bounded child session for a manifest component role. \`role\`: \`implement\` (write-capable within its own subtree, may not commit), \`analyze\` (read-only), \`validate\` (read-only validation of supplied controlled-worktree evidence). Returns the child session id and the resolved delegation configuration (explicit authorized override -> role setting -> named-alias lookup with literal-ID passthrough -> project default). Children run concurrently — two delegate calls in one turn start two sibling sessions.
- \`observe(session_id)\` — wait for the child to finish; returns its status and handoff file location. Observe before integrating.
- \`checkpoint(label)\` — record an immutable tree checkpoint (harness-managed under \`.harness/checkpoints\`). Use where the phase requires integration checkpoints.

## Manifest entrypoint requirement

\`entrypoint\` is a Python module path (e.g. "src/entry.py") exposing the composition's stable public behavior so the harness can verify acceptance deterministically:

- \`deliver(event: dict) -> list[dict]\` — routes one event through the composition and returns the normalized delivery outcomes in deterministic order.
- \`set_retry_policy(additional_attempts: int) -> None\` — configures additional attempts after the initial call.

This entry point is the stable domain contract made operational; it must require no external services.

## Delegation configuration

\`.harness/delegation-config.json\` is the launching client's delegation configuration (identical for both arms): \`defaultModel\`, \`defaultThinkingLevel\`, \`models\` (named aliases), \`provider\`, and per-executor-role settings. Resolve per FIXTURE-SPEC and your operating instructions; the delegate tool reports the resolution it applied.
`;
