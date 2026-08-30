import type {
  IExecutionTracer,
  SkillExecutionContext,
  SkillSpend,
  TraceEvent,
} from "./types";

export class SecurityViolationError extends Error {
  constructor(message: string, public readonly path: string) {
    super(message);
    this.name = "SecurityViolationError";
  }
}

export class ScopeViolationError extends Error {
  constructor(message: string, public readonly path: string) {
    super(message);
    this.name = "ScopeViolationError";
  }
}

function normalizePath(p: string): string {
  return p.replace(/^\.\//, "").replace(/\/+$/, "");
}

function pathMatchesOrContains(prefix: string, target: string): boolean {
  const normPrefix = normalizePath(prefix);
  const normTarget = normalizePath(target);
  return normTarget === normPrefix || normTarget.startsWith(normPrefix + "/");
}

export class ExecutionTracer implements IExecutionTracer {
  private readonly events: TraceEvent[] = [];
  private totalSpend: SkillSpend = { units: 0, wallClockSeconds: 0 };

  constructor(
    private readonly scopeAllowlist: readonly string[],
    private readonly protectedInputs: readonly string[],
    private readonly onEvent?: (event: TraceEvent) => void
  ) {}

  record(event: Omit<TraceEvent, "timestamp">): void {
    const fullEvent: TraceEvent = {
      timestamp: Date.now(),
      ...event,
    };
    this.events.push(fullEvent);
    this.onEvent?.(fullEvent);
  }

  getEvents(): readonly TraceEvent[] {
    return [...this.events];
  }

  getAggregateSpend(): SkillSpend {
    return { ...this.totalSpend };
  }

  recordSpend(spend: Partial<SkillSpend>): void {
    if (spend.units) {
      this.totalSpend.units += spend.units;
    }
    if (spend.wallClockSeconds) {
      this.totalSpend.wallClockSeconds += spend.wallClockSeconds;
    }
    this.record({
      type: "spend_recorded",
      details: {
        incrementalSpend: spend,
        cumulativeSpend: this.totalSpend,
      },
    });
  }

  assertPathPermitted(path: string, isMutation: boolean): void {
    const norm = normalizePath(path);

    // If mutation is attempted on a protected input -> Security violation
    if (isMutation) {
      for (const protectedPath of this.protectedInputs) {
        if (pathMatchesOrContains(protectedPath, norm)) {
          this.record({
            type: "protected_input_access",
            details: {
              attemptedPath: norm,
              matchedProtectedRule: protectedPath,
              isMutation,
            },
          });
          throw new SecurityViolationError(
            `Mutation forbidden on protected input: '${norm}' (protected by '${protectedPath}')`,
            norm
          );
        }
      }

      // If mutation is outside the scope allowlist -> Scope violation
      if (this.scopeAllowlist.length > 0) {
        const inScope = this.scopeAllowlist.some((allowed) =>
          pathMatchesOrContains(allowed, norm)
        );
        if (!inScope) {
          this.record({
            type: "scope_violation",
            details: {
              attemptedPath: norm,
              allowedScope: this.scopeAllowlist,
              isMutation,
            },
          });
          throw new ScopeViolationError(
            `Mutation forbidden outside scope allowlist: '${norm}'`,
            norm
          );
        }
      }
    }
  }
}
