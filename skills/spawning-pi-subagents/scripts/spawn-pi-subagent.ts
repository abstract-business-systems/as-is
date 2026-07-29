import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, open, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";

type Options = {
  agent?: string;
  task?: string;
  cwd: string;
  pi?: string;
  model?: string;
  tools?: string;
  skills: string[];
  approve?: boolean;
  noApprove?: boolean;
  noTools?: boolean;
  dryRun: boolean;
  detach?: boolean;
  record?: string;
  supervise?: { childPid: number; seconds: number };
  budgetWallClockSeconds?: number;
  budgetCostUsd?: number;
};

type AgentDefinition = {
  body: string;
  model?: string;
  tools?: string;
};

type PiInvocation = {
  command: string;
  args: string[];
};

type RunResult = {
  exitCode: number;
  budgetStopped: boolean;
  budgetLimit?: "wall-clock";
  budgetSeconds?: number;
};

type Handle = {
  jobId: string;
  pid: number | null;
  logPath: string;
  recordPath: string | null;
  budgetWallClockSeconds: number | null;
  budgetCostUsd: number | null;
};

const BUDGET_STOPPED_EXIT_CODE = 124;
const BUDGET_KILL_GRACE_SECONDS = 5;
const SUPERVISOR_POLL_MILLIS = 1000;

const skillDirectory = resolve(import.meta.dir, "..");

const usage = `Usage:
  bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts [options]

Required (unless --supervise):
  --agent <path>             Agent Markdown file to load
  --task <text>              Task direction

Optional:
  --cwd <path>               Child working directory (default: current directory)
  --pi <path>                Local Pi executable (default: PI_BIN or Bun package runner)
  --model <model>            Override the agent file model
  --tools <names>            Comma-separated Pi tool allow-list
  --skill <path>             Additional skill file or directory (repeatable)
  --approve                  Trust project-local files for this run
  --no-approve               Ignore project-local files for this run
  --no-tools                 Disable all Pi tools
  --dry-run                  Print the resolved launch without starting Pi
  --detach                   Launch the child independently and return a handle
                             (job id, PID, log path, record path) without
                             blocking on completion. The child's stdout and
                             stderr go to a log file; its as-is.md record is the
                             result. A wall-clock budget, if set, is enforced by
                             a detached supervisor that outlives this launcher
  --record <path>            Component as-is.md record path to include in the
                             detach handle (the parent usually knows this)
  --budget-wall-clock-seconds <n>
                             Hard wall-clock budget. When > 0, stop the child
                             after n seconds and return a budget-stopped result
                             (or, with --detach, a detached supervisor kills the
                             child's process group on expiry)
  --budget-cost-usd <n>      Monetary cost budget (USD) forwarded to the child
                             agent for self-limiting; not directly observable
                             from the launcher
  --help                     Show this help
`;

