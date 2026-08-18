import { createHash } from "node:crypto";

const maximumSessionNameLength = 80;
const fallbackSessionName = "task-unnamed";

export type SessionNameResult = {
  name: string;
  accepted: boolean;
};

function rejected(value: string): boolean {
  return value.length === 0 || value.length > maximumSessionNameLength ||
    /[\\/\u0000-\u001f\u007f]/u.test(value) ||
    /(?:^|\s)(?:\.\.?)(?:\s|$)/u.test(value) ||
    /^[a-z][a-z0-9+.-]*:/iu.test(value) ||
    /(?:^|\s)(?:prompt|system|assistant|user)\s*:/iu.test(value) ||
    /(?:api[_ -]?key|token|secret|password|bearer|sk-[a-z0-9_-]{8,})/iu.test(value) ||
    /[{}[\]<>`"'|;]/u.test(value);
}

export function sessionNameFromTaskName(taskName: string | undefined): SessionNameResult {
  if (typeof taskName !== "string") {
    return { name: fallbackSessionName, accepted: false };
  }
  const trimmed = taskName.trim();
  if (rejected(trimmed)) {
    return { name: trimmed ? opaqueSessionNameFallback(trimmed) : fallbackSessionName, accepted: false };
  }
  const normalized = trimmed.toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, maximumSessionNameLength)
    .replace(/-+$/u, "");
  if (!normalized) return { name: fallbackSessionName, accepted: false };
  return { name: normalized, accepted: true };
}

export function opaqueSessionNameFallback(seed: string): string {
  return `${fallbackSessionName}-${createHash("sha256").update(seed).digest("hex").slice(0, 12)}`;
}

export const defaultSessionName = fallbackSessionName;
