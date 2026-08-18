const validLocalSessionId = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/u;

export type LocalSessionIdObservation = "absent" | "invalid" | string;

/** Read only the bounded JSON session header emitted by Pi's JSON mode. */
export function localSessionIdObservation(output: string): LocalSessionIdObservation {
  for (const line of output.split("\n").slice(0, 4)) {
    if (line.length > 4096) continue;
    try {
      const event = JSON.parse(line) as Record<string, unknown>;
      if (event.type !== "session") continue;
      if (typeof event.id !== "string" || !validLocalSessionId.test(event.id)) return "invalid";
      return event.id;
    } catch {
      // JSON mode may emit a bounded diagnostic before the session header.
    }
  }
  return "absent";
}

export function localSessionIdFromJsonOutput(output: string): string | null {
  const observation = localSessionIdObservation(output);
  return observation === "absent" || observation === "invalid" ? null : observation;
}
