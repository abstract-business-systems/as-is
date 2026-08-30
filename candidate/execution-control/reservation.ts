/**
 * Atomic Component Reservation Manager
 * Candidate realization for the Agentic Development System.
 */

import type {
  ComponentReservation,
  ReservationDisposition,
} from "./types";

export interface Clock {
  now(): number;
}

export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
}

export interface ReservationRequest {
  readonly componentKeys: readonly string[];
  readonly ownerTaskId: string;
  readonly planRevision: string;
  readonly attempt: number;
  readonly leaseDurationMs: number;
}

export interface ReservationAcquisitionResult {
  readonly success: boolean;
  readonly acquiredReservations: readonly ComponentReservation[];
  readonly failedKey?: string;
  readonly contentionReason?: string;
  readonly rolledBackKeys: readonly string[];
}

export interface StaleReclaimRequest {
  readonly componentKey: string;
  readonly reason: string;
  readonly isOwnerDead: boolean;
}

export interface ReclaimResult {
  readonly reclaimed: boolean;
  readonly previousReservation?: ComponentReservation;
  readonly newReservation?: ComponentReservation;
  readonly reason: string;
}

export class ComponentReservationManager {
  private readonly store = new Map<string, ComponentReservation>();
  private readonly clock: Clock;
  private currentGeneration: number = 0;

  constructor(clock: Clock = new SystemClock()) {
    this.clock = clock;
  }

  /**
   * Generates a monotonic lease generation counter.
   */
  private nextGeneration(): number {
    return ++this.currentGeneration;
  }

  /**
   * Generates a unique fencing token for write-time verification.
   */
  private generateFencingToken(componentKey: string, generation: number): string {
    return `fence_${componentKey}_gen${generation}_${this.clock.now()}`;
  }

  /**
   * Generates a deterministic reservation ID.
   */
  private generateId(componentKey: string, ownerTaskId: string, attempt: number): string {
    return `res_${componentKey}_${ownerTaskId}_att${attempt}_${this.clock.now()}`;
  }

  /**
   * Sorts component keys in canonical lexicographical order to prevent ABBA deadlocks.
   */
  private sortKeys(keys: readonly string[]): string[] {
    return Array.from(new Set(keys)).sort();
  }

  /**
   * Inspects current reservation for a component key.
   */
  public getReservation(componentKey: string): ComponentReservation | undefined {
    return this.store.get(componentKey);
  }

  /**
   * Checks whether a component key is actively locked under a valid lease.
   */
  public isLocked(componentKey: string): boolean {
    const res = this.store.get(componentKey);
    return !!(res && res.disposition === "active" && res.leaseExpiresAt > this.clock.now());
  }

  /**
   * Verifies that the provided fencing token matches the active, valid lease for a component key.
   */
  public verifyFencingToken(componentKey: string, fencingToken: string): boolean {
    const res = this.store.get(componentKey);
    if (!res) return false;
    if (res.disposition !== "active") return false;
    if (res.leaseExpiresAt <= this.clock.now()) return false;
    return res.fencingToken === fencingToken;
  }

  /**
   * Lists all active reservations.
   */
  public listActiveReservations(): ComponentReservation[] {
    const now = this.clock.now();
    const active: ComponentReservation[] = [];
    for (const res of this.store.values()) {
      if (res.disposition === "active" && res.leaseExpiresAt > now) {
        active.push({ ...res });
      }
    }
    return active;
  }

