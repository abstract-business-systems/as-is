import { describe, it, expect, beforeEach } from "bun:test";
import { resolve } from "node:path";
import {
  SkillRegistry,
  createDefaultSkillRegistry,
  contextBuildingSkill,
  verificationDisciplineSkill,
  namingSoftwareConceptsSkill,
  implementingTasksMasterSkill,
  buildingComponentsMasterSkill,
} from "../../skills";
import { loadRoleContracts } from "../../agents";

describe("Candidate Skill Registry", () => {
  let registry: SkillRegistry;
  let contracts: Awaited<ReturnType<typeof loadRoleContracts>>;

  beforeEach(async () => {
    registry = new SkillRegistry();
    const agentsDir = resolve(import.meta.dir, "../../agents");
    contracts = await loadRoleContracts(agentsDir);
  });

  it("registers and discovers reusable skills and master skills", () => {
    registry.registerReusable(contextBuildingSkill);
    registry.registerReusable(verificationDisciplineSkill);
    registry.registerReusable(namingSoftwareConceptsSkill);

    registry.registerMaster(implementingTasksMasterSkill);
    registry.registerMaster(buildingComponentsMasterSkill);

    expect(registry.listReusableSkills().length).toBe(3);
    expect(registry.listMasterSkills().length).toBe(2);

    expect(registry.getReusable("context-building")).toBe(contextBuildingSkill);
    expect(registry.getMaster("building-components")).toBe(buildingComponentsMasterSkill);
    expect(registry.getReusable("non-existent")).toBeUndefined();
  });

  it("populates the full catalog of 24 reusable skills and 12 master compositions via createDefaultSkillRegistry", () => {
    const defaultRegistry = createDefaultSkillRegistry();
    expect(defaultRegistry.listReusableSkills().length).toBe(24);
    expect(defaultRegistry.listMasterSkills().length).toBe(12);

    // Verify critical master skills
    expect(defaultRegistry.getMaster("making-changes")).toBeDefined();
    expect(defaultRegistry.getMaster("building-components")).toBeDefined();
    expect(defaultRegistry.getMaster("implementing-tasks")).toBeDefined();
    expect(defaultRegistry.getMaster("maintaining-components")).toBeDefined();
    expect(defaultRegistry.getMaster("managing-as-is-records")).toBeDefined();
    expect(defaultRegistry.getMaster("designing-mermaid-diagrams")).toBeDefined();
    expect(defaultRegistry.getMaster("managing-backlogs")).toBeDefined();
    expect(defaultRegistry.getMaster("managing-changelogs")).toBeDefined();
    expect(defaultRegistry.getMaster("spawning-subagents")).toBeDefined();
    expect(defaultRegistry.getMaster("exploring-execution-evidence")).toBeDefined();
    expect(defaultRegistry.getMaster("consulting-humans")).toBeDefined();
    expect(defaultRegistry.getMaster("committing-completed-work")).toBeDefined();
  });

  it("prevents duplicate registrations", () => {
    registry.registerReusable(contextBuildingSkill);
    expect(() => registry.registerReusable(contextBuildingSkill)).toThrow("already registered");

    registry.registerMaster(implementingTasksMasterSkill);
    expect(() => registry.registerMaster(implementingTasksMasterSkill)).toThrow("already registered");
  });

  it("validates agent tool capabilities accurately against master compositions", () => {
    registry.registerMaster(buildingComponentsMasterSkill);
    registry.registerMaster(implementingTasksMasterSkill);

    const implementer = contracts.get("implementer")!;
    const worker = contracts.get("worker")!;
    const planningAdviser = contracts.get("planning-adviser")!;

    // Implementer has bash and all tools -> eligible for building-components
    const implementerCheck = registry.validateAgentCapabilities(
      implementer,
      buildingComponentsMasterSkill
    );
    expect(implementerCheck.eligible).toBe(true);
    expect(implementerCheck.missingTools.length).toBe(0);

    // Worker lacks bash -> ineligible for building-components (requires bash)
    const workerCheck = registry.validateAgentCapabilities(
      worker,
      buildingComponentsMasterSkill
    );
    expect(workerCheck.eligible).toBe(false);
    expect(workerCheck.missingTools).toContain("bash");

    // Worker has edit/write -> eligible for implementing-tasks
    const workerTaskCheck = registry.validateAgentCapabilities(
      worker,
      implementingTasksMasterSkill
    );
    expect(workerTaskCheck.eligible).toBe(true);

    // Planning Adviser has 0 tools -> ineligible for implementing-tasks
    const adviserCheck = registry.validateAgentCapabilities(
      planningAdviser,
      implementingTasksMasterSkill
    );
    expect(adviserCheck.eligible).toBe(false);
    expect(adviserCheck.missingTools.length).toBeGreaterThan(0);
  });
});