const valueOptions = new Set([
  "--agent",
  "--task",
  "--cwd",
  "--pi",
  "--model",
  "--tools",
  "--skill",
  "--record",
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
    if (option === "--no-tools") {
      options.noTools = true;
      continue;
    }
    if (option === "--detach") {
      options.detach = true;
      continue;
    }
    if (option === "--supervise") {
      const childPid = Number(args[index + 1]);
      const seconds = Number(args[index + 2]);
      if (!Number.isFinite(childPid) || !Number.isFinite(seconds) || childPid <= 0 || seconds < 0) {
        throw new Error("--supervise requires <childPid> <seconds> (positive pid, non-negative seconds)");
      }
      options.supervise = { childPid, seconds };
      index += 2;
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
    else if (option === "--tools") options.tools = value;
    else if (option === "--record") options.record = value;
  }

  if (options.approve && options.noApprove) {
    throw new Error("Use only one of --approve and --no-approve");
  }
  if (!options.supervise) {
    if (!options.agent) throw new Error("--agent is required");
    if (!options.task) throw new Error("--task is required");
  }

  return options;
};

const parseFrontMatter = (raw: string, filePath: string): AgentDefinition => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Agent file has no front matter: ${filePath}`);

  const values = new Map<string, string>();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z][a-zA-Z-]*):\s*(.*)$/);
    if (field) values.set(field[1], field[2].trim());
  }

  const body = match[2].trim();
  if (!body) throw new Error(`Agent file has no prompt body: ${filePath}`);

  return {
    body,
    model: values.get("model"),
    tools: values.get("tools"),
  };
};

const resolveFromCwd = (value: string, cwd: string): string =>
  isAbsolute(value) ? value : resolve(cwd, value);

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
  if (requested) return { command: requested, args: [] };
  if (process.env.PI_BIN) return { command: process.env.PI_BIN, args: [] };

  const localPi = findLocalPi(cwd);
  if (localPi) return { command: localPi, args: [] };

  return {
    command: Bun.which("bun") ?? "bun",
    args: [
      "x",
      "--bun",
      process.env.PI_PACKAGE ?? "@earendil-works/pi-coding-agent@0.82.0",
    ],
  };
};

const uniquePaths = (paths: string[]): string[] => [...new Set(paths.map((path) => resolve(path)))];

const newJobId = (): string =>
  `j-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// A detached budget supervisor. It outlives the launcher process so a parent
// that has moved on still has its child's wall-clock budget enforced. It polls
// the child's process-group liveness and exits early once the group is gone; on
// the deadline it sends SIGTERM then SIGKILL after a short grace.
const supervise = (childPid: number, seconds: number): Promise<void> =>
  new Promise((resolveExit) => {
    if (seconds <= 0) {
      resolveExit();
      return;
    }
    const groupPid = -childPid;
    const deadline = Date.now() + seconds * 1000;

    const signalGroup = (signal: NodeJS.Signals) => {
      try {
        process.kill(groupPid, signal);
      } catch {
        /* group already gone */
      }
    };

    const poll = setInterval(() => {
      try {
        process.kill(groupPid, 0);
      } catch {
        clearInterval(poll);
        resolveExit();
        return;
      }
      if (Date.now() >= deadline) {
        clearInterval(poll);
        signalGroup("SIGTERM");
        setTimeout(() => {
          signalGroup("SIGKILL");
          resolveExit();
        }, BUDGET_KILL_GRACE_SECONDS * 1000);
      }
    }, SUPERVISOR_POLL_MILLIS);
  });

const runChild = (
  command: string,
  args: string[],
  cwd: string,
  budgetWallClockSeconds?: number,
): Promise<RunResult> =>
  new Promise((resolveExit, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      shell: false,
      detached: true,
      stdio: ["ignore", "inherit", "inherit"],
    });
    const groupPid = -child.pid!;

    const signalGroup = (signal: NodeJS.Signals) => {
      try {
        process.kill(groupPid, signal);
      } catch {
        if (!child.killed) child.kill(signal);
      }
    };

    let budgetStopped = false;
    let budgetTimer: NodeJS.Timeout | undefined;
    let killTimer: NodeJS.Timeout | undefined;

    const clearBudgetTimers = () => {
      if (budgetTimer) clearTimeout(budgetTimer);
      if (killTimer) clearTimeout(killTimer);
      budgetTimer = undefined;
      killTimer = undefined;
    };

    if (budgetWallClockSeconds && budgetWallClockSeconds > 0) {
      budgetTimer = setTimeout(() => {
        budgetStopped = true;
        signalGroup("SIGTERM");
        killTimer = setTimeout(() => {
          signalGroup("SIGKILL");
        }, BUDGET_KILL_GRACE_SECONDS * 1000);
      }, budgetWallClockSeconds * 1000);
    }

    const forwardSignal = (signal: NodeJS.Signals) => signalGroup(signal);
    const onInterrupt = () => forwardSignal("SIGINT");
    const onTerminate = () => forwardSignal("SIGTERM");
    process.once("SIGINT", onInterrupt);
    process.once("SIGTERM", onTerminate);

    child.once("error", (error) => {
      clearBudgetTimers();
      reject(error);
    });
    child.once("close", (code) => {
      clearBudgetTimers();
      process.removeListener("SIGINT", onInterrupt);
      process.removeListener("SIGTERM", onTerminate);
      resolveExit({
        exitCode: code ?? 1,
        budgetStopped,
        budgetLimit: budgetStopped ? "wall-clock" : undefined,
        budgetSeconds: budgetStopped ? budgetWallClockSeconds : undefined,
      });
    });
  });

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

