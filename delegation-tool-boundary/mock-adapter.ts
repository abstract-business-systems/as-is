import type {
  AdapterControlResult,
  AdapterLaunchAcceptance,
  AdapterPreflight,
  DelegateAdapter,
  HostAdapterId,
  ResolvedAdapterLaunch,
  StableIdentity,
} from "./delegate-component.ts";

/**
 * Deterministic local-only adapter fixture.  It deliberately owns no process,
 * session, provider, or network resource.  Its delayed completion is a timer
 * observation used to prove that the tool returns at launch acceptance, while
 * cancellation and cleanup clear the private timer.
 */
export interface MockAdapterOptions {
  preflight?: AdapterPreflight;
  completionDelayMilliseconds?: number;
}

export class DeterministicMockAdapter implements DelegateAdapter {
  readonly id: HostAdapterId;
  readonly options: MockAdapterOptions;
  readonly launches: ResolvedAdapterLaunch[] = [];
  readonly cleaned: StableIdentity[] = [];
  readonly cancelled: StableIdentity[] = [];
  private readonly active = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly completed = new Set<string>();

  constructor(id: HostAdapterId = "shell", options: MockAdapterOptions = {}) {
    this.id = id;
    this.options = options;
  }

  async preflight(_input: ResolvedAdapterLaunch): Promise<AdapterPreflight> {
    return this.options.preflight ?? { state: "allowed" };
  }

  async launch(input: ResolvedAdapterLaunch): Promise<AdapterLaunchAcceptance> {
    this.launches.push(input);
    const key = identityKey(input.identity);
    const delay = this.options.completionDelayMilliseconds ?? 0;
    const timer = setTimeout(() => {
      this.active.delete(key);
      this.completed.add(key);
    }, delay);
    this.active.set(key, timer);
    return {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      runtimeHandle: `mock-runtime-${this.launches.length}`,
    };
  }

  async cancel(input: { identity: StableIdentity; jobId: string; runtimeHandle?: string }): Promise<AdapterControlResult> {
    const key = identityKey(input.identity);
    const timer = this.active.get(key);
    if (timer) clearTimeout(timer);
    this.active.delete(key);
    this.cancelled.push(input.identity);
    return { accepted: true };
  }

  async cleanup(input: { identity: StableIdentity; jobId: string; runtimeHandle?: string }): Promise<AdapterControlResult> {
    const key = identityKey(input.identity);
    const timer = this.active.get(key);
    if (timer) clearTimeout(timer);
    this.active.delete(key);
    this.cleaned.push(input.identity);
    return { accepted: true };
  }

  isCompleted(identity: StableIdentity): boolean {
    return this.completed.has(identityKey(identity));
  }

  get activeCount(): number {
    return this.active.size;
  }

  get leftoverProcessCount(): number {
    // The fixture never creates a process; this explicit observation prevents a
    // test from accidentally treating a timer as a process-backed launch.
    return 0;
  }
}

function identityKey(identity: StableIdentity): string {
  return `${identity.componentPath}/${identity.taskRevision}/${identity.attempt}`;
}
