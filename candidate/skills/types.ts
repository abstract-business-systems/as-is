import type { AgentContract, RoleId } from "../agents/types";

export type SkillClass = "reusable" | "master";

export type ToolName = "read" | "grep" | "find" | "ls" | "bash" | "edit" | "write";

export interface SkillSpend {
  units: number;
  wallClockSeconds: number;
}

export interface TraceEvent {
  readonly timestamp: number;
  readonly type:
    | "composition_start"
    | "composition_complete"
    | "composition_failed"
    | "step_start"
    | "step_complete"
    | "step_failed"
    | "step_skipped"
    | "gate_evaluated"
    | "tool_invoked"
    | "protected_input_access"
    | "scope_violation"
    | "spend_recorded";
  readonly compositionName?: string;
  readonly stepId?: string;
  readonly skillName?: string;
  readonly role?: RoleId;
  readonly details: Record<string, unknown>;
}

export interface SkillExecutionContext {
  readonly taskRevision: string;
  readonly componentKey: string;
  readonly scopeAllowlist: readonly string[];
  readonly protectedInputs: readonly string[];
  readonly assignedAgent: AgentContract;
  readonly state: Map<string, unknown>;
  readonly logger?: (msg: string) => void;
  readonly tracer: IExecutionTracer;
  budgetRemaining: SkillSpend;
}

export interface IExecutionTracer {
  record(event: Omit<TraceEvent, "timestamp">): void;
  getEvents(): readonly TraceEvent[];
  assertPathPermitted(path: string, isMutation: boolean): void;
  recordSpend(spend: Partial<SkillSpend>): void;
}

export interface CapabilityValidationResult {
  readonly eligible: boolean;
  readonly missingTools: readonly string[];
  readonly reason?: string;
}

export interface StepResult<T = unknown> {
  readonly status: "completed" | "failed" | "blocked" | "skipped";
  readonly data?: T;
  readonly evidence?: readonly string[];
  readonly spend?: Partial<SkillSpend>;
  readonly error?: string;
}

export interface ReusableSkill<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  readonly description: string;
  readonly skillClass: "reusable";
  readonly requiredTools: readonly ToolName[];
  execute(context: SkillExecutionContext, input: TInput): Promise<StepResult<TOutput>>;
}

export interface CompositionStep<TInput = unknown, TOutput = unknown> {
  readonly id: string;
  readonly name: string;
  readonly preferredSkill: string;
  readonly requiredTools: readonly ToolName[];
  readonly condition?: (context: SkillExecutionContext) => boolean | Promise<boolean>;
  execute(context: SkillExecutionContext, stepInput?: TInput): Promise<StepResult<TOutput>>;
}

export interface CompositionVariant {
  readonly name: string;
  readonly description: string;
  readonly preferredSkills: readonly string[];
  readonly requiredTools: readonly ToolName[];
  readonly steps: readonly CompositionStep[];
  readonly recoveryPolicy?: "abort" | "retry" | "revert";
}

export interface MasterSkill<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  readonly description: string;
  readonly skillClass: "master";
  readonly variants: Readonly<Record<string, CompositionVariant>>;
  readonly defaultVariant: string;
  execute(
    context: SkillExecutionContext,
    variantName?: string,
    input?: TInput
  ): Promise<CompositionExecutionResult<TOutput>>;
}

export interface CompositionExecutionResult<T = unknown> {
  readonly status: "completed" | "failed" | "blocked";
  readonly compositionName: string;
  readonly variantName: string;
  readonly data?: T;
  readonly executedSteps: readonly string[];
  readonly evidence: readonly string[];
  readonly totalSpend: SkillSpend;
  readonly traces: readonly TraceEvent[];
  readonly error?: string;
}
