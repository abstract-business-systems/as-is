#!/usr/bin/env bun
/** Print a compact, read-only repository task snapshot for agent orientation. */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { ControlPlane, type TaskSnapshot } from "../../../components/control-plane/control-plane";

export type OrientationSnapshot = {
  root: { status: string; nextAction: string };
  components: Array<Pick<TaskSnapshot, "path" | "status">>;
  open: Array<Pick<TaskSnapshot, "path" | "status" | "worker" | "blockers">>;
  changelog: { entry: string; residualRisk: string[] };
  openDecisions: string[];
  workingTree: string[] | "clean";
};

const walk = (root: string): string[] => {
  const result: string[] = [];
  const skip = new Set([".git", "node_modules", ".pi", ".opencode"]);
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !skip.has(entry.name)) visit(join(dir, entry.name));
      else if (entry.isFile() && entry.name.endsWith(".md")) result.push(join(dir, entry.name));
    }
  };
  visit(root);
  return result;
};

const nextAction = (root: string): string => {
  const text = readFileSync(join(root, "as-is.md"), "utf8");
  const match = text.match(/^## Next Action\s*$([\s\S]*?)(?=^## |$)/m);
  return match?.[1].trim().replace(/\s+/g, " ") || "not recorded";
};

const changelog = (root: string): OrientationSnapshot["changelog"] => {
  const text = readFileSync(join(root, "as-is.md"), "utf8");
  const match = text.match(/^## Changelog\s*$([\s\S]*?)(?=^## |$)/m);
  const entry = match?.[1].trim() || "not recorded";
  const residualRisk: string[] = [];
  for (const line of entry.split("\n")) {
    if (/residual[- ]risk/i.test(line)) residualRisk.push(line.replace(/^[-*]\s*/, "").trim());
  }
  return { entry, residualRisk };
};

const decisions = (root: string): string[] => {
  const lines: string[] = [];
  for (const file of walk(root)) {
    const name = file.toLowerCase();
    if (!(name.includes("design") || name.includes("spec") || name.endsWith("independent-delegation.md"))) continue;
    readFileSync(file, "utf8").split("\n").forEach((line, index) => {
      if (/open decision|open question/i.test(line)) lines.push(`${relative(root, file)}:${index + 1}: ${line.trim()}`);
    });
  }
  return lines;
};

export function snapshot(root = process.cwd()): OrientationSnapshot {
  const resolved = resolve(root);
  const report = new ControlPlane(resolved).status() as { tasks: TaskSnapshot[] };
  const tasks = report.tasks;
  const rootTask = tasks.find((task) => task.path === ".") ?? tasks[0];
  let status: string[];
  try {
    const porcelain = execFileSync("git", ["status", "--porcelain"], { cwd: resolved, encoding: "utf8" }).trim();
    status = porcelain ? porcelain.split("\n") : [];
  } catch {
    status = ["git status unavailable"];
  }
  return {
    root: { status: rootTask?.status ?? "unknown", nextAction: nextAction(resolved) },
    components: tasks.map(({ path, status }) => ({ path, status })),
    open: tasks.filter((task) => task.status !== "completed").map(({ path, status, worker, blockers }) => ({ path, status, worker, blockers })),
    changelog: changelog(resolved),
    openDecisions: decisions(resolved),
    workingTree: status.length ? status : "clean",
  };
}

if (import.meta.main) console.log(JSON.stringify(snapshot(), null, 2));
