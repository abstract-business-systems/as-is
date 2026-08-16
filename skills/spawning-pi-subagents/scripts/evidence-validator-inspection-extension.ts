import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export const FOCUSED_CHECK_IDENTIFIER = "evidence-validator-focused-suite";
export const FOCUSED_CHECK_FILES = [
  "core/modules/task-control/task-record-validator.test.ts",
  "skills/managing-backlog/query.test.ts",
] as const;
const FOCUSED_CHECK_TIMEOUT_MS = 120_000;
const MAX_OUTPUT_BYTES = 32 * 1024;
const SAFE_ENVIRONMENT_KEYS = ["PATH", "HOME", "TMPDIR"] as const;

const OPERATIONS = {
  status: ["status", "--short"],
  diff: ["diff", "--no-ext-diff", "--", "skills/spawning-pi-subagents", "agents/evidence-validator"],
  diffCheck: ["diff", "--check", "--no-ext-diff", "--", "skills/spawning-pi-subagents", "agents/evidence-validator"],
  head: ["log", "-1", "--oneline", "--decorate"],
} as const;

type CapturedOutput = { text: string; truncated: boolean };
export type FocusedCheckResult = {
  identifier: typeof FOCUSED_CHECK_IDENTIFIER;
  files: readonly string[];
  status: "passed" | "failed" | "unavailable" | "launch-error" | "timed-out" | "truncated";
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
  reason?: string;
};

const capture = async (stream: ReadableStream<Uint8Array> | null): Promise<CapturedOutput> => {
  if (!stream) return { text: "", truncated: false };
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let bytes = 0;
  let truncated = false;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      const value = next.value;
      if (bytes >= MAX_OUTPUT_BYTES) {
        truncated = true;
        continue;
      }
      const remaining = MAX_OUTPUT_BYTES - bytes;
      const selected = value.byteLength <= remaining ? value : value.slice(0, remaining);
      chunks.push(decoder.decode(selected, { stream: true }));
      bytes += selected.byteLength;
      if (selected.byteLength < value.byteLength) truncated = true;
    }
    chunks.push(decoder.decode());
  } finally {
    reader.releaseLock();
  }
  return { text: chunks.join(""), truncated };
};

export const focusedCheckArguments = (bunExecutable: string): readonly string[] => [
  bunExecutable,
  "test",
  "--timeout",
  "20000",
  ...FOCUSED_CHECK_FILES,
];

export const focusedCheckEnvironment = (source: NodeJS.ProcessEnv): Record<string, string> => {
  const environment: Record<string, string> = {
    AS_IS_LIVE_INTEGRATION: "0",
    PI_OFFLINE: "1",
  };
  for (const key of SAFE_ENVIRONMENT_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) environment[key] = value;
  }
  return environment;
};

const result = (partial: Omit<FocusedCheckResult, "identifier" | "files">): FocusedCheckResult => ({
  identifier: FOCUSED_CHECK_IDENTIFIER,
  files: FOCUSED_CHECK_FILES,
  ...partial,
});

export const runFocusedCheck = async (cwd: string): Promise<FocusedCheckResult> => {
  const started = Date.now();
  const missing = FOCUSED_CHECK_FILES.filter((file) => !Bun.file(`${cwd}/${file}`).size);
  if (missing.length > 0) {
    return result({
      status: "unavailable",
      exitCode: null,
      durationMs: Date.now() - started,
      timedOut: false,
      stdout: "",
      stderr: "",
      stdoutTruncated: false,
      stderrTruncated: false,
      reason: "fixed focused-check input is unavailable",
    });
  }

  let child: ReturnType<typeof Bun.spawn>;
  try {
    child = Bun.spawn(focusedCheckArguments(process.execPath), {
      cwd,
      env: focusedCheckEnvironment(process.env),
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
      shell: false,
    });
  } catch {
    return result({
      status: "launch-error",
      exitCode: null,
      durationMs: Date.now() - started,
      timedOut: false,
      stdout: "",
      stderr: "",
      stdoutTruncated: false,
      stderrTruncated: false,
      reason: "fixed focused-check process could not be launched",
    });
  }

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill();
  }, FOCUSED_CHECK_TIMEOUT_MS);
  const [stdout, stderr, exitCode] = await Promise.all([
    capture(child.stdout),
    capture(child.stderr),
    child.exited,
  ]).finally(() => clearTimeout(timer));
  const durationMs = Date.now() - started;
  const common = {
    exitCode,
    durationMs,
    timedOut,
    stdout: stdout.text,
    stderr: stderr.text,
    stdoutTruncated: stdout.truncated,
    stderrTruncated: stderr.truncated,
  };
  if (timedOut) return result({ ...common, status: "timed-out", reason: "fixed focused-check timeout elapsed" });
  if (stdout.truncated || stderr.truncated) return result({ ...common, status: "truncated", reason: "fixed focused-check output exceeded its bound" });
  if (exitCode !== 0) return result({ ...common, status: "failed", reason: "fixed focused-check exited unsuccessfully" });
  return result({ ...common, status: "passed" });
};

const runInspection = async (cwd: string, operation: keyof typeof OPERATIONS): Promise<string> => {
  const proc = Bun.spawn(["git", "-C", cwd, ...OPERATIONS[operation]], {
    cwd,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const code = await proc.exited;
  if (code !== 0) throw new Error(`git inspection failed (${code}): ${stderr.trim()}`);
  return stdout.slice(0, 100_000);
};

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "git_inspect",
    label: "Git inspection",
    description: "Read-only bounded Git evidence: status, scoped diff, diff check, or HEAD summary.",
    parameters: Type.Object({
      operation: Type.Union([
        Type.Literal("status"), Type.Literal("diff"), Type.Literal("diffCheck"), Type.Literal("head"),
      ]),
    }),
    async execute(_id, params, _signal, _update, ctx) {
      return { content: [{ type: "text", text: await runInspection(ctx.cwd, params.operation) }], details: {} };
    },
  });

  pi.registerTool({
    name: "focused_check",
    label: "Focused check",
    description: "Run the code-owned, fixed evidence-validator focused suite without caller-selected inputs.",
    parameters: Type.Object({}),
    async execute(_id, _params, _signal, _update, ctx) {
      const evidence = await runFocusedCheck(ctx.cwd);
      return { content: [{ type: "text", text: JSON.stringify(evidence) }], details: evidence };
    },
  });

  pi.on("tool_call", async (event) => {
    if (["bash", "write", "edit", "webfetch", "websearch", "call_subagent"].includes(event.toolName)) {
      return { block: true, reason: "Expert validation permits only bounded read-only inspection and the fixed focused check." };
    }
    return undefined;
  });
}
