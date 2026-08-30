import type {
  MasterSkill,
  CompositionVariant,
  SkillExecutionContext,
  CompositionExecutionResult,
  StepResult,
} from "../types";

export interface ConsultingHumansInput {
  decisionTitle: string;
  tradeOffs: ReadonlyArray<{ label: string; tradeOff: string }>;
}

export interface ConsultingHumansOutput {
  decisionBrief: string;
  consultationStatus: "presented" | "accepted" | "rejected";
}

const consultingVariant: CompositionVariant = {
  name: "decision-consultation",
  description: "Frames architectural questions and presents trade-offs for human decision.",
  preferredSkills: ["presenting-decisions"],
  requiredTools: ["read", "write"],
  steps: [
    {
      id: "present-tradeoffs",
      name: "Present Decision Brief",
      preferredSkill: "presenting-decisions",
      requiredTools: ["read", "write"],
      execute: async (context: SkillExecutionContext, input?: any): Promise<StepResult<any>> => {
        return {
          status: "completed",
          data: {
            decisionBrief: `Presented decision brief: ${input.decisionTitle}`,
            consultationStatus: "presented",
          },
          evidence: ["Human consultation brief formatted cleanly"],
          spend: { units: 1, wallClockSeconds: 1 },
        };
      },
    },
  ],
};

export const consultingHumansMasterSkill: MasterSkill<ConsultingHumansInput, ConsultingHumansOutput> = {
  name: "consulting-humans",
  description: "Master composition for human-centered decision consultation.",
  skillClass: "master",
  variants: {
    "decision-consultation": consultingVariant,
  },
  defaultVariant: "decision-consultation",
  async execute(): Promise<CompositionExecutionResult<ConsultingHumansOutput>> {
    throw new Error("Execute master skills via CompositionRunner");
  },
};
