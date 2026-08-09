import { expect, test } from "bun:test";

type Availability = {
  roles: { name: string; description: string }[];
  skills: { name: string; description: string }[];
  admittedRoles: string[];
};

type Request = {
  withinCapabilities: boolean;
  componentWork?: boolean;
  reportOnlyWorkerAdvice?: boolean;
  durableHandoff?: boolean;
  receivingIntegrationOwner?: string;
  specializedSkill: boolean;
  anotherAuthority: boolean;
  substantive: boolean;
  multiSource: boolean;
  ambiguous: boolean;
  target?: string;
  resolvedTarget?: string;
  requiredSkill?: string;
  requiredCapability?: string;
  requiredRoleUtility?: string;
};

type Route = "direct" | "component-builder" | "worker-advice" | "admitted-authority" | "analysis" | "reject-self" | "blocked";

function route(request: Request, availability: Availability): Route {
  if (request.target === "as-is" || request.resolvedTarget === "agents/as-is/agent.md") return "reject-self";
  if (request.componentWork) {
    return request.durableHandoff && request.receivingIntegrationOwner === "component-builder"
      ? "component-builder" : "blocked";
  }
  if (request.reportOnlyWorkerAdvice) return "worker-advice";
  const direct = request.withinCapabilities &&
    !request.specializedSkill &&
    !request.anotherAuthority &&
    !request.substantive &&
    !request.multiSource &&
    !request.ambiguous;
  if (direct) return "direct";
  if (request.anotherAuthority || request.substantive || request.multiSource || request.ambiguous) {
    return availability.roles.some(({ name, description }) =>
      availability.admittedRoles.includes(name) && description.includes(request.requiredCapability ?? "component"))
      ? "admitted-authority" : "blocked";
  }
  if (request.specializedSkill) {
    const hasAnalysisRole = availability.roles.some(({ name, description }) =>
      availability.admittedRoles.includes(name) && description.includes(request.requiredRoleUtility ?? ""));
    const hasRequiredSkill = !!request.requiredSkill && availability.skills.some(({ name, description }) =>
      name === request.requiredSkill && description.includes(request.requiredCapability ?? ""));
    return hasAnalysisRole && hasRequiredSkill ? "analysis" : "blocked";
  }
  if (availability.roles.some(({ name, description }) =>
    availability.admittedRoles.includes(name) && description.includes(request.requiredCapability ?? "component"))) return "admitted-authority";
  return "blocked";
}

const available: Availability = {
  roles: [
    { name: "front-door", description: "user-facing routing" },
    { name: "builder-role", description: "component implementation authority" },
    { name: "review-role", description: "read-only analysis" },
  ],
  skills: [{ name: "renamed-helper", description: "selects evidence checks" }],
  admittedRoles: ["builder-role", "review-role"],
};

const contract = await Bun.file(new URL("./agent.md", import.meta.url)).text();
test("the compact contract preserves routing authority invariants", () => {
  expect(Buffer.byteLength(contract)).toBeLessThan(2000);
  expect(contract).toContain("context queries");
  expect(contract).toContain("recommendation, not\nauthorization");
  expect(contract).toContain("supplied\nskill");
  expect(contract).toContain("no specialized capability");
  expect(contract).toContain("fit, not permission");
  expect(contract).toContain("Agents are independent");
  expect(contract).toContain("best-fit available agent");
  expect(contract).toContain("most useful supplied\nskill");
  expect(contract).toContain("Never delegate to yourself");
  expect(contract).toContain("silently substitute or\nretry");
});
const direct = {
  withinCapabilities: true,
  specializedSkill: false,
  anotherAuthority: false,
  substantive: false,
  multiSource: false,
  ambiguous: false,
};

test("component work routes to component-builder with durable integration ownership", () => {
  const componentRequest = {
    ...direct,
    componentWork: true,
    substantive: true,
    durableHandoff: true,
    receivingIntegrationOwner: "component-builder",
  };
  expect(route(componentRequest, available)).toBe("component-builder");
  expect(route({ ...componentRequest, receivingIntegrationOwner: "worker" }, available)).toBe("blocked");
  expect(route({ ...componentRequest, durableHandoff: false }, available)).toBe("blocked");
});

test("non-component worker assistance remains report-only", () => {
  expect(route({ ...direct, reportOnlyWorkerAdvice: true }, available)).toBe("worker-advice");
  expect(route({ ...direct, reportOnlyWorkerAdvice: true, componentWork: true, durableHandoff: true, receivingIntegrationOwner: "component-builder" }, available)).toBe("component-builder");
});

test("the contract records the receiving owner and handoff evidence model", () => {
  expect(contract).toContain("component-builder");
  expect(contract).toContain("receiving integration owner");
  expect(contract).toContain("source/result scope and ancestry evidence");
  expect(contract).toContain("report-only advice");
});

test("directly handles only fully capable, non-substantive requests", () => {
  expect(route(direct, available)).toBe("direct");
  expect(route({ ...direct, substantive: true }, available)).toBe("admitted-authority");
  expect(route({ ...direct, withinCapabilities: false }, available)).toBe("admitted-authority");
});

test("specialized capability, authority, investigation, and ambiguity route away from direct handling", () => {
  expect(route({ ...direct, specializedSkill: true, requiredSkill: "renamed-helper", requiredCapability: "evidence", requiredRoleUtility: "read-only analysis" }, available)).toBe("analysis");
  expect(route({ ...direct, specializedSkill: true, requiredSkill: "missing-skill", requiredCapability: "evidence" }, available)).toBe("blocked");
  expect(route({ ...direct, specializedSkill: true, anotherAuthority: true, requiredSkill: "renamed-helper", requiredCapability: "component" }, available)).toBe("admitted-authority");
  expect(route({ ...direct, anotherAuthority: true }, available)).toBe("admitted-authority");
  expect(route({ ...direct, multiSource: true }, available)).toBe("admitted-authority");
  expect(route({ ...direct, ambiguous: true }, available)).toBe("admitted-authority");
});

test("self-targeted as-is launches are rejected before delegation or substitution", () => {
  expect(route({ ...direct, target: "as-is" }, available)).toBe("reject-self");
  expect(route({ ...direct, substantive: true, target: "as-is" }, available)).toBe("reject-self");
});

test("descriptive fit does not grant authority", () => {
  const fitting = { roles: [{ name: "unadmitted", description: "component implementation authority" }], skills: [], admittedRoles: [] };
  expect(route({ ...direct, substantive: true, requiredCapability: "component" }, fitting)).toBe("blocked");
  // A description identifies fit, but admission remains the authority gate.
  expect(fitting.roles[0].description).toContain("component");
});

test("unavailable roles do not get silently substituted", () => {
  expect(route({ ...direct, substantive: true }, { roles: [{ name: "front-door", description: "user-facing routing" }], skills: [], admittedRoles: [] })).toBe("blocked");
  expect(route({ ...direct, resolvedTarget: "agents/as-is/agent.md" }, available)).toBe("reject-self");
  expect(route({ ...direct, specializedSkill: true, requiredSkill: "renamed-helper", requiredCapability: "evidence", target: "as-is" }, available)).toBe("reject-self");
});