  /**
   * Atomically acquires reservations for multiple component keys.
   * If any component key cannot be acquired:
   * - Only the keys newly acquired during THIS batch invocation are rolled back.
   * - Any pre-existing leases previously owned by the caller remain intact.
   */
  public acquire(request: ReservationRequest): ReservationAcquisitionResult {
    const sortedKeys = this.sortKeys(request.componentKeys);
    const now = this.clock.now();
    const leaseExpiresAt = now + request.leaseDurationMs;

    const allResultReservations: ComponentReservation[] = [];
    const keysNewlyAcquiredInBatch: string[] = [];

    for (const key of sortedKeys) {
      const existing = this.store.get(key);

      // Check if existing reservation is active and valid
      if (existing && existing.disposition === "active") {
        if (existing.leaseExpiresAt > now) {
          // Check re-entrancy: same ownerTaskId, planRevision, attempt
          if (
            existing.ownerTaskId === request.ownerTaskId &&
            existing.planRevision === request.planRevision &&
            existing.attempt === request.attempt
          ) {
            // Already owned by the same attempt; reuse without adding to rollback batch
            allResultReservations.push(existing);
            continue;
          }

          // Contention detected! Roll back ONLY keys newly acquired in this invocation
          for (const acquiredKey of keysNewlyAcquiredInBatch) {
            const newlyAcquiredRes = this.store.get(acquiredKey);
            if (newlyAcquiredRes) {
              newlyAcquiredRes.disposition = "rolled_back";
              newlyAcquiredRes.reclaimReason = `contention on key '${key}' during multi-key atomic acquisition`;
            }
            this.store.delete(acquiredKey);
          }

          return {
            success: false,
            acquiredReservations: [],
            failedKey: key,
            contentionReason: `Component '${key}' is actively locked by task '${existing.ownerTaskId}' until timestamp ${existing.leaseExpiresAt}`,
            rolledBackKeys: keysNewlyAcquiredInBatch,
          };
        } else {
          // Expired lease found; mark as orphan/expired so it can be reclaimed
          existing.disposition = "orphan";
          existing.reclaimReason = "lease expired during acquisition check";
          this.store.delete(key);
        }
      }

      // Allocate new reservation with monotonic generation and fencing token
      const generation = this.nextGeneration();
      const fencingToken = this.generateFencingToken(key, generation);

      const res: ComponentReservation = {
        reservationId: this.generateId(key, request.ownerTaskId, request.attempt),
        componentKey: key,
        ownerTaskId: request.ownerTaskId,
        planRevision: request.planRevision,
        attempt: request.attempt,
        acquiredAt: now,
        leaseExpiresAt,
        leaseGeneration: generation,
        fencingToken,
        disposition: "active",
      };

      this.store.set(key, res);
      keysNewlyAcquiredInBatch.push(key);
      allResultReservations.push(res);
    }

    return {
      success: true,
      acquiredReservations: allResultReservations,
      rolledBackKeys: [],
    };
  }

  /**
   * Releases reservations for the specified component keys owned by the task.
   */
  public release(
    componentKeys: readonly string[],
    ownerTaskId: string
  ): { releasedKeys: string[]; ignoredKeys: string[] } {
    const now = this.clock.now();
    const releasedKeys: string[] = [];
    const ignoredKeys: string[] = [];

    for (const key of componentKeys) {
      const existing = this.store.get(key);
      if (existing && existing.ownerTaskId === ownerTaskId && existing.disposition === "active") {
        existing.disposition = "released";
        existing.releasedAt = now;
        this.store.delete(key);
        releasedKeys.push(key);
      } else {
        ignoredKeys.push(key);
      }
    }

    return { releasedKeys, ignoredKeys };
  }

  /**
   * Reclaims a stale or expired reservation with full audit logging.
   * Fail-closed: if the owner is still live or ambiguous, reclamation is refused.
   */
  public reclaimStale(request: StaleReclaimRequest): ReclaimResult {
    const existing = this.store.get(request.componentKey);
    const now = this.clock.now();

    if (!existing) {
      return {
        reclaimed: false,
        reason: `No reservation exists for component '${request.componentKey}'`,
      };
    }

    const isExpired = existing.leaseExpiresAt <= now;
    if (!isExpired && !request.isOwnerDead) {
      return {
        reclaimed: false,
        previousReservation: existing,
        reason: `Cannot reclaim component '${request.componentKey}': lease is active and owner is not verified dead`,
      };
    }

    if (!request.isOwnerDead && !isExpired) {
      return {
        reclaimed: false,
        previousReservation: existing,
        reason: `Ambiguous owner for component '${request.componentKey}': owner verification failed and lease not expired`,
      };
    }

    const prevCopy = { ...existing };
    existing.disposition = "reclaimed";
    existing.reclaimReason = request.reason;
    existing.releasedAt = now;
    this.store.delete(request.componentKey);

    return {
      reclaimed: true,
      previousReservation: prevCopy,
      reason: `Successfully reclaimed component '${request.componentKey}': ${request.reason}`,
    };
  }

  /**
   * Sweeps and marks expired reservations as orphan candidates.
   */
  public sweepOrphans(): ComponentReservation[] {
    const now = this.clock.now();
    const orphaned: ComponentReservation[] = [];

    for (const [key, res] of this.store.entries()) {
      if (res.disposition === "active" && res.leaseExpiresAt <= now) {
        res.disposition = "orphan";
        res.reclaimReason = `lease expired at ${res.leaseExpiresAt} (swept at ${now})`;
        orphaned.push({ ...res });
        this.store.delete(key);
      }
    }

    return orphaned;
  }
}
