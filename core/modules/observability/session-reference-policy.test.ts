import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const root = import.meta.dir;
const design = readFileSync(join(root, "tracing-design.md"), "utf8");
const backlog = readFileSync(join(root, "backlog.md"), "utf8");
const context = readFileSync(join(root, "as-is.md"), "utf8");

describe("session-reference-first observability policy", () => {
  test("defines session IDs, ownership-based local inspection, and useful resolution", () => {
    expect(design).toContain("opaque Pi session ID");
    expect(design).toContain("Local session inspection follows data ownership");
    expect(design).toContain("effective user and file permissions");
    expect(design).toContain("read-only and exact-ID based");
    expect(design).toContain("exports the session ID only");
    expect(design).toContain("never dereferences the local session store");
  });

  test("excludes local session data from external traces", () => {
    for (const phrase of [
      "does not contain session content",
      "never dereferences the local session store",
      "external sinks carry only opaque session IDs",
    ]) {
      expect(`${design}\n${backlog}`).toContain(phrase);
    }
  });

  test("preserves supplementary authority and component boundaries", () => {
    expect(context).toContain("without becoming task, job, validation, recovery, or completion authority");
    expect(design).toContain("cannot authorize work,\naccept task status");
    expect(backlog.toLowerCase()).toContain("local session files remain the readable evidence source");
  });
});