const main = async() => {
  const options = parseOptions(process.argv.slice(2));

  if (options.supervise) {
    await supervise(options.supervise.childPid, options.supervise.seconds);
    return;
  }

  const cwd = resolve(options.cwd);
  const agentPath = resolveFromCwd(options.agent as string, cwd);
  const definition = parseFrontMatter(await readFile(agentPath, "utf8"), agentPath);
  const task = options.task;
  if (!task || !task.trim()) throw new Error("Task direction is empty");

  const model = options.model ?? definition.model;
  const tools = options.tools ?? definition.tools;
  const skillPaths = uniquePaths([
    skillDirectory,
    ...options.skills.map((skill) => resolveFromCwd(skill, cwd)),
  ]);
  const piInvocation = resolvePi(options.pi, cwd);
  const baseArgs = ["--mode", "json", "--print", "--no-session"];
  if (model) baseArgs.push("--model", model);
  if (tools) baseArgs.push("--tools", tools);
  if (options.noTools) baseArgs.push("--no-tools");
  if (options.approve) baseArgs.push("--approve");
  if (options.noApprove) baseArgs.push("--no-approve");
  for (const skillPath of skillPaths) baseArgs.push("--skill", skillPath);

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
      skills: skillPaths,
      model: model ?? null,
      tools: tools ?? null,
      detach: options.detach ?? false,
      budget,
    }, null, 2)}\n`);
    return;
  }

  const prompt = [
    `You are running under the repository agent contract loaded from ${basename(agentPath)}.`,
    "The host-selected Pi tools and approval flags are authoritative for this process.",
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

  if (options.detach) {
    const jobDirectory = await mkdtemp(join(tmpdir(), "as-is-child-"));
    const promptPath = join(jobDirectory, "system-prompt.md");
    const logPath = join(jobDirectory, "child.log");
    await writeFile(promptPath, prompt, { encoding: "utf8", mode: 0o600 });
    const logFile = await open(logPath, "w");
    const resolvedChildArgs = childArgs.map((arg) => (arg === "<prompt-path>" ? promptPath : arg));
    const child = spawn(piInvocation.command, resolvedChildArgs, {
      cwd,
      env: process.env,
      shell: false,
      detached: true,
      stdio: ["ignore", logFile.fd, logFile.fd],
    });
    child.unref();

    if (options.budgetWallClockSeconds && options.budgetWallClockSeconds > 0) {
      spawn(
        Bun.which("bun") ?? "bun",
        [import.meta.path, "--supervise", String(child.pid), String(options.budgetWallClockSeconds)],
        { detached: true, stdio: "ignore" },
      ).unref();
    }

    const handle: Handle = {
      jobId: newJobId(),
      pid: child.pid,
      logPath,
      recordPath: options.record ?? null,
      budgetWallClockSeconds: options.budgetWallClockSeconds ?? null,
      budgetCostUsd: options.budgetCostUsd ?? null,
    };
    process.stdout.write(`${JSON.stringify(handle, null, 2)}\n`);
    return;
  }

  const promptDirectory = await mkdtemp(join(tmpdir(), "as-is-pi-agent-"));
  const promptPath = join(promptDirectory, `${basename(agentPath, ".md")}-system-prompt.md`);
  try {
    await writeFile(promptPath, prompt, { encoding: "utf8", mode: 0o600 });
    const result = await runChild(
      piInvocation.command,
      childArgs.map((arg) => (arg === "<prompt-path>" ? promptPath : arg)),
      cwd,
      options.budgetWallClockSeconds,
    );
    if (result.budgetStopped) {
      process.stderr.write(
        `as-is budget-stopped: limit=${result.budgetLimit} seconds=${result.budgetSeconds} exit=${BUDGET_STOPPED_EXIT_CODE}\n`,
      );
      process.exitCode = BUDGET_STOPPED_EXIT_CODE;
    } else {
      process.exitCode = result.exitCode;
    }
  } finally {
    await rm(promptDirectory, { recursive: true, force: true });
  }
};

try {
  await main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.stderr.write("Use --help for usage.\n");
  process.exitCode = 1;
}
