import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export const FOCUSED_CHECK_IDENTIFIER = "evidence-validator-focused-suite";
export const FOCUSED_CHECK_FILES = [
  "core/modules/task-control/task-record-validator.test.ts",
  "skills/managing-backlog/query.test.ts",
] as const;
const FOCUSED_CHECK_TIMEOUT_MS = 120_000;
const KILL_GRACE_MS = 500;
const MAX_OUTPUT_BYTES = 32 * 1024;
// The launcher supplies the fixed Bun runtime; no caller-provided executable is accepted.
const FIXED_BUN_EXECUTABLE = process.execPath;

const OPERATIONS = {
  status: ["status", "--short"],
  diff: ["diff", "--no-ext-diff", "--", "skills/spawning-pi-subagents", "agents/evidence-validator"],
  diffCheck: ["diff", "--check", "--no-ext-diff", "--", "skills/spawning-pi-subagents", "agents/evidence-validator"],
  head: ["log", "-1", "--oneline", "--decorate"],
} as const;

type CapturedOutput = { text: string; truncated: boolean; error: boolean };
export type FocusedCheckResult = {
  identifier: typeof FOCUSED_CHECK_IDENTIFIER;
  files: readonly string[];
  status: "passed" | "failed" | "unavailable" | "launch-error" | "timed-out" | "truncated" | "observation-error";
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
  if (!stream) return { text: "", truncated: false, error: true };
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
    return { text: chunks.join(""), truncated, error: false };
  } catch {
    return { text: chunks.join(""), truncated, error: true };
  } finally {
    reader.releaseLock();
  }
};

export const focusedCheckArguments = (): readonly string[] => [
  FIXED_BUN_EXECUTABLE,
  "test",
  "--timeout",
  "20000",
  ...FOCUSED_CHECK_FILES,
];

export const focusedCheckEnvironment = (): Record<string, string> => ({
  AS_IS_LIVE_INTEGRATION: "0",
  PI_OFFLINE: "1",
});

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
    child = Bun.spawn(focusedCheckArguments(), {
      cwd,
      env: focusedCheckEnvironment(),
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

  const observe = Promise.all([
    capture(child.stdout),
    capture(child.stderr),
    child.exited,
  ]).then(
    (value) => ({ kind: "observed" as const, value: value as [CapturedOutput, CapturedOutput, number] }),
    () => ({ kind: "error" as const }),
  );
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), FOCUSED_CHECK_TIMEOUT_MS));
  const observed = await Promise.race([observe, timeout]);
  if (observed === null) {
    try { child.kill(); } catch { /* return bounded timeout evidence below */ }
    const afterKill = await Promise.race([observe, new Promise<null>((resolve) => setTimeout(() => resolve(null), KILL_GRACE_MS))]);
    if (afterKill !== null && afterKill.kind === "observed") {
      const [stdout, stderr, exitCode] = afterKill.value;
      return result({
        status: "timed-out",
        exitCode,
        durationMs: Date.now() - started,
        timedOut: true,
        stdout: stdout.text,
        stderr: stderr.text,
        stdoutTruncated: stdout.truncated,
        stderrTruncated: stderr.truncated,
        reason: "fixed focused-check timeout elapsed",
      });
    }
    return result({
      status: "timed-out",
      exitCode: null,
      durationMs: Date.now() - started,
      timedOut: true,
      stdout: "",
      stderr: "",
      stdoutTruncated: false,
      stderrTruncated: false,
      reason: "fixed focused-check timeout elapsed",
    });
  }
  if (observed.kind === "error") {
    return result({
      status: "observation-error",
      exitCode: null,
      durationMs: Date.now() - started,
      timedOut: false,
      stdout: "",
      stderr: "",
      stdoutTruncated: false,
      stderrTruncated: false,
      reason: "fixed focused-check process or output could not be observed",
    });
  }
  const [stdout, stderr, exitCode] = observed.value;
  const common = {
    exitCode,
    durationMs: Date.now() - started,
    timedOut: false,
    stdout: stdout.text,
    stderr: stderr.text,
    stdoutTruncated: stdout.truncated,
    stderrTruncated: stderr.truncated,
  };
  if (stdout.error || stderr.error) return result({ ...common, status: "observation-error", reason: "fixed focused-check output could not be observed" });
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
