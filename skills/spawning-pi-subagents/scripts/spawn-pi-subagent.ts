import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { appendFile, mkdtemp, open, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { assertPiVersionCompatible, loadPiVersionContract, versionProbeArguments, type PiInvocation } from "./pi-version.ts";
import { boundedLimit } from "../../../core/modules/task-control/budget.ts";
import { runBoundedProcess } from "../../../core/adapters/process/bounded-process-supervisor.ts";
import { emitTrace, startSpan, serializeSessionReference, type SessionReference } from "../../../core/modules/observability/tracer.ts";
import { evaluateHandoffEligibility, type HandoffFacts } from "../../../core/modules/task-control/handoff-eligibility.ts";
import { resolveInstructionContext } from "../../../core/modules/context-resolution/instruction-resolver.ts";
import { findConfigurationRootSync, isTaskNarrativeFilename, parseAsIsJson, resolveConfigurationSync } from "../../../core/modules/context-resolution/configuration-resolver.ts";
import { parseThinkingLevel, resolveThinkingLevel, type ThinkingLevel } from "./agent-thinking.ts";
import {
  parseAgentFrontMatter,
  parseDeclaredTools,
  identityFromAgent,
  type AgentDefinition,
} from "../../../core/modules/agent-resolution/agent-resolution.ts";

type Options = {
  agent?: string;
  task?: string;
  cwd: string;
  pi?: string;
  model?: string;
  thinking?: string;
  noSession?: boolean;
  tools?: string;
  skills: string[];
  approve?: boolean;
  noApprove?: boolean;
  noTools?: boolean;
  dryRun: boolean;
  detach?: boolean;
  noRegistry?: boolean;
  noWorktree?: boolean;
  record?: string;
  caller?: string;
  parentJobId?: string;
  jobs?: boolean;
  supervise?: { configPath: string };
  budgetWallClockSeconds?: number;
  budgetCostUsd?: number;
};

type LaunchProfile = {
  expertValidation: boolean;
  tools: string | undefined;
  skills: string[];
  noSession: boolean;
  noExtensions: boolean;
  extensionPath: string;
  noApprove: boolean;
  worktree: boolean;
};

// The handle printed to stdout (detach) and written as the registry launch
// line. `pid` is the supervisor pid — the budget owner and the cancel target.
// The supervisor is the direct parent of the Pi child, so this pid outlives the
// launcher process and keeps the child's wall-clock budget enforced even if the
// launcher (or its parent agent) is killed. `worktreePath` is the isolated git
// worktree the child runs in (pruned from the caller's HEAD), so the child's
// destructive git operations cannot reach the caller's uncommitted work.
type Handle = {
  jobId: string;
  pid: number | null;
  identity: string;
  caller: string;
  parentJobId: string | null;
  logPath: string | null;
  recordPath: string | null;
  worktreePath: string | null;
  sessionPath: string | null;
  budgetWallClockSeconds: number | null;
  budgetCostUsd: number | null;
  launchedAt: string;
};

type SuperviseConfig = {
  command: string;
  contextProjectRoot?: string | null;
  contextProjectRelativeToGitRoot?: string | null;
  contextComponentRelativeToProject?: string | null;
  contextTaskRecordNames?: string[];
  args: string[];
  callerCwd: string;
  worktreePath: string | null;
  sessionPath: string | null;
  mode: "detach" | "blocking";
  logPath: string | null;
  resultPath: string;
  registryPath: string | null;
  jobId: string;
  identity: string;
  caller: string;
  parentJobId: string | null;
  recordPath: string | null;
  budgetWallClockSeconds: number | null;
  budgetCostUsd: number | null;
};

const BUDGET_STOPPED_EXIT_CODE = 124;
const BUDGET_KILL_GRACE_SECONDS = 5;

const sessionReferenceFromEnvironment = (): SessionReference | undefined => {
  const value = process.env.PI_SESSION_FILE;
  if (!value) return undefined;
  const match = basename(value).match(/_(.+)\.jsonl$/u);
  return match ? serializeSessionReference({ sessionId: match[1] }) : undefined;
};

const recordComponentTrace = async (cwd: string, event: Record<string, unknown>): Promise<void> => {
  const traceId = String(event.traceId ?? process.env.AS_IS_TRACE_ID ?? "component-build");
  const spanId = String(event.spanId ?? Math.random().toString(16).slice(2));
  await emitTrace({
    name: String(event.name ?? "component-build"),
    traceId,
    spanId,
    attributes: Object.fromEntries(Object.entries(event).filter(([key]) => !["name", "traceId", "spanId"].includes(key))) as Record<string, string | number | boolean | undefined>,
    sessionReference: sessionReferenceFromEnvironment(),
  }, cwd);
};

const usage = `Usage:
  bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts [options]

Required (unless --supervise or --jobs):
  --agent <path>             Agent Markdown file to load
  --task <text>              Task direction

Optional:
  --cwd <path>               Child working directory (default: current directory)
  --pi <path>                Local Pi executable (default: PI_BIN or Bun package runner)
  --model <model>            Override the agent file model
  --thinking <level>         Override the agent/project thinking level
                             (off, minimal, low, medium, high, xhigh, max)
  --no-session               Do not persist the child session
  --tools <names>            Comma-separated Pi tool allow-list
  --skill <path>             Additional skill file or directory (repeatable)
  --approve                  Trust project-local files for this run
  --no-approve               Ignore project-local files for this run
  --no-tools                 Disable all Pi tools
  --dry-run                  Print the resolved launch without starting Pi
  --detach                   Launch the child under a detached bounded supervisor
                             that is the child's direct parent, and return a
                             handle without blocking. The supervisor owns the
                             wall-clock budget and survives this launcher's exit
  --no-registry              Do not append a handle to the job registry
  --no-worktree              Run the child in the caller's working directory
                             instead of an isolated git worktree (disables
                             isolation; use only when the caller has no
                             uncommitted work to protect)
  --record <path>            Component as-is.md record path to include in the
                             detach handle (the parent usually knows this)
  --caller <identity>        Identity of the delegating caller (default: the
                             AS_IS_IDENTITY env var, or "user" for a root launch)
  --parent-job-id <id>       Job id of the delegating parent (default: the
                             AS_IS_JOB_ID env var, or null for a root launch)
  --budget-wall-clock-seconds <n>
                             Hard wall-clock budget enforced by the supervisor
  --budget-cost-usd <n>      Monetary cost budget (USD) forwarded to the child
                             agent for self-limiting; not launcher-observable
  --jobs                     Print the status of all registered jobs (process
                             liveness, budget, caller lineage, and task-record
                             status fused from the registry) without starting Pi
  --help                     Show this help
`;

const valueOptions = new Set([
  "--agent",
  "--task",
  "--cwd",
  "--pi",
  "--model",
  "--thinking",
  "--tools",
  "--skill",
  "--record",
  "--caller",
  "--parent-job-id",
  "--budget-wall-clock-seconds",
  "--budget-cost-usd",
]);

const parseOptions = (args: string[]): Options => {
  const options: Options = {
    cwd: process.cwd(),
    skills: [],
    dryRun: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--help") {
      process.stdout.write(usage);
      process.exit(0);
    }
    if (option === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (option === "--approve") {
      options.approve = true;
      continue;
    }
    if (option === "--no-approve") {
      options.noApprove = true;
      continue;
    }
    if (option === "--no-session") {
      options.noSession = true;
      continue;
    }
    if (option === "--no-tools") {
      options.noTools = true;
      continue;
    }
    if (option === "--detach") {
      options.detach = true;
      continue;
    }
    if (option === "--no-registry") {
      options.noRegistry = true;
      continue;
    }
    if (option === "--no-worktree") {
      options.noWorktree = true;
      continue;
    }
    if (option === "--jobs") {
      options.jobs = true;
      continue;
    }
    if (option === "--supervise") {
      const configPath = args[index + 1];
      if (!configPath || configPath.startsWith("--")) {
        throw new Error("--supervise requires <configPath>");
      }
      options.supervise = { configPath };
      index += 1;
      continue;
    }
    if (option === "--budget-wall-clock-seconds" || option === "--budget-cost-usd") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${option}`);
      }
      index += 1;
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`${option} must be a non-negative number, got: ${value}`);
      }
      if (option === "--budget-wall-clock-seconds") options.budgetWallClockSeconds = parsed;
      else options.budgetCostUsd = parsed;
      continue;
    }
    if (!valueOptions.has(option)) {
      throw new Error(`Unknown option: ${option}`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${option}`);
    }
    index += 1;
    if (option === "--skill") options.skills.push(value);
    else if (option === "--agent") options.agent = value;
    else if (option === "--task") options.task = value;
    else if (option === "--cwd") options.cwd = value;
    else if (option === "--pi") options.pi = value;
    else if (option === "--model") options.model = value;
    else if (option === "--thinking") options.thinking = value;
    else if (option === "--tools") options.tools = value;
    else if (option === "--record") options.record = value;
    else if (option === "--caller") options.caller = value;
    else if (option === "--parent-job-id") options.parentJobId = value;
  }

  if (options.approve && options.noApprove) {
    throw new Error("Use only one of --approve and --no-approve");
  }
  if (!options.supervise && !options.jobs) {
    if (!options.agent) throw new Error("--agent is required");
    if (!options.task) throw new Error("--task is required");
  }

  return options;
};

