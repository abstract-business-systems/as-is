import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface ResolvingScopesInput {
  readonly targetPath: string;
  readonly requestedOutcome: string;
}

export interface ResolvingScopesOutput {
  readonly scopeType: "component" | "artifact" | "project" | "root";
  readonly componentKey?: string;
  readonly scopeAllowlist: readonly string[];
  readonly requiresComponentTask: boolean;
}

export const resolvingScopesSkill: ReusableSkill<ResolvingScopesInput, ResolvingScopesOutput> = {
  name: "resolving-scopes",
  description: "Resolves component, artifact, project, or root scope allowlists.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: ResolvingScopesInput): Promise<StepResult<ResolvingScopesOutput>> {
    if (!input.targetPath || typeof input.targetPath !== "string") {
      return {
        status: "blocked",
        error: "Missing or invalid targetPath in resolving-scopes input",
      };
    }

    try {
      context.tracer.assertPathPermitted(input.targetPath, false);
    } catch (err) {
      return {
        status: "blocked",
        error: `Permission check failed for targetPath '${input.targetPath}': ${(err as Error).message}`,
      };
    }

    let scopeType: "component" | "artifact" | "project" | "root" = "artifact";
    let componentKey: string | undefined = undefined;
    let requiresComponentTask = false;

    if (input.targetPath === "." || input.targetPath === "as-is.md" || input.targetPath === "root") {
      scopeType = "root";
      componentKey = "root";
      requiresComponentTask = true;
    } else if (input.targetPath.includes("core/") || input.targetPath.includes("candidate/")) {
      scopeType = "component";
      if (input.targetPath.endsWith("/as-is.md")) {
        componentKey = input.targetPath.replace(/\/as-is\.md$/, "");
      } else {
        componentKey = input.targetPath.replace(/\/[^/]+$/, "");
      }
      requiresComponentTask = true;
    }

    const scopeAllowlist = [
      input.targetPath,
      ...(componentKey ? [`${componentKey}/**`] : []),
    ];

    const data: ResolvingScopesOutput = {
      scopeType,
      componentKey,
      scopeAllowlist,
      requiresComponentTask,
    };

    return {
      status: "completed",
      data,
      evidence: [`Resolved scope type '${scopeType}' with allowlist [${scopeAllowlist.join(", ")}]`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};
