import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";

export interface InspectingExecutionEvidenceInput {
  readonly traceSelector: string;
  readonly question: string;
}

export interface InspectingExecutionEvidenceOutput {
  readonly matchedEvents: readonly string[];
  readonly correlationFindings: readonly string[];
  readonly observedAnomalies: readonly string[];
}

export const inspectingExecutionEvidenceSkill: ReusableSkill<InspectingExecutionEvidenceInput, InspectingExecutionEvidenceOutput> = {
  name: "inspecting-execution-evidence",
  description: "Inspects execution traces and session evidence for bounded question answering without task authority.",
  skillClass: "reusable",
  requiredTools: ["read"],
  async execute(context: SkillExecutionContext, input: InspectingExecutionEvidenceInput): Promise<StepResult<InspectingExecutionEvidenceOutput>> {
    if (!input.traceSelector || !input.question) {
      return {
        status: "blocked",
        error: "Missing traceSelector or question in inspecting-execution-evidence input",
      };
    }

    const events = context.tracer.getEvents();
    const matchedEvents = events
      .filter((e) => !input.traceSelector || e.type.includes(input.traceSelector))
      .map((e) => `[${e.type}] ${JSON.stringify(e.details)}`);

    const data: InspectingExecutionEvidenceOutput = {
      matchedEvents,
      correlationFindings: [`Analyzed ${matchedEvents.length} event(s) for question '${input.question}'`],
      observedAnomalies: [],
    };

    return {
      status: "completed",
      data,
      evidence: [`Inspected trace evidence: found ${matchedEvents.length} matching event(s)`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};