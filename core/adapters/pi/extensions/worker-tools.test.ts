import { describe, expect, test } from "bun:test";
import { registerWorkerTools } from "./worker-tools.ts";

const tool = (name: string) => ({
  name,
  label: name,
  description: name,
  parameters: {},
  execute: async () => ({ content: [] }),
}) as never;

describe("package-owned worker registration boundary", () => {
  test("registers only the statically supplied host tools", () => {
    const registered: string[] = [];
    registerWorkerTools({ registerTool: (value: { name: string }) => registered.push(value.name) }, {
      version: 1,
      getTools: () => [tool("call_subagent"), tool("resolve_component_context")],
    });
    expect(registered).toEqual(["call_subagent", "resolve_component_context"]);
  });

  test("fails closed for unsupported service versions", () => {
    expect(() => registerWorkerTools({ registerTool: () => undefined }, {
      version: 2 as never,
      getTools: () => [],
    })).toThrow("unsupported subagent host services version");
  });

  test("fails closed for duplicate host tool names", () => {
    expect(() => registerWorkerTools({ registerTool: () => undefined }, {
      version: 1,
      getTools: () => [tool("duplicate"), tool("duplicate")],
    })).toThrow("duplicate tool");
  });
});
