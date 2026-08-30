import type { AgentContract } from "../agents/types";
import type { SkillRegistry } from "./registry";
import type {
  CompositionExecutionResult,
  CompositionVariant,
  MasterSkill,
  SkillExecutionContext,
  SkillSpend,
} from "./types";

export class CompositionRunner {
  constructor(private readonly registry: SkillRegistry) {}

  async runComposition<TInput = unknown, TOutput = unknown>(
    masterSkill: MasterSkill<TInput, TOutput>,
    context: SkillExecutionContext,
    variantName?: string,
    initialInput?: TInput
  ): Promise<CompositionExecutionResult<TOutput>> {
    const selectedVariantName = variantName ?? masterSkill.defaultVariant;
    const variant: CompositionVariant | undefined = masterSkill.variants[selectedVariantName];

    if (!variant) {
      const errorMsg = `Unknown composition variant '${selectedVariantName}' for master skill '${masterSkill.name}'`;
      context.tracer.record({
        type: "composition_failed",
        compositionName: masterSkill.name,
        details: { error: errorMsg },
      });
      return {
        status: "blocked",
        compositionName: masterSkill.name,
        variantName: selectedVariantName,
        executedSteps: [],
        evidence: [],
        totalSpend: { units: 0, wallClockSeconds: 0 },
        traces: context.tracer.getEvents(),
        error: errorMsg,
      };
    }

    // Pre-flight tool capability validation
    const capCheck = this.registry.validateAgentCapabilities(context.assignedAgent, variant);
    if (!capCheck.eligible) {
      context.tracer.record({
        type: "composition_failed",
        compositionName: masterSkill.name,
        details: {
          error: capCheck.reason,
          missingTools: capCheck.missingTools,
        },
      });
      return {
        status: "blocked",
        compositionName: masterSkill.name,
        variantName: selectedVariantName,
        executedSteps: [],
        evidence: [],
        totalSpend: { units: 0, wallClockSeconds: 0 },
        traces: context.tracer.getEvents(),
        error: capCheck.reason,
      };
    }

    context.tracer.record({
      type: "composition_start",
      compositionName: masterSkill.name,
      role: context.assignedAgent.role,
      details: {
        variantName: selectedVariantName,
        stepCount: variant.steps.length,
        taskRevision: context.taskRevision,
        componentKey: context.componentKey,
      },
    });

    const executedSteps: string[] = [];
    const collectedEvidence: string[] = [];
    let currentInput: unknown = initialInput;
    let finalData: TOutput | undefined;

    for (const step of variant.steps) {
      // Step condition / gate check
      if (step.condition) {
        const canExecute = await step.condition(context);
        context.tracer.record({
          type: "gate_evaluated",
          stepId: step.id,
          details: { gateConditionPassed: canExecute },
        });
        if (!canExecute) {
          context.tracer.record({
            type: "step_skipped",
            stepId: step.id,
            details: { reason: "Step condition evaluated to false" },
          });
          continue;
        }
      }

      context.tracer.record({
        type: "step_start",
        stepId: step.id,
        skillName: step.preferredSkill,
        details: { stepName: step.name },
      });

      try {
        const stepResult = await step.execute(context, currentInput);

        if (stepResult.spend) {
          context.tracer.recordSpend(stepResult.spend);
        }

        if (stepResult.evidence) {
          collectedEvidence.push(...stepResult.evidence);
        }

        if (stepResult.status === "failed" || stepResult.status === "blocked") {
          context.tracer.record({
            type: "step_failed",
            stepId: step.id,
            details: { error: stepResult.error, status: stepResult.status },
          });

          context.tracer.record({
            type: "composition_failed",
            compositionName: masterSkill.name,
            details: { failedStep: step.id, error: stepResult.error },
          });

          return {
            status: stepResult.status,
            compositionName: masterSkill.name,
            variantName: selectedVariantName,
            executedSteps,
            evidence: collectedEvidence,
            totalSpend: (context.tracer as any).getAggregateSpend?.() ?? {
              units: 0,
              wallClockSeconds: 0,
            },
            traces: context.tracer.getEvents(),
            error: `Step '${step.id}' ${stepResult.status}: ${stepResult.error ?? "unknown error"}`,
          };
        }

        executedSteps.push(step.id);
        currentInput = stepResult.data;
        finalData = stepResult.data as TOutput;

        context.tracer.record({
          type: "step_complete",
          stepId: step.id,
          details: { stepName: step.name },
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        context.tracer.record({
          type: "step_failed",
          stepId: step.id,
          details: { error: errorMessage },
        });
        context.tracer.record({
          type: "composition_failed",
          compositionName: masterSkill.name,
          details: { failedStep: step.id, error: errorMessage },
        });

        return {
          status: "failed",
          compositionName: masterSkill.name,
          variantName: selectedVariantName,
          executedSteps,
          evidence: collectedEvidence,
          totalSpend: (context.tracer as any).getAggregateSpend?.() ?? {
            units: 0,
            wallClockSeconds: 0,
          },
          traces: context.tracer.getEvents(),
          error: `Unhandled exception in step '${step.id}': ${errorMessage}`,
        };
      }
    }

    context.tracer.record({
      type: "composition_complete",
      compositionName: masterSkill.name,
      details: {
        stepsExecuted: executedSteps.length,
        evidenceCount: collectedEvidence.length,
      },
    });

    return {
      status: "completed",
      compositionName: masterSkill.name,
      variantName: selectedVariantName,
      data: finalData,
      executedSteps,
      evidence: collectedEvidence,
      totalSpend: (context.tracer as any).getAggregateSpend?.() ?? {
        units: 0,
        wallClockSeconds: 0,
      },
      traces: context.tracer.getEvents(),
    };
  }
}
