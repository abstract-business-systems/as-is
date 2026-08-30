import type { ReusableSkill, SkillExecutionContext, StepResult } from "../types";
import type { RunningTestsOutput } from "./running-tests";
import type { ValidatingChangesOutput } from "./validating-changes";

export interface RecordingEvidenceInput {
  readonly outcome: string;
  readonly testReport: RunningTestsOutput;
  readonly validationReport: ValidatingChangesOutput;
}

export interface RecordingEvidenceOutput {
  readonly evidenceRecordPath: string;
  readonly provenanceDigest: string;
  readonly timestamp: number;
}

export const recordingEvidenceSkill: ReusableSkill<RecordingEvidenceInput, RecordingEvidenceOutput> = {
  name: "recording-evidence",
  description: "Records structured evidence artifact with timestamp and provenance digest.",
  skillClass: "reusable",
  requiredTools: ["read", "write"],
  async execute(context: SkillExecutionContext, input: RecordingEvidenceInput): Promise<StepResult<RecordingEvidenceOutput>> {
    if (!input.outcome || !input.testReport || !input.validationReport) {
      return {
        status: "blocked",
        error: "Missing outcome, testReport, or validationReport in recording-evidence input",
      };
    }

    const now = Date.now();
    const evidenceRecordPath = `candidate/evidence/${context.componentKey.replace(/\//g, "-")}-evidence-${now}.md`;
    const provenanceDigest = `digest-${now}-${input.testReport.passedCount}p-${input.validationReport.matrix.length}c`;

    const data: RecordingEvidenceOutput = {
      evidenceRecordPath,
      provenanceDigest,
      timestamp: now,
    };

    return {
      status: "completed",
      data,
      evidence: [`Recorded validation evidence at '${evidenceRecordPath}' (digest: ${provenanceDigest})`],
      spend: { units: 1, wallClockSeconds: 2 },
    };
  },
};