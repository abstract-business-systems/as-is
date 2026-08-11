export const THINKING_LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"] as const;

export type ThinkingLevel = typeof THINKING_LEVELS[number];

const thinkingLevelSet = new Set<string>(THINKING_LEVELS);

const normalizeScalar = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed.at(-1);
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
};

export function parseThinkingLevel(value: unknown, source: string): ThinkingLevel | undefined {
  if (value === undefined) return undefined;
  const normalized = typeof value === "string" ? normalizeScalar(value) : value;
  if (typeof normalized !== "string" || !thinkingLevelSet.has(normalized)) {
    throw new Error(`${source} must be one of: ${THINKING_LEVELS.join(", ")}; got ${String(value)}`);
  }
  return normalized as ThinkingLevel;
}

export function resolveThinkingLevel(
  values: { cli?: unknown; agent?: unknown; projectDefault?: unknown },
  source = "thinking",
): ThinkingLevel | undefined {
  // Validate every configured value before applying precedence. A malformed
  // lower-precedence setting must not be hidden by an override.
  const cli = parseThinkingLevel(values.cli, `${source} CLI override`);
  const agent = parseThinkingLevel(values.agent, `${source} agent declaration`);
  const projectDefault = parseThinkingLevel(values.projectDefault, `${source} project default`);
  return cli ?? agent ?? projectDefault;
}

export function extractAgentThinking(raw: string, source: string): string | undefined {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/u);
  if (!match) throw new Error(`Agent file has no front matter: ${source}`);
  let value: string | undefined;
  for (const line of match[1].split(/\r?\n/u)) {
    const field = line.match(/^thinking:\s*(.*)$/u);
    if (field) value = normalizeScalar(field[1]);
  }
  return value;
}
