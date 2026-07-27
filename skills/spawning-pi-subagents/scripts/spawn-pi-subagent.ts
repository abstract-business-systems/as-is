import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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

const skillDirectory = resolve(import.meta.dir, "..");

const usage = `Usage:
  bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts [options]

Required:
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
  }

  if (options.approve && options.noApprove) {
    throw new Error("Use only one of --approve and --no-approve");
  }
  if (!options.agent) throw new Error("--agent is required");
  if (!options.task) throw new Error("--task is required");

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

const runChild = (command: string, args: string[], cwd: string): Promise<number> =>
  new Promise((resolveExit, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      shell: false,
      stdio: ["ignore", "inherit", "inherit"],
    });

    const forwardSignal = (signal: NodeJS.Signals) => {
      if (!child.killed) child.kill(signal);
    };
    const onInterrupt = () => forwardSignal("SIGINT");
    const onTerminate = () => forwardSignal("SIGTERM");
    process.once("SIGINT", onInterrupt);
    process.once("SIGTERM", onTerminate);

    child.once("error", reject);
    child.once("close", (code) => {
      process.removeListener("SIGINT", onInterrupt);
      process.removeListener("SIGTERM", onTerminate);
      resolveExit(code ?? 1);
    });
  });

const main = async() => {
  const options = parseOptions(process.argv.slice(2));
  const cwd = resolve(options.cwd);
  const agentPath = resolveFromCwd(options.agent as string, cwd);
  const definition = parseFrontMatter(await readFile(agentPath, "utf8"), agentPath);
  const task = options.task;
  if (!task.trim()) throw new Error("Task direction is empty");

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
    }, null, 2)}\n`);
    return;
  }

  const promptDirectory = await mkdtemp(join(tmpdir(), "as-is-pi-agent-"));
  const promptPath = join(promptDirectory, `${basename(agentPath, ".md")}-system-prompt.md`);
  const prompt = [
    `You are running under the repository agent contract loaded from ${basename(agentPath)}.`,
    "The host-selected Pi tools and approval flags are authoritative for this process.",
    "",
    definition.body,
  ].join("\n");

  try {
    await writeFile(promptPath, prompt, { encoding: "utf8", mode: 0o600 });
    const exitCode = await runChild(
      piInvocation.command,
      [
        ...piInvocation.args,
        ...baseArgs,
        "--append-system-prompt",
        promptPath,
        `Task:\n${task}`,
      ],
      cwd,
    );
    process.exitCode = exitCode;
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
