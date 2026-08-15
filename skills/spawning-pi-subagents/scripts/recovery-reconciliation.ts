const terminalTaskStatuses = new Set(["completed", "failed", "cancelled"]);

export type RecoveryCandidateObservation = {
  event: "recovery-candidate";
  source: "spawning-pi-subagents:jobs-observation";
  jobId: string;
  observedAt: string;
  reason: string;
  recordStatus: string | null;
  recordState: "non-terminal" | "unavailable";
  taskRecordPath: string | null;
  worktreePath: string | null;
  preserveReason: string | null;
  retryContext: {
    automaticRestart: false;
    retryAuthority: "parent-or-user";
    configuredBackoff: "not-applied";
  };
};

export function recoveryCandidateFor(
  launch: Record<string, unknown>,
  finished: Record<string, unknown> | null,
  recordStatus: string | null,
  runnerAlive: boolean,
): RecoveryCandidateObservation | null {
  if (finished || runnerAlive) return null;
  if (recordStatus && terminalTaskStatuses.has(recordStatus)) return null;
  const jobId = typeof launch.jobId === "string" ? launch.jobId : undefined;
  if (!jobId) return null;
  const recordState = recordStatus ? "non-terminal" : "unavailable";
  const reason = recordStatus
    ? "runner-not-alive-with-non-terminal-task-record"
    : "runner-not-alive-with-unavailable-task-record";
  return {
    event: "recovery-candidate",
    source: "spawning-pi-subagents:jobs-observation",
    jobId,
    observedAt: new Date().toISOString(),
    reason,
    recordStatus,
    recordState,
    taskRecordPath: typeof launch.recordPath === "string" ? launch.recordPath : null,
    worktreePath: typeof launch.worktreePath === "string" ? launch.worktreePath : null,
    preserveReason: typeof launch.preserveReason === "string" ? launch.preserveReason : null,
    retryContext: {
      automaticRestart: false,
      retryAuthority: "parent-or-user",
      configuredBackoff: "not-applied",
    },
  };
}