const resolveFromCwd = (value: string, cwd: string): string =>
  isAbsolute(value) ? value : resolve(cwd, value);

type ProjectModelConfig = {
  defaultModel?: string;
  defaultThinkingLevel?: ThinkingLevel;
  models: Record<string, string>;
  provider?: string;
  taskRecordNames?: string[];
  componentBuildTracer?: {
    backend?: string;
    enabled?: boolean;
    endpoint?: string;
    directory?: string;
  };
};

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const string = (value: unknown): string | undefined => typeof value === "string" ? value : undefined;

// The launching client's cwd is the project-context origin. A project root is
// the nearest ancestor whose companion data declares a configuration object.
const findProjectRoot = async (clientCwd: string): Promise<string | undefined> => findConfigurationRootSync(clientCwd);

const readProjectModelConfig = async (projectRoot: string): Promise<ProjectModelConfig> => {
  const resolution = resolveConfigurationSync(projectRoot, ".");
  if (!resolution.complete) throw new Error(resolution.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
  const config = object(resolution.configuration);
  const agents = object(config.agents);
  const records = object(object(config.records).filenames);
  const tracing = object(object(config.observability).tracing);
  const models: Record<string, string> = {};
  for (const [name, value] of Object.entries(object(agents.models))) if (typeof value === "string") models[name] = value;
  if (records.task !== undefined && !isTaskNarrativeFilename(records.task)) {
    throw new Error("configuration.records.filenames.task must be a safe task narrative filename");
  }
  return {
    defaultModel: string(agents.defaultModel),
    defaultThinkingLevel: parseThinkingLevel(agents.defaultThinkingLevel, "configuration.agents.defaultThinkingLevel"),
    models,
    provider: string(agents.provider),
    taskRecordNames: isTaskNarrativeFilename(records.task) ? [records.task] : undefined,
    componentBuildTracer: {
      backend: string(tracing.backend),
      enabled: typeof tracing.enabled === "boolean" ? tracing.enabled : undefined,
      endpoint: string(tracing.endpoint),
      directory: string(tracing["local-directory"]),
    },
  };
};
const resolveModel = (value: string | undefined, config: ProjectModelConfig): { model?: string; provider?: string } => {
  const selected = value ?? config.defaultModel;
  if (!selected) return {};
  return { model: config.models[selected] ?? selected, provider: config.provider };
};

const findLocalPi = (cwd: string): string | undefined => {
  let current = cwd;
  while (true) {
    const candidate = join(current, "node_modules", ".bin", "pi");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(current);
    if (parent === current) return undefined;
    current = parent;
  }
};

const resolvePi = (requested: string | undefined, cwd: string): PiInvocation => {
  if (requested) return { command: requested, args: [], source: "explicit" };
  if (process.env.PI_BIN) return { command: process.env.PI_BIN, args: [], source: "environment" };

  const localPi = findLocalPi(cwd);
  if (localPi) return { command: localPi, args: [], source: "skill-local" };

  const contract = loadPiVersionContract();
  const requestedPackage = process.env.PI_PACKAGE;
  if (requestedPackage && requestedPackage !== contract.packageSpec) {
    throw new Error(`PI_PACKAGE must match the skill-owned Pi package contract: ${contract.packageSpec}`);
  }
  return {
    command: Bun.which("bun") ?? "bun",
    args: ["x", "--bun", contract.packageSpec],
    source: "package-fallback",
  };
};

const probePiVersion = (invocation: PiInvocation): string => {
  const contract = loadPiVersionContract();
  const probe = spawnSync(invocation.command, versionProbeArguments(invocation), {
    encoding: "utf8",
    timeout: 30_000,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (probe.error) throw new Error(`Pi version probe unavailable (${invocation.source}): ${probe.error.message}`);
  if (probe.status !== 0) throw new Error(`Pi version probe failed (${invocation.source}): exit=${probe.status}`);
  try {
    return assertPiVersionCompatible(probe.stdout, contract);
  } catch (error) {
    throw new Error(`Pi version preflight rejected (${invocation.source}): ${error instanceof Error ? error.message : String(error)}`);
  }
};

const uniquePaths = (paths: string[]): string[] => [...new Set(paths.map((path) => resolve(path)))];
const uniqueStrings = (values: string[]): string[] => [...new Set(values.filter(Boolean))];
const withinProject = (root: string, candidate: string): boolean => {
  const path = resolve(candidate);
  return path === root || path.startsWith(`${root}${sep}`);
};

const newJobId = (): string =>
  `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const registryPath = (): string => process.env.AS_IS_JOBS_REGISTRY ?? "/tmp/as-is-jobs.jsonl";

const appendHandleToRegistry = async (handle: Handle): Promise<void> => {
  try {
    await appendFile(registryPath(), `${JSON.stringify({ ...handle, event: "launched" })}\n`, "utf8");
  } catch (error) {
    process.stderr.write(
      `as-is detached registry note: unable to append ${registryPath()}: ${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
};

const alive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

// Run a git command in a directory and return its trimmed stdout (or null on
// failure). Used for worktree lifecycle and commit-SHA capture.
const gitIn = async (cwd: string, args: string[]): Promise<string | null> => {
  try {
    const proc = Bun.spawn(["git", "-C", cwd, ...args], {
      cwd,
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    const code = await proc.exited;
    return code === 0 ? output.trim() : null;
  } catch {
    return null;
  }
};

// Create an isolated git worktree pruned from the caller's HEAD so the child's
// destructive git operations (restore, checkout, clean) cannot reach the
// caller's uncommitted work. Returns the worktree path, or null if creation
// failed (the supervisor then falls back to the caller's cwd and notes it).
const createWorktree = async (callerCwd: string, worktreePath: string): Promise<string | null> => {
  const result = await gitIn(callerCwd, ["worktree", "add", "--detach", worktreePath, "HEAD"]);
  return result !== null ? worktreePath : null;
};

const removeWorktree = async (callerCwd: string, worktreePath: string): Promise<void> => {
  await gitIn(callerCwd, ["worktree", "remove", "--force", worktreePath]);
};

const taskRecordPathFor = (recordPath: string, taskRecordNames?: readonly string[]): string =>
  join(dirname(recordPath), taskRecordNames?.[0] ?? "tasks.md");
const gitPathFor = (path: string, cwd: string): string => isAbsolute(path) ? relative(cwd, path) : path.replace(/^\.\//, "");

const recordEvidenceFromText = (taskRaw: string | null, historyRaw: string | null): HandoffFacts["record"] & HandoffFacts["descendants"] => {
  const addedHistory = (historyRaw ?? "").split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .join("\n");
  const raw = [taskRaw, addedHistory].filter((value): value is string => value !== null).join("\n");
  if (!raw) return { durable: false, status: null, validationEvidence: false, expertEvidence: false, resultEvidence: false, allTerminal: false, failedOrCancelledAccounted: false };
  const status = taskRaw?.match(/^  status:\s*(.+)$/m)?.[1]?.trim()
    ?? (/\b(?:Completed|Implemented|Validated)\b/i.test(addedHistory) ? "completed" : null);
  const validationEvidence = (taskRaw?.includes("## Validation") && !taskRaw.match(/## Validation\s*\n\s*(Pending|None|Not run)/iu))
    || /\bvalidation\b.{0,160}\b(?:passed|pass|successful|succeeded)\b/iu.test(raw);
  const expertEvidence = /\b(?:expert|final[- ]diff|safe to commit)\b.{0,180}\b(?:pass|passed|safe|yes)\b/iu.test(raw);
  const resultEvidence = status === "completed"
    || (taskRaw?.includes("## Result") && !taskRaw.match(/## Result\s*\n\s*(Pending|None|Not run)/iu))
    || /\bresult\b.{0,160}\b(?:completed|implemented|validated)\b/iu.test(raw);
  const allTerminal = raw.includes("descendantsTerminal: true") || /terminal descendant closure.*(?:complete|terminal)/iu.test(raw) || /no (?:non-terminal|active|blocked) descendants/iu.test(raw) || /no descendants/iu.test(raw);
  const failedOrCancelledAccounted = raw.includes("failedOrCancelledDescendants: []") || /no failed or cancelled descendants/iu.test(raw) || /failed(?: or|\/)cancelled descendants?.*accounted/iu.test(raw);
  return { durable: true, status, validationEvidence, expertEvidence, resultEvidence, allTerminal, failedOrCancelledAccounted };
};

const scopedCommit = async (cwd: string, baseSha: string | null, commitSha: string | null, recordPath: string | null): Promise<{ exists: boolean; scoped: boolean }> => {
  if (!commitSha || !recordPath) return { exists: false, scoped: false };
  const exists = await gitIn(cwd, ["cat-file", "-e", `${commitSha}^{commit}`]) !== null;
  if (!exists || !baseSha) return { exists, scoped: false };
  const componentPath = dirname(recordPath).replace(/^\.\//, "");
  const changed = await gitIn(cwd, ["diff", "--name-only", `${baseSha}..${commitSha}`]);
  if (changed === null) return { exists, scoped: false };
  const paths = changed.split("\n").filter(Boolean);
  const scoped = paths.length > 0 && (componentPath === "." || paths.every((path) => path === componentPath || path.startsWith(componentPath + "/")));
  return { exists, scoped };
};

// A bounded job runner that is the direct parent of the Pi child. Its scope is
// process management: it owns the wall-clock budget timer, forwards signals,
// manages the worktree lifecycle (a mechanical safety/isolation boundary,
// not a semantic work decision), and records the outcome. It does not decide
// what the work is, whether it is good, or whether the agent should commit —
// the commit decision is the agent's. The runner survives the launcher process
// so a delegated child's budget stays enforced even if the launcher or its
// parent agent is killed. On the deadline it sends SIGTERM then SIGKILL to the
// child's process group.
const runBoundedJob = async (config: SuperviseConfig): Promise<void> => {
  const startedMonotonic = Date.now();
  const delegationSpan = startSpan("delegation.lifecycle", {
    cwd: config.callerCwd,
    traceId: process.env.AS_IS_TRACE_ID || undefined,
    parentSpanId: process.env.AS_IS_TRACE_PARENT_SPAN_ID || undefined,
    sessionReference: sessionReferenceFromEnvironment(),
  });
  const phaseTimings: Record<string, number> = {};
  const phaseStarted = (name: string): number => Date.now();
  const phaseEnded = (name: string, started: number): void => { phaseTimings[name] = Date.now() - started; };
  const worktreePhase = phaseStarted("worktree");

  // Isolate the child in a worktree pruned from the caller's HEAD. On failure,
  // fall back to the caller's cwd (no isolation) and record the degradation.
  let childCwd = config.callerCwd;
  let baseSha: string | null = null;
  if (config.worktreePath) {
    const created = await createWorktree(config.callerCwd, config.worktreePath);
    if (created) {
      childCwd = created;
      baseSha = await gitIn(created, ["rev-parse", "HEAD"]);
    } else {
      process.stderr.write(
        `as-is supervisor note: worktree creation failed; running in caller cwd without isolation\n`,
      );
    }
  }

  phaseEnded("worktree", worktreePhase);

  const sessionStoreScope = {
    cwd: process.env.PI_SESSION_FILE ? config.callerCwd : undefined,
    directory: process.env.PI_SESSION_FILE ? dirname(process.env.PI_SESSION_FILE) : undefined,
  };
  const contextProjectRoot = typeof config.contextProjectRelativeToGitRoot === "string"
    ? resolve(childCwd, config.contextProjectRelativeToGitRoot)
    : config.contextProjectRoot ?? undefined;
  const childEnv = {
    ...process.env,
    ...(contextProjectRoot ? { AS_IS_COMPONENT_CONTEXT_PROJECT_ROOT: contextProjectRoot } : {}),
    ...(config.contextComponentRelativeToProject ? { AS_IS_COMPONENT_CONTEXT_COMPONENT: config.contextComponentRelativeToProject } : {}),
    ...(config.contextTaskRecordNames ? { AS_IS_COMPONENT_CONTEXT_TASK_RECORD_NAMES: JSON.stringify(config.contextTaskRecordNames) } : {}),
    // Preserve the delegating session's readable store scope when the child
    // runs in a worktree or detached supervisor directory. This is a data
    // ownership reference, not an authorization token or session payload.
    ...(sessionStoreScope.cwd ? { AS_IS_SESSION_CWD: sessionStoreScope.cwd } : {}),
    ...(sessionStoreScope.directory ? { AS_IS_SESSION_DIR: sessionStoreScope.directory } : {}),
    // Propagate identity and job id so the child's own delegations can record
    // the correct caller and parent-job-id without OS parentage.
    AS_IS_IDENTITY: config.identity,
    AS_IS_JOB_ID: config.jobId,
    AS_IS_COMPONENT_BUILD_TRACER: process.env.AS_IS_COMPONENT_BUILD_TRACER ?? "file",
    AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT: process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT ?? "",
    AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY: process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY ?? ".as-is/tracing.jsonl",
    AS_IS_TRACE_ID: process.env.AS_IS_TRACE_ID ?? "",
  };

  await recordComponentTrace(config.callerCwd, {
    name: "subprocess.launch",
    backend: process.env.AS_IS_COMPONENT_BUILD_TRACER ?? "file",
    endpoint: process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT || undefined,
    jobId: config.jobId,
    identity: config.identity,
    caller: config.caller,
    parentJobId: config.parentJobId,
    componentPath: config.recordPath ? dirname(config.recordPath) : undefined,
    taskRecord: config.recordPath,
  });

  const workerSpan = startSpan("worker.lifecycle", {
    cwd: config.callerCwd,
    traceId: delegationSpan.traceId,
    parentSpanId: delegationSpan.spanId,
    sessionReference: sessionReferenceFromEnvironment(),
  });

  const processResult = await runBoundedProcess({
    command: config.command,
    args: config.args,
    cwd: childCwd,
    env: childEnv,
    logPath: config.mode === "detach" ? config.logPath : null,
    budgetWallClockSeconds: config.budgetWallClockSeconds === null
      ? null
      : boundedLimit(config.budgetWallClockSeconds, config.budgetWallClockSeconds, config.budgetWallClockSeconds),
    killGraceSeconds: BUDGET_KILL_GRACE_SECONDS,
    startedAtMs: startedMonotonic,
    phaseTimings,
  });
  const { childPid, exitCode, budgetStopped, budgetStopElapsedMs, wallClockSeconds } = processResult;

  await workerSpan.finish(budgetStopped || exitCode !== 0 ? "failure" : "success", {
    workerRole: config.identity,
    outcomeClass: budgetStopped ? "budget-stopped" : exitCode === 0 ? "success" : "failure",
  });
  await recordComponentTrace(config.callerCwd, {
    name: "subprocess.exit",
    backend: process.env.AS_IS_COMPONENT_BUILD_TRACER ?? "file",
    jobId: config.jobId,
    identity: config.identity,
    caller: config.caller,
    parentJobId: config.parentJobId,
    componentPath: config.recordPath ? dirname(config.recordPath) : undefined,
    exitCode,
    outcome: budgetStopped ? "budget-stopped" : exitCode === 0 ? "success" : "failure",
  });

  // Capture the child's final commit so the parent can read the record via
  // `git show <sha>:<path>` without a filesystem race on the worktree.
  const finalSha = childCwd !== config.callerCwd ? await gitIn(childCwd, ["rev-parse", "HEAD"]) : null;
  const committed = finalSha !== null && finalSha !== baseSha;
  // Read the transient task record from the child commit. The durable
  // `as-is.md` path identifies the component; its local JSON `task` object owns current machine task state
  // status and handoff evidence. A disk copy or exit code is not durable
  // handoff evidence and must not make a result eligible.
  const taskRecordPath = config.recordPath ? taskRecordPathFor(config.recordPath, config.contextTaskRecordNames) : null;
  const componentDirectory = config.recordPath ? dirname(config.recordPath) : null;
  const changelogPath = componentDirectory ? join(componentDirectory, "changelog.md") : null;
  const taskRaw = committed && taskRecordPath
    ? await gitIn(childCwd, ["show", `${finalSha}:${gitPathFor(taskRecordPath, config.callerCwd)}`])
    : null;
  const historyRaw = committed && changelogPath
    ? await gitIn(childCwd, ["show", `${finalSha}:${gitPathFor(changelogPath, config.callerCwd)}`])
    : null;
  const recordEvidence = recordEvidenceFromText(taskRaw, historyRaw);
  const commitEvidence = await scopedCommit(childCwd, baseSha, committed ? finalSha : null, config.recordPath);
  const integrationStatus = committed
    ? integrationStatusFor(finalSha, config.callerCwd) as HandoffFacts["integration"]["status"]
    : "not-committed";
  const handoff = evaluateHandoffEligibility({
    record: recordEvidence,
    descendants: recordEvidence,
    commit: { sha: committed ? finalSha : null, ...commitEvidence },
    integration: {
      status: integrationStatus,
      callerHeadAncestry: integrationStatus === "integrated",
    },
  });
  phaseTimings["total"] = Date.now() - startedMonotonic;

  await recordComponentTrace(config.callerCwd, {
    name: "subprocess.handoff",
    backend: process.env.AS_IS_COMPONENT_BUILD_TRACER ?? "file",
    jobId: config.jobId,
    identity: config.identity,
    componentPath: config.recordPath ? dirname(config.recordPath) : undefined,
    committed,
    commitSha: finalSha ?? undefined,
    wallClockSeconds,
  });

  await delegationSpan.finish(budgetStopped || exitCode !== 0 ? "failure" : "success", {
    jobId: config.jobId,
    parentJobId: config.parentJobId ?? undefined,
    childJobId: config.jobId,
    attemptClass: config.parentJobId ? "nested" : "initial",
    depthClass: config.parentJobId ? "child" : "root",
    handoffClass: integrationStatus,
    outcomeClass: budgetStopped ? "budget-stopped" : exitCode === 0 ? "success" : "failure",
  });

  // Decide worktree removal on git facts, not on the agent's exit code or a
  // budget-stop flag. The worktree is removed only when there is nothing to
  // lose: either the child advanced HEAD (committed — work is durable in git,
  // recoverable via commitSha) or the tree is clean (no uncommitted changes).
  // If there are uncommitted changes and no commit, the worktree is PRESERVED
  // so the partial work remains for recovery. This is a mechanical preservation
  // rule ("is there uncommitted state?"), not a semantic work judgment.
  let worktreePreserved = false;
  let preserveReason: string | null = null;
  if (childCwd !== config.callerCwd) {
    const porcelain = await gitIn(childCwd, ["status", "--porcelain"]);
    const clean = porcelain === "";
    if (committed || clean) {
      await removeWorktree(config.callerCwd, childCwd);
    } else {
      worktreePreserved = true;
      preserveReason = "uncommitted changes without a commit (recovery candidate)";
    }
  }

  const outcome = {
    jobId: config.jobId,
    recordPath: config.recordPath,
    callerCwd: config.callerCwd,
    worktreePath: config.worktreePath,
    baseSha,
    exitCode,
    budgetStopped,
    budgetStopElapsedMs,
    wallClockSeconds,
    phaseTimings,
    commitSha: finalSha,
    committed,
    integrationStatus,
    handoffEligible: handoff.eligible,
    handoffBlockers: handoff.blockers,
    handoffFacts: {
      record: {
        durable: recordEvidence.durable,
        status: recordEvidence.status,
        validationEvidence: recordEvidence.validationEvidence,
        expertEvidence: recordEvidence.expertEvidence,
        resultEvidence: recordEvidence.resultEvidence,
      },
      descendants: {
        allTerminal: recordEvidence.allTerminal,
        failedOrCancelledAccounted: recordEvidence.failedOrCancelledAccounted,
      },
      commit: {
        sha: committed ? finalSha : null,
        exists: commitEvidence.exists,
        scoped: commitEvidence.scoped,
      },
      integration: {
        status: integrationStatus as HandoffFacts["integration"]["status"],
        callerHeadAncestry: integrationStatus === "integrated",
      },
    },
    recordStatus: recordEvidence.status,
    taskRecordPath,
    worktreePreserved,
    preserveReason,
  };

  try {
    await writeFile(config.resultPath, `${JSON.stringify(outcome)}\n`, "utf8");
  } catch {
    /* best-effort outcome record */
  }

  if (config.registryPath) {
    try {
      await appendFile(config.registryPath, `${JSON.stringify({
        ...outcome,
        event: "finished",
        childPid,
        finishedAt: new Date().toISOString(),
      })}\n`, "utf8");
    } catch {
      /* best-effort registry */
    }
  }

  process.exitCode = budgetStopped ? BUDGET_STOPPED_EXIT_CODE : exitCode;
};

const buildBudgetLines = (options: Options): string[] => {
  if (options.budgetWallClockSeconds === undefined && options.budgetCostUsd === undefined) return [];
  return [
    "",
    "Budget constraints forwarded by the delegating agent through the launcher:",
    `- wall-clock-seconds: ${options.budgetWallClockSeconds ?? "unset"}`,
    `- cost-usd: ${options.budgetCostUsd ?? "unset"}`,
    "The launcher enforces the wall-clock limit as a hard process-level stop. The",
    "cost limit is not directly observable from the launcher; self-limit on cost",
    "and stop and return promptly when either limit is approached.",
  ];
};

// Read the job registry and print a fused status table: each job's process
// liveness, caller lineage, and budget (from the registry) joined to its
// task-record status (read via `git show <sha>:<path>` when a commit is
// recorded, else from the recordPath on disk). A dead supervisor with no
// completion line is flagged as a recovery candidate. Read-only.
/** Derive handoff integration only from ancestry in the caller repository. */
export const integrationStatusFor = (commitSha: string | null, callerCwd: string): string => {
  if (!commitSha) return "not-committed";
  const exists = spawnSync("git", ["cat-file", "-e", `${commitSha}^{commit}`], { cwd: callerCwd, stdio: "ignore" });
  if (exists.status !== 0) return "unreachable";
  const integrated = spawnSync("git", ["merge-base", "--is-ancestor", commitSha, "HEAD"], {
    cwd: callerCwd,
    stdio: "ignore",
  });
  return integrated.status === 0 ? "integrated" : "pending-parent-integration";
};

const printJobs = async (): Promise<void> => {
  const path = registryPath();
  if (!existsSync(path)) {
    process.stdout.write("No jobs registered.\n");
    return;
  }
  const lines = (await readFile(path, "utf8")).split("\n").filter((line) => line.trim());
  const jobs = new Map<string, { launch: Record<string, unknown> | null; finished: Record<string, unknown> | null }>();
  for (const line of lines) {
    let obj: Record<string, unknown>;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }
    const id = obj.jobId as string | undefined;
    if (!id) continue;
    if (!jobs.has(id)) jobs.set(id, { launch: null, finished: null });
    const entry = jobs.get(id)!;
    if (obj.event === "finished") entry.finished = obj;
    else if (obj.event === "launched") entry.launch = obj;
  }
  if (jobs.size === 0) {
    process.stdout.write("No jobs registered.\n");
    return;
  }
  const rows: string[] = [];
  for (const [id, entry] of jobs) {
    const launch = entry.launch ?? {};
    const finished = entry.finished;
    const pid = launch.pid as number | null | undefined;
    let status: string;
    const storedFacts = finished?.handoffFacts as HandoffFacts | undefined;
    const finishedIntegrationStatus = finished?.committed
      ? integrationStatusFor(finished.commitSha as string | null, process.cwd())
      : "not-committed";
    const currentHandoff = storedFacts
      ? evaluateHandoffEligibility({
        ...storedFacts,
        integration: {
          status: finishedIntegrationStatus as HandoffFacts["integration"]["status"],
          callerHeadAncestry: finishedIntegrationStatus === "integrated",
        },
      })
      : { eligible: false, blockers: ["handoff-evidence-missing"] };
    if (finished) {
      status = finished.budgetStopped
        ? "budget-stopped"
        : currentHandoff.eligible
          ? "completed"
          : finished.exitCode === 0
            ? "incomplete"
            : "failed";
    } else if (typeof pid === "number" && pid > 0 && alive(pid)) {
      status = "running";
    } else {
      status = "crashed (recovery candidate)";
    }
    // Read the task-record status: prefer the captured commit (durable, no
    // filesystem race), else the recordPath on disk.
    let recordStatus = "-";
    const recordPath = launch.recordPath as string | null;
    const commitSha = finished?.commitSha as string | null | undefined;
    if (recordPath) {
      try {
        let raw: string | null = null;
        if (commitSha) {
          raw = await gitIn(process.cwd(), ["show", `${commitSha}:${recordPath}`]);
        }
        if (raw === null && existsSync(recordPath)) {
          raw = await readFile(recordPath, "utf8");
        }
        if (raw) {
          const companionPath = join(dirname(recordPath), "as-is.json");
          if (existsSync(companionPath)) {
            const companion = parseAsIsJson(await readFile(companionPath, "utf8"), companionPath);
            if (companion.task && typeof companion.task === "object" && !Array.isArray(companion.task)) {
              const status = (companion.task as Record<string, unknown>).status;
              if (typeof status === "string") recordStatus = status;
            }
          }
        }
      } catch {
        /* leave "-" */
      }
    }
    const integrationStatus = finishedIntegrationStatus;
    const detail = finished
      ? `exit=${finished.exitCode} wall=${finished.wallClockSeconds}s${finished.committed ? ` sha=${(finished.commitSha as string)?.slice(0, 8)}` : ""}${integrationStatus ? ` integration=${integrationStatus}` : ""}${!currentHandoff.eligible ? ` handoff=incomplete blockers=${currentHandoff.blockers.join(",")}` : ""}${finished.worktreePreserved ? ` preserved: ${finished.preserveReason ?? "uncommitted changes"} @ ${launch.worktreePath ?? "?"}` : ""}`
      : `budget=${launch.budgetWallClockSeconds ?? "-"}s`;
    const identity = (launch.identity as string | undefined) ?? "?";
    const caller = (launch.caller as string | undefined) ?? "?";
    rows.push([id, identity, caller, status, recordStatus, pid != null ? String(pid) : "-", detail].join("\t"));
  }
  process.stdout.write(["jobId", "identity", "caller", "proc-status", "record-status", "pid", "detail"].join("\t") + "\n");
  process.stdout.write(rows.join("\n") + "\n");
};

const main = async() => {
  const options = parseOptions(process.argv.slice(2));

  if (options.supervise) {
    const config = JSON.parse(await readFile(options.supervise.configPath, "utf8")) as SuperviseConfig;
    await runBoundedJob(config);
    return;
  }

  if (options.jobs) {
    await printJobs();
    return;
  }

  const cwd = resolve(options.cwd);
  const clientCwd = resolve(process.cwd());
  const projectRoot = await findProjectRoot(clientCwd);
  const agentPath = resolveFromCwd(options.agent as string, cwd);
  const definition = parseAgentFrontMatter(await readFile(agentPath, "utf8"), agentPath);
  const task = options.task;
  if (!task || !task.trim()) throw new Error("Task direction is empty");

  // Caller identity and parent job id propagate through env so a child agent's
  // own delegations record the correct lineage without OS parentage.
  const identity = identityFromAgent(agentPath, definition);
  // Nested launches must carry both identity and job id. Ignore a stale
  // identity without its lineage marker so a direct host launch cannot inherit
  // builder authority, while builder-owned expert validation remains
  // attributable through the propagated pair.
  const inheritedCaller = process.env.AS_IS_JOB_ID ? process.env.AS_IS_IDENTITY : undefined;
  const caller = options.caller ?? inheritedCaller ?? "user";
  const parentJobId = options.parentJobId ?? process.env.AS_IS_JOB_ID ?? null;
  const config: ProjectModelConfig = projectRoot ? await readProjectModelConfig(projectRoot) : { models: {} };
  const tracer = config.componentBuildTracer;
  process.env.AS_IS_COMPONENT_BUILD_TRACER = tracer?.enabled === false
    ? "disabled"
    : tracer?.backend ?? process.env.AS_IS_COMPONENT_BUILD_TRACER ?? "file";
  if (tracer?.endpoint && !process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT) process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT = tracer.endpoint;
  if (tracer?.directory && !process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY) process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY = tracer.directory;

  const resolved = resolveModel(options.model ?? definition.model, config);
  const model = resolved.model;
  const provider = resolved.provider;
  const thinking = resolveThinkingLevel({
    cli: options.thinking,
    agent: definition.thinking,
    projectDefault: config.defaultThinkingLevel,
  });
  const isEvidenceValidation = identity === "evidence-validator";
  // Evidence validation is a launcher-owned capability profile, not a caller
  // supplied tool list. It deliberately has no shell and runs in the caller's
  // controlled worktree so it can inspect the actual uncommitted diff.
  const declaredTools = parseDeclaredTools(definition.tools, agentPath);
  if (!isEvidenceValidation && options.tools)
    throw new Error(`--tools is not accepted; declare tools in agent front matter: ${agentPath}`);
  if (!isEvidenceValidation && options.noTools)
    throw new Error(`--no-tools is not accepted; declare the role's tool policy in agent front matter: ${agentPath}`);
  // Ordinary roles receive exactly the declared set. A missing declaration is
  // represented by an explicit empty capability set, never Pi defaults or an
  // identity-specific fallback.
  const tools = isEvidenceValidation ? "read,grep,find,ls,git_inspect" : declaredTools;
  // The caller's declared tools determine the host's active capability set.
  // Caller/target identity and lineage remain diagnostic metadata only; they
  // are not delegation authorization. The extension registers its tools
  // declaratively, while Pi exposes only this active declared set.
  const skillPaths = isEvidenceValidation ? [] : definition.skills
    ? uniquePaths([
      ...definition.skills.map((skill) => resolveFromCwd(skill, cwd)),
      ...options.skills.map((skill) => resolveFromCwd(skill, cwd)),
    ])
    : options.skills.length > 0
      ? uniquePaths(options.skills.map((skill) => resolveFromCwd(skill, cwd)))
      : [];
  const launchProfile: LaunchProfile = {
    expertValidation: isEvidenceValidation,
    tools,
    skills: skillPaths,
    noSession: isEvidenceValidation || Boolean(options.noSession),
    noExtensions: true,
    extensionPath: resolve(cwd, isEvidenceValidation
      ? "skills/spawning-pi-subagents/scripts/evidence-validator-inspection-extension.ts"
      : ".pi/extensions/worker-tools.ts"),
    noApprove: isEvidenceValidation || Boolean(options.noApprove),
    worktree: isEvidenceValidation ? false : !(options.noWorktree ?? false),
  };
  // One launcher-boundary session span: lifecycle metadata only. In
  // particular, never pass prompts, responses, tools, or exception text to it.
  const sessionSpan = startSpan("session.lifecycle", {
    cwd,
    sessionReference: sessionReferenceFromEnvironment(),
    config: {
      backend: process.env.AS_IS_COMPONENT_BUILD_TRACER,
      directory: process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY,
    },
    traceId: process.env.AS_IS_TRACE_ID || undefined,
  });
  process.env.AS_IS_TRACE_PARENT_SPAN_ID = sessionSpan.spanId;
  // Generic dispatch consumes the selected launch profile. The profile owns
  // capability/session/extension differences; identity is not consulted here.
  const piInvocation = resolvePi(options.pi, cwd);
  const piVersion = probePiVersion(piInvocation);
  const baseArgs = ["--mode", "json", "--print"];
  if (launchProfile.noSession) baseArgs.push("--no-session");
  else baseArgs.push("--session-dir", "<session-dir>");
  baseArgs.push("--no-extensions", "--extension", launchProfile.extensionPath);
  if (provider) baseArgs.push("--provider", provider);
  if (model) baseArgs.push("--model", model);
  if (thinking) baseArgs.push("--thinking", thinking);
  if (launchProfile.tools) baseArgs.push("--tools", launchProfile.tools);
  else if (!launchProfile.expertValidation) baseArgs.push("--no-tools");
  if (definition.skills) baseArgs.push("--no-skills");
  if (!launchProfile.expertValidation && options.approve) baseArgs.push("--approve");
  if (launchProfile.noApprove) baseArgs.push("--no-approve");
  for (const skillPath of launchProfile.skills) baseArgs.push("--skill", skillPath);

  const budget = {
    "wall-clock-seconds": options.budgetWallClockSeconds ?? null,
    "cost-usd": options.budgetCostUsd ?? null,
  };

  if (options.dryRun) {
    process.stdout.write(`${JSON.stringify({
      command: piInvocation.command,
      args: [
        ...piInvocation.args,
        ...baseArgs,
        "--append-system-prompt",
        "<private-agent-prompt>",
        "Task: <provided>",
      ],
      cwd,
      agent: agentPath,
      identity,
      caller,
      "parent-job-id": parentJobId,
      skills: launchProfile.skills,
      model: model ?? null,
      provider: provider ?? null,
      thinking: thinking ?? null,
      piVersion,
      piSource: piInvocation.source,
      sessionPath: launchProfile.noSession ? null : "<session-dir>",
      tools: launchProfile.tools ?? null,
      detach: options.detach ?? false,
      worktree: launchProfile.worktree,
      budget,
      tracer: {
        backend: process.env.AS_IS_COMPONENT_BUILD_TRACER,
        endpoint: process.env.AS_IS_COMPONENT_BUILD_TRACER_ENDPOINT ?? "",
        directory: process.env.AS_IS_COMPONENT_BUILD_TRACER_DIRECTORY ?? "",
      },
    }, null, 2)}\n`);
    await sessionSpan.finish("success", {
      sessionClass: options.noSession ? "ephemeral" : "durable",
      launcherMode: options.detach ? "detach" : "blocking",
    });
    return;
  }

  const instructionContext = projectRoot
    ? await resolveInstructionContext(projectRoot, relative(projectRoot, cwd) || ".")
    : { target: ".", sources: [], diagnostics: [{ code: "project-root-unavailable", message: "Unable to resolve project root from the launching client's cwd." }], complete: false };
  const instructionPrompt = instructionContext.sources.length > 0
    ? [
      "The following centrally resolved AGENTS.md files are applicable instructions.",
      "They are ordered from repository ancestor to target component; preserve their authority and scope.",
      ...instructionContext.sources.flatMap((source) => ["", `--- ${source.relativePath} (${source.scope}) ---`, source.content]),
    ].join("\n")
    : "No applicable AGENTS.md files were resolved.";
  const prompt = [
    `You are running under the repository agent contract loaded from ${basename(agentPath)}.`,
    "The host-selected Pi tools and approval flags are authoritative for this process.",
    instructionPrompt,
    "",
    definition.body,
    ...buildBudgetLines(options),
  ].join("\n");

  const childArgs = [
    ...piInvocation.args,
    ...baseArgs,
    "--append-system-prompt",
    "<prompt-path>",
    `Task:\n${task}`,
  ];

  const componentPath = options.record ? dirname(resolve(options.record)) : cwd;
  const componentRelativeToProject = projectRoot && withinProject(projectRoot, componentPath)
    ? relative(projectRoot, componentPath) || "."
    : null;
  const gitRoot = projectRoot ? await gitIn(projectRoot, ["rev-parse", "--show-toplevel"]) : null;
  const contextProjectRelativeToGitRoot = projectRoot && gitRoot
    ? relative(gitRoot.trim(), projectRoot) || "."
    : null;
  const contextProjectRoot = contextProjectRelativeToGitRoot ? null : projectRoot ?? null;
  const contextTaskRecordNames = config.taskRecordNames;
  const bunBin = Bun.which("bun") ?? "bun";
  const jobId = newJobId();
  const launchedAt = new Date().toISOString();
  // Experts must see the builder's controlled worktree. Other roles retain the
  // existing isolation default and explicit --no-worktree escape hatch.
  const useWorktree = launchProfile.worktree;

  if (options.detach) {
    const jobDirectory = await mkdtemp(join(tmpdir(), "as-is-child-"));
    const promptPath = join(jobDirectory, "system-prompt.md");
    const sessionPath = options.noSession ? null : join(jobDirectory, "sessions");
    const logPath = join(jobDirectory, "child.log");
    const resultPath = join(jobDirectory, "result.json");
    const configPath = join(jobDirectory, "supervise.json");
    const worktreePath = useWorktree ? join(jobDirectory, "worktree") : null;
    await writeFile(promptPath, prompt, { encoding: "utf8", mode: 0o600 });
    // Ensure the advertised log path exists before returning the handle.
    const logHandle = await open(logPath, "w");
    await logHandle.close();
    const config: SuperviseConfig = {
      command: piInvocation.command,
      contextProjectRoot,
      contextProjectRelativeToGitRoot,
      contextComponentRelativeToProject: componentRelativeToProject,
      contextTaskRecordNames,
      args: childArgs.map((arg) => arg === "<prompt-path>" ? promptPath : arg === "<session-dir>" ? sessionPath! : arg),
      callerCwd: cwd,
      worktreePath,
      sessionPath,
      mode: "detach",
      logPath,
      resultPath,
      sessionPath,
      registryPath: options.noRegistry ? null : registryPath(),
      jobId,
      identity,
      caller,
      parentJobId,
      recordPath: options.record ?? null,
      budgetWallClockSeconds: options.budgetWallClockSeconds ?? null,
      budgetCostUsd: options.budgetCostUsd ?? null,
    };
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

    const supervisor = spawn(bunBin, [import.meta.path, "--supervise", configPath], {
      cwd,
      env: process.env,
      shell: false,
      detached: true,
      stdio: "ignore",
    });
    supervisor.unref();

    const handle: Handle = {
      jobId,
      pid: supervisor.pid,
      identity,
      caller,
      parentJobId,
      logPath,
      recordPath: options.record ?? null,
      worktreePath,
      sessionPath,
      budgetWallClockSeconds: options.budgetWallClockSeconds ?? null,
      budgetCostUsd: options.budgetCostUsd ?? null,
      launchedAt,
    };
    if (!options.noRegistry) await appendHandleToRegistry(handle);
    process.stdout.write(`${JSON.stringify(handle, null, 2)}\n`);
    await sessionSpan.finish("success", {
      sessionClass: options.noSession ? "ephemeral" : "durable",
      launcherMode: "detach",
    });
    return;
  }

  // Blocking mode: the launcher waits and propagates the exit code, but the
  // child and its budget timer are owned by a detached supervisor that survives
  // this launcher's death. Child stdio is inherited so the caller observes Pi
  // output directly.
  const jobDirectory = await mkdtemp(join(tmpdir(), "as-is-child-"));
  const promptPath = join(jobDirectory, "system-prompt.md");
  const sessionPath = options.noSession ? null : join(jobDirectory, "sessions");
  const resultPath = join(jobDirectory, "result.json");
  const configPath = join(jobDirectory, "supervise.json");
  const worktreePath = useWorktree ? join(jobDirectory, "worktree") : null;
  try {
    await writeFile(promptPath, prompt, { encoding: "utf8", mode: 0o600 });
    const config: SuperviseConfig = {
      command: piInvocation.command,
      contextProjectRoot,
      contextProjectRelativeToGitRoot,
      contextComponentRelativeToProject: componentRelativeToProject,
      contextTaskRecordNames,
      args: childArgs.map((arg) => arg === "<prompt-path>" ? promptPath : arg === "<session-dir>" ? sessionPath! : arg),
      callerCwd: cwd,
      worktreePath,
      sessionPath,
      mode: "blocking",
      logPath: null,
      resultPath,
      sessionPath,
      registryPath: options.noRegistry ? null : registryPath(),
      jobId,
      identity,
      caller,
      parentJobId,
      recordPath: options.record ?? null,
      budgetWallClockSeconds: options.budgetWallClockSeconds ?? null,
      budgetCostUsd: options.budgetCostUsd ?? null,
    };
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

    const supervisor = spawn(bunBin, [import.meta.path, "--supervise", configPath], {
      cwd,
      env: process.env,
      shell: false,
      detached: true,
      stdio: "inherit",
    });

    const handle: Handle = {
      jobId,
      pid: supervisor.pid,
      identity,
      caller,
      parentJobId,
      logPath: null,
      recordPath: options.record ?? null,
      worktreePath,
      sessionPath,
      budgetWallClockSeconds: options.budgetWallClockSeconds ?? null,
      budgetCostUsd: options.budgetCostUsd ?? null,
      launchedAt,
    };
    if (!options.noRegistry) await appendHandleToRegistry(handle);

    const forwardSignal = (signal: NodeJS.Signals) => {
      try {
        supervisor.kill(signal);
      } catch {
        /* supervisor already gone */
      }
    };
    process.once("SIGTERM", forwardSignal);
    process.once("SIGINT", forwardSignal);
    const supervisorExit = await new Promise<number>((resolveExit) => {
      supervisor.once("error", () => resolveExit(1));
      supervisor.once("close", (code) => resolveExit(code ?? 1));
    });
    process.removeListener("SIGTERM", forwardSignal);
    process.removeListener("SIGINT", forwardSignal);

    let result = { exitCode: supervisorExit, budgetStopped: false, wallClockSeconds: 0, commitSha: null, committed: false, integrationStatus: "unknown", worktreePreserved: false };
    try {
      result = JSON.parse(await readFile(resultPath, "utf8"));
    } catch {
      /* result file unavailable; fall back to supervisor exit code */
    }
    await sessionSpan.finish(result.budgetStopped || result.exitCode !== 0 ? "failure" : "success", {
      sessionClass: options.noSession ? "ephemeral" : "durable",
      launcherMode: "blocking",
      outcomeClass: result.budgetStopped ? "budget-stopped" : result.exitCode === 0 ? "success" : "failure",
    });
    if (result.budgetStopped) {
      process.stderr.write(
        `as-is budget-stopped: limit=wall-clock seconds=${options.budgetWallClockSeconds} exit=${BUDGET_STOPPED_EXIT_CODE}\n`,
      );
      process.exitCode = BUDGET_STOPPED_EXIT_CODE;
    } else {
      process.exitCode = result.exitCode;
    }
  } finally {
    // A preserved worktree is the recovery artifact. Keep the job directory
    // when the supervisor recorded uncommitted changes; removing it here would
    // contradict `worktreePreserved` and destroy the only recovery surface.
    const preserve = (() => {
      try {
        return JSON.parse(readFileSync(resultPath, "utf8")).worktreePreserved === true;
      } catch {
        return false;
      }
    })();
    if (!preserve) await rm(jobDirectory, { recursive: true, force: true });
  }
};

try {
  await main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.stderr.write("Use --help for usage.\n");
  process.exitCode = 1;
}
