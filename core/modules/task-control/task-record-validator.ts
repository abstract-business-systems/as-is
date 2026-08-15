#!/usr/bin/env bun
/** Dependency-free deterministic validator for JSON-backed task records. */

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const STATUSES = new Set(["ready", "active", "blocked", "awaiting-approval", "completed", "failed", "cancelled"]);
const TERMINAL = new Set(["completed", "failed", "cancelled"]);
const EFFECT_RANK: Record<string, number> = { prohibited: 0, "require-current-turn-user-approval": 1 };
const SECTIONS = ["Requirement", "Plan", "Progress", "Validation", "Result", "Blockers And Escalations", "Recovery", "Next Action"];

type AnyRecord = Record<string, any>;
type LoadedRecord = { directory: string; data: AnyRecord; body: string; label: string };

export class ValidationError extends Error {}

function mapping(value: unknown): value is AnyRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function loadRecord(directory: string, taskName: string): LoadedRecord {
  const companionPath = `${directory}/as-is.json`;
  let companion: AnyRecord;
  try { companion = JSON.parse(readFileSync(companionPath, "utf8")); } catch (error) { throw new ValidationError(`${companionPath}: invalid or unreadable JSON companion: ${String(error)}`); }
  if (!mapping(companion) || !mapping(companion.task)) throw new ValidationError(`${companionPath}: task must be an object`);
  const narrativePath = `${directory}/${taskName}`;
  let body: string;
  try { body = readFileSync(narrativePath, "utf8"); } catch (error) { throw new ValidationError(`${narrativePath}: cannot read: ${String(error)}`); }
  if (body.startsWith("---\n")) throw new ValidationError(`${narrativePath}: legacy YAML task narrative is unsupported`);
  const task = companion.task;
  const taskData: AnyRecord = {};
  for (const key of ["status", "worker", "updated"]) if (key in task) taskData[key] = task[key];
  return { directory, label: directory, body, data: { "as-is-version": 2, task: taskData, constraints: task.constraints, acceptance: task.acceptance } };
}

function requireKeys(where: string, value: unknown, expected: Set<string>, errors: string[]): boolean {
  if (!mapping(value)) { errors.push(`${where}: must be a mapping`); return false; }
  const unknown = Object.keys(value).filter((key) => !expected.has(key));
  const missing = [...expected].filter((key) => !(key in value));
  if (unknown.length) errors.push(`${where}: unknown fields: ${unknown.sort().join(", ")}`);
  if (missing.length) errors.push(`${where}: missing fields: ${missing.sort().join(", ")}`);
  return unknown.length === 0 && missing.length === 0;
}

function number(where: string, value: unknown, errors: string[]): boolean {
  if ((typeof value !== "number" && typeof value !== "bigint") || typeof value === "bigint" || !Number.isFinite(value as number) || (value as number) < 0) { errors.push(`${where}: must be a non-negative number`); return false; }
  return true;
}

