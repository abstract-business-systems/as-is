import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const root = import.meta.dir;
const design = readFileSync(join(root, "tracing-design.md"), "utf8");
const backlog = readFileSync(join(root, "backlog.md"), "utf8");
const context = readFileSync(join(root, "as-is.md"), "utf8");

const required = [
  "opaque Pi session ID",
  "scoped session-store reference",
  "configured role",
  "approved model and\nprovider metadata",
  "job/delegation correlation",
  "session revision and event\nrange",
  "bounded message/tool/usage counts",
  "byte counts",
  "timing",
  "missing-session status",
];

describe("session-reference-first observability policy", () => {
  test("defines bounded reference metadata and authorized resolution", () => {
    for (const phrase of required) expect(design).toContain(phrase);
    expect(design).toContain("separately authorized session inspection");
    expect(design).toContain("same least-privilege access, retention");
    expect(design).toContain("existing filtering, redaction, and byte bounds");
    expect(design).toContain("not authorization to add session sources");
  });

  test("excludes raw conversational and tool content from normal traces", () => {
    for (const phrase of [
      "Prompts, responses, tool arguments, and tool results are not normal trace\npayloads",
      "do not expose session contents",
      "never exports resolved\nsession content",
      "session-reference-first is the default",
    ]) {
      expect(`${design}\n${backlog}`).toContain(phrase);
    }
  });

  test("preserves supplementary authority and component boundaries", () => {
    expect(context).toContain("without becoming task, job, validation, recovery, or completion authority");
    expect(design).toContain("cannot authorize work,\naccept task status");
    expect(backlog).toContain("session logs remain host-managed evidence");
  });
});
