/**
 * Execution-Control Kernel Types & Contracts
 * Candidate realization for the Agentic Development System.
 */

export interface AcceptedEnvelopeIdentity {
  readonly targetPacketDigest: string;
  readonly targetDesignSha256: string;
}

export interface ParentPlanContext {
  readonly componentKey: string;
  readonly anchorPath: string;
  readonly taskRevision: string;
  readonly boundedOutcome: string;
}

export interface WorkerCapabilitySpec {
  readonly role: string;
  readonly model: string;
  readonly capabilities: readonly string[];
}

export interface TaskBudgetSpec {
  readonly allocatedUnits: number;
  readonly maxWallClockSeconds: number;
  readonly reserveUnits: number;
}

export interface IntegrationDeclaration {
  readonly strategy: "direct-apply" | "worktree-merge" | "patch-apply";
  readonly expectedParentBase: string;
}

export interface ChildPlanEntry {
  readonly id: string;
  readonly childAnchor: string;
  readonly componentKey: string;
  readonly boundedOutcome: string;
  readonly scopeAllowlist: readonly string[];
  readonly dependencies: readonly string[];
  readonly protectedInputs: readonly string[];
  readonly worker: WorkerCapabilitySpec;
  readonly budget: TaskBudgetSpec;
  readonly acceptance: readonly string[];
  readonly validation: readonly string[];
  readonly recovery: readonly string[];
  readonly escalation: readonly string[];
  readonly integrationDeclaration: IntegrationDeclaration;
}

export interface DependencyEdge {
  readonly from: string; // predecessor child id
  readonly to: string;   // successor child id
}

export type IndependenceType = "independent" | "dependent" | "conflicting";

export interface DependencyGraph {
  readonly nodes: readonly string[];
  readonly edges: readonly DependencyEdge[];
  readonly independenceClassification: Record<string, IndependenceType>;
}

export interface PlanFreshness {
  readonly parentRecordRevision: string;
  readonly childRecordRevisions: Record<string, string>;
  readonly expectedParentBase: string;
}

export interface NonGoalEntry {
  readonly id: string;
  readonly description: string;
  readonly disposition: "omitted" | "deferred" | "excluded";
}

export interface PlanEnvelope {
  readonly planRevision: string;
  readonly acceptedEnvelope: AcceptedEnvelopeIdentity;
  readonly parent: ParentPlanContext;
  readonly children: readonly ChildPlanEntry[];
  readonly dependencyGraph: DependencyGraph;
  readonly freshness: PlanFreshness;
  readonly nonGoals: readonly NonGoalEntry[];
  readonly planDigest: string;
}

export type AdmissionResultStatus = "admitted" | "rejected" | "unavailable";

export type ReservationDisposition =
  | "active"
  | "released"
  | "reclaimed"
  | "orphan"
  | "rolled_back";

export interface ComponentReservation {
  readonly reservationId: string;
  readonly componentKey: string;
  readonly ownerTaskId: string;
  readonly planRevision: string;
  readonly attempt: number;
  readonly acquiredAt: number;
  readonly leaseExpiresAt: number;
  readonly leaseGeneration: number;
  readonly fencingToken: string;
  disposition: ReservationDisposition;
  reclaimReason?: string;
  releasedAt?: number;
}

export interface ProtectedInputResult {
  readonly valid: boolean;
  readonly checkedPaths: readonly string[];
  readonly violations: readonly string[];
}

export interface WorkerCapabilityResult {
  readonly valid: boolean;
  readonly checkedRoles: readonly string[];
  readonly violations: readonly string[];
}

export interface BudgetReservationResult {
  readonly valid: boolean;
  readonly parentAllocation: number;
  readonly totalChildAllocated: number;
  readonly totalChildReserve: number;
  readonly remainingParentReserve: number;
}

export interface FreshnessObservation {
  readonly parentBaseMatch: boolean;
  readonly recordRevisionsMatch: boolean;
  readonly staleReasons: readonly string[];
}

export interface AdmissionResult {
  readonly status: AdmissionResultStatus;
  readonly planRevision: string;
  readonly checkedComponentKeys: readonly string[];
  readonly dependencyClassification: Record<string, IndependenceType>;
  readonly protectedInputResult: ProtectedInputResult;
  readonly workerCapabilityResult: WorkerCapabilityResult;
  readonly budgetReservation: BudgetReservationResult;
  readonly reservations: readonly ComponentReservation[];
  readonly freshnessObservations: FreshnessObservation;
  readonly violations: readonly string[];
  readonly missingFacts: readonly string[];
  readonly safeNextAction: string;
}

export type TaskStatus =
  | "ready"
  | "active"
  | "blocked"
  | "awaiting-approval"
  | "completed"
  | "failed"
  | "cancelled";

export interface ChildValidationEvidence {
  readonly passed: boolean;
  readonly testsPassed: number;
  readonly coveragePercent?: number;
  readonly details: readonly string[];
}

export interface ChildIntegrationEvidence {
  readonly appliedBase: string;
  readonly mergedCommit?: string;
  readonly cleanScope: boolean;
  readonly protectedInputsUnmodified: boolean;
  readonly verified: boolean;
  readonly details: readonly string[];
}

export interface ChildSpendRecord {
  readonly unitsUsed: number;
  readonly wallClockSeconds: number;
}

export interface ChildTerminalResult {
  readonly childId: string;
  readonly componentKey: string;
  readonly taskStatus: TaskStatus;
  readonly validationEvidence: ChildValidationEvidence;
  readonly integrationEvidence?: ChildIntegrationEvidence;
  readonly recordedSpend: ChildSpendRecord;
}

export type ParentClosureStatus =
  | "eligible"
  | "ineligible"
  | "completed"
  | "failed"
  | "cancelled";

export interface ChildClosureDisposition {
  readonly status: TaskStatus;
  readonly eligible: boolean;
  readonly reasons: readonly string[];
}

export interface ParentClosureOutcome {
  readonly status: ParentClosureStatus;
  readonly isTerminal: boolean;
  readonly canCommit: boolean;
  readonly summary: string;
  readonly childDispositions: Record<string, ChildClosureDisposition>;
  readonly missingEvidence: readonly string[];
  readonly unaccountedChildren: readonly string[];
  readonly rolledBackSiblings?: readonly string[];
  readonly residualRisk?: readonly string[];
  readonly totalSpend: ChildSpendRecord;
  readonly admittedPlanRevision?: string;
}
