import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const OPERATIONS = {
  status: ["status", "--short"],
  diff: ["diff", "--no-ext-diff", "--", "skills/spawning-pi-subagents", "agents/expert"],
  diffCheck: ["diff", "--check", "--no-ext-diff", "--", "skills/spawning-pi-subagents", "agents/expert"],
  head: ["log", "-1", "--oneline", "--decorate"],
} as const;

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

  pi.on("tool_call", async (event) => {
    if (["bash", "write", "edit", "webfetch", "websearch"].includes(event.toolName)) {
      return { block: true, reason: "Expert validation permits only read-only inspection tools." };
    }
    return undefined;
  });
}