function validUtcTimestamp(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const hour = Number(hourText), minute = Number(minuteText), second = Number(secondText);
  if (year < 1 || month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= days[month - 1];
}

function validateShape(record: LoadedRecord, errors: string[]): void {
  const { data, label } = record;
  requireKeys(label, data, new Set(["as-is-version", "task", "constraints", "acceptance"]), errors);
  if (data["as-is-version"] !== 2) errors.push(`${label}: as-is-version must be 2`);
  const task = data.task;
  if (mapping(task) && requireKeys(`${label}.task`, task, new Set(["status", "worker", "updated"]), errors)) {
    if (!STATUSES.has(task.status)) errors.push(`${label}.task.status: invalid status`);
    if (typeof task.worker !== "string" || !task.worker) errors.push(`${label}.task.worker: must be a non-empty string`);
    if (typeof task.updated !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(task.updated)) errors.push(`${label}.task.updated: must be an RFC 3339 UTC timestamp`);
    else if (!validUtcTimestamp(task.updated)) errors.push(`${label}.task.updated: invalid timestamp`);
  }
  const constraints = data.constraints;
  if (!mapping(constraints) || !requireKeys(`${label}.constraints`, constraints, new Set(["cost", "delegation", "execution", "external-effects"]), errors)) return;
  const cost = constraints.cost;
  if (mapping(cost) && requireKeys(`${label}.constraints.cost`, cost, new Set(["currency", "allocated", "spent", "reserve", "source", "fallback-metric"]), errors)) {
    for (const key of ["allocated", "spent", "reserve"]) number(`${label}.constraints.cost.${key}`, cost[key], errors);
    if (typeof cost.currency !== "string" || !cost.currency) errors.push(`${label}.constraints.cost.currency: must be a non-empty string`);
    if (cost.spent + cost.reserve > cost.allocated) errors.push(`${label}.constraints.cost: spent plus reserve exceeds allocation`);
  }
  const delegation = constraints.delegation;
  if (mapping(delegation) && requireKeys(`${label}.constraints.delegation`, delegation, new Set(["maximum-depth", "maximum-children"]), errors)) {
    for (const key of ["maximum-depth", "maximum-children"]) if (!Number.isInteger(delegation[key]) || delegation[key] < 0) errors.push(`${label}.constraints.delegation.${key}: must be a non-negative integer`);
  }
  const execution = constraints.execution;
  if (mapping(execution) && requireKeys(`${label}.constraints.execution`, execution, new Set(["wall-clock"]), errors)) {
    const wall = execution["wall-clock"];
    if (mapping(wall) && requireKeys(`${label}.constraints.execution.wall-clock`, wall, new Set(["allocated-seconds", "spent-seconds", "reserve-seconds", "source"]), errors)) {
      for (const key of ["allocated-seconds", "spent-seconds", "reserve-seconds"]) number(`${label}.constraints.execution.wall-clock.${key}`, wall[key], errors);
      if (wall["spent-seconds"] + wall["reserve-seconds"] > wall["allocated-seconds"]) errors.push(`${label}.constraints.execution.wall-clock: spent plus reserve exceeds allocation`);
    }
  }
  if (!(constraints["external-effects"] in EFFECT_RANK)) errors.push(`${label}.constraints.external-effects: unsupported policy`);
  if (!Array.isArray(data.acceptance) || !data.acceptance.length || !data.acceptance.every((item: unknown) => typeof item === "string" && item.length > 0)) errors.push(`${label}.acceptance: must be a non-empty string list`);
  for (const section of SECTIONS) if (!new RegExp(`^## ${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m").test(record.body)) errors.push(`${label}: missing body section ${section}`);
}

function resultSection(body: string): string {
  return body.match(/^## Result\s*$([\s\S]*?)(?=^## |\Z)/m)?.[1] ?? "";
}

function descendants(records: LoadedRecord[], parent: LoadedRecord): LoadedRecord[] {
  return records.filter((record) => record.directory !== parent.directory && record.directory.startsWith(`${parent.directory}/`));
}

export function validateTree(root: string): string[] {
  const rootPath = resolve(root);
  let rootData: AnyRecord;
  try { rootData = JSON.parse(readFileSync(`${rootPath}/as-is.json`, "utf8")); } catch (error) { return [`${rootPath}/as-is.json: invalid or unreadable root companion: ${String(error)}`]; }
  const taskName = rootData?.configuration?.records?.filenames?.task ?? "tasks.md";
  if (typeof taskName !== "string" || !taskName || taskName === "." || taskName === ".." || taskName.includes("/") || taskName.includes("\\") || taskName === "as-is.md") return [`${rootPath}/as-is.json: configured task filename is unsafe`];
  const directories = [rootPath];
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
      if (entry.isDirectory()) walk(`${directory}/${entry.name}`);
      else if (entry.name === "as-is.json" && directory !== rootPath) directories.push(directory);
    }
  };
  walk(rootPath);
  const records: LoadedRecord[] = [];
  try {
    for (const directory of directories) { if (mapping(JSON.parse(readFileSync(`${directory}/as-is.json`, "utf8"))) && "task" in JSON.parse(readFileSync(`${directory}/as-is.json`, "utf8"))) records.push(loadRecord(directory, taskName)); }
  } catch (error) { return [String(error)]; }
  if (!records.some((record) => record.directory === rootPath)) {
    if (rootData.task === undefined) return [];
    return [`${rootPath}: no root JSON task record`];
  }
  const errors: string[] = [];
  for (const record of records) validateShape(record, errors);
  for (const parent of records) {
    const children = records.filter((record) => record.directory !== parent.directory && record.directory.startsWith(`${parent.directory}/`) && record.directory.slice(parent.directory.length + 1).indexOf("/") < 0);
    const constraints = parent.data.constraints;
    if (!mapping(constraints)) continue;
    const delegation = constraints.delegation;
    if (!mapping(delegation)) continue;
    if (Number.isInteger(delegation["maximum-children"]) && children.length > delegation["maximum-children"]) errors.push(`${parent.label}: child count exceeds maximum-children`);
    let costTotal = 0, wallTotal = 0;
    for (const child of children) {
      const childConstraints = child.data.constraints;
      if (!mapping(childConstraints) || !mapping(childConstraints.delegation)) continue;
      if (EFFECT_RANK[childConstraints["external-effects"]] > EFFECT_RANK[constraints["external-effects"]]) errors.push(`${child.label}: external-effects weakens parent policy`);
      if (Number.isInteger(delegation["maximum-depth"]) && Number.isInteger(childConstraints.delegation["maximum-depth"]) && childConstraints.delegation["maximum-depth"] > delegation["maximum-depth"] - 1) errors.push(`${child.label}: maximum-depth weakens parent delegation limit`);
      if (Number.isInteger(delegation["maximum-children"]) && Number.isInteger(childConstraints.delegation["maximum-children"]) && childConstraints.delegation["maximum-children"] > delegation["maximum-children"]) errors.push(`${child.label}: maximum-children weakens parent delegation limit`);
      costTotal += childConstraints.cost?.allocated ?? 0;
      wallTotal += childConstraints.execution?.["wall-clock"]?.["allocated-seconds"] ?? 0;
    }
    const remainingCost = (constraints.cost?.allocated ?? 0) - (constraints.cost?.spent ?? 0) - (constraints.cost?.reserve ?? 0);
    const remainingWall = (constraints.execution?.["wall-clock"]?.["allocated-seconds"] ?? 0) - (constraints.execution?.["wall-clock"]?.["spent-seconds"] ?? 0) - (constraints.execution?.["wall-clock"]?.["reserve-seconds"] ?? 0);
    if (costTotal > remainingCost) errors.push(`${parent.label}: child cost allocations exceed remaining budget`);
    if (wallTotal > remainingWall) errors.push(`${parent.label}: child wall-clock allocations exceed remaining budget`);
    if (parent.data.task?.status === "completed") for (const descendant of descendants(records, parent)) { const status = descendant.data.task?.status; const relative = descendant.directory.slice(parent.directory.length + 1); if (!TERMINAL.has(status)) errors.push(`${parent.label}: completed record has non-terminal descendant ${relative}`); else if ((status === "failed" || status === "cancelled") && !resultSection(parent.body).includes(relative)) errors.push(`${parent.label}: completed record does not account for ${status} descendant ${relative} in Result`); }
  }
  return errors;
}

if (import.meta.main) {
  const errors = validateTree(process.argv[2] ?? ".");
  if (errors.length) { console.log("INVALID\n" + errors.map((error) => `- ${error}`).join("\n")); process.exit(1); }
  console.log("VALID");
}
