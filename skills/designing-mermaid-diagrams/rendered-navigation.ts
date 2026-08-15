import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export type MermaidDiagramInput = {
  id: string;
  source: string;
  expectedHrefs?: string[];
};

export type MermaidRendererConfiguration = {
  bundle: string;
  browser: string;
  version: string;
};

type UnsupportedRenderer = { status: "unsupported"; reason: string };
export type MermaidDiagramResult = {
  id: string;
  status: "passed" | "rendered" | "failed";
  hrefs: string[];
  expectedHrefs?: string[];
  svgLength?: number;
  svgWidth?: string;
  svgHeight?: string;
  viewBox?: string;
  error?: string;
};
export type MermaidBatchResult = {
  status: "passed" | "rendered" | "failed" | "unsupported";
  renderer?: {
    bundle: string;
    version: string;
    browser: string;
    browserVersion?: string;
  };
  diagrams: MermaidDiagramResult[];
  durationMs: number;
  error?: string;
};

const browserCandidates = ["google-chrome", "chromium", "chromium-browser", "chrome"];
const maxDiagrams = 64;
const maxSourceCharacters = 100_000;
const maxBatchSourceCharacters = 500_000;
const maxHrefCharacters = 2_048;
const maxExpectedHrefs = 256;
const maxErrorCharacters = 4_000;
const maxIdCharacters = 128;
const browserTimeoutMs = 120_000;

const uniqueSorted = (values: string[]): string[] => [...new Set(values)].sort();

const findExecutable = (requested: string | undefined, cwd: string): string | null => {
  if (requested) {
    const candidate = requested.includes("/") ? resolve(cwd, requested) : requested;
    if (requested.includes("/") && existsSync(candidate)) return candidate;
    const result = Bun.spawnSync(["which", candidate], { cwd, stdout: "pipe", stderr: "ignore" });
    return result.exitCode === 0 ? new TextDecoder().decode(result.stdout).trim() || candidate : null;
  }
  for (const candidate of browserCandidates) {
    const result = Bun.spawnSync(["which", candidate], { cwd, stdout: "pipe", stderr: "ignore" });
    if (result.exitCode === 0) return new TextDecoder().decode(result.stdout).trim() || candidate;
  }
  return null;
};

export function rendererConfiguration(
  environment: NodeJS.ProcessEnv = process.env,
  cwd = process.cwd(),
): MermaidRendererConfiguration | UnsupportedRenderer {
  const bundleValue = environment.MERMAID_BUNDLE;
  if (!bundleValue) return { status: "unsupported", reason: "MERMAID_BUNDLE is not configured" };
  const bundle = resolve(cwd, bundleValue);
  if (!existsSync(bundle)) return { status: "unsupported", reason: `MERMAID_BUNDLE does not exist: ${bundle}` };
  const browser = findExecutable(environment.MERMAID_BROWSER, cwd);
  if (!browser) return { status: "unsupported", reason: "no local Chromium-compatible MERMAID_BROWSER was found" };
  const version = environment.MERMAID_RENDERER_VERSION;
  if (!version) return { status: "unsupported", reason: "MERMAID_RENDERER_VERSION is not configured" };
  return { bundle, browser, version };
}

const htmlAttribute = (value: string): string => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const scriptLiteral = (value: string): string => JSON.stringify(value).replace(/</g, "\\u003c");

function validateInputs(diagrams: MermaidDiagramInput[]): void {
  if (diagrams.length === 0 || diagrams.length > maxDiagrams) {
    throw new Error(`diagram batch must contain between 1 and ${maxDiagrams} diagrams`);
  }
  const ids = new Set<string>();
  let sourceCharacters = 0;
  for (const diagram of diagrams) {
    if (!diagram.id.trim()) throw new Error("diagram IDs must not be empty");
    if (diagram.id.length > maxIdCharacters) throw new Error(`diagram IDs must not exceed ${maxIdCharacters} characters: ${diagram.id}`);
    if (ids.has(diagram.id)) throw new Error(`diagram IDs must be unique: ${diagram.id}`);
    ids.add(diagram.id);
    if (!diagram.source.trim()) throw new Error(`diagram source must not be empty: ${diagram.id}`);
    if (diagram.source.length > maxSourceCharacters) throw new Error(`diagram source exceeds ${maxSourceCharacters} characters: ${diagram.id}`);
    sourceCharacters += diagram.source.length;
    if (sourceCharacters > maxBatchSourceCharacters) throw new Error(`diagram batch sources exceed ${maxBatchSourceCharacters} characters`);
    if (diagram.expectedHrefs && diagram.expectedHrefs.length > maxExpectedHrefs) {
      throw new Error(`expectedHrefs must contain at most ${maxExpectedHrefs} values: ${diagram.id}`);
    }
    if (diagram.expectedHrefs?.some((href) => !href.trim() || href.length > maxHrefCharacters)) {
      throw new Error(`expectedHrefs must contain non-empty values of at most ${maxHrefCharacters} characters: ${diagram.id}`);
    }
  }
}

const browserPage = (bundle: string, diagrams: MermaidDiagramInput[]): string => {
  const serializedDiagrams = scriptLiteral(JSON.stringify(diagrams));
  return `<!doctype html>
<html>
  <body>
    <script src="${htmlAttribute(pathToFileURL(bundle).href)}"></script>
    <script>
      const inputs = JSON.parse(${serializedDiagrams});
      const encodeResult = (value) => {
        const bytes = new TextEncoder().encode(value);
        let binary = "";
        for (const byte of bytes) binary += String.fromCharCode(byte);
        return btoa(binary);
      };
      const hrefs = (svg) => Array.from(
        svg.matchAll(/(?:xlink:)?href\\s*=\\s*["']([^"']+)["']/g),
        (match) => match[1],
      );
      const svgMetadata = (svg) => {
        const root = svg.match(/<svg\\b([^>]*)>/i)?.[1] ?? "";
        const attribute = (name) => root.match(new RegExp(name + '=\"([^\"]*)\"', "i"))?.[1];
        return { svgWidth: attribute("width"), svgHeight: attribute("height"), viewBox: attribute("viewBox") };
      };
      const same = (left, right) => JSON.stringify([...new Set(left)].sort()) === JSON.stringify([...new Set(right)].sort());
      (async () => {
        const results = [];
        try {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          for (const [index, input] of inputs.entries()) {
            try {
              const result = await mermaid.render("mermaid-batch-" + index, input.source);
              const actual = hrefs(result.svg);
              const expected = input.expectedHrefs ? [...new Set(input.expectedHrefs)].sort() : undefined;
              const matches = expected === undefined || same(actual, expected);
              results.push({
                id: input.id,
                status: matches ? (expected === undefined ? "rendered" : "passed") : "failed",
                hrefs: actual,
                expectedHrefs: expected,
                svgLength: result.svg.length,
                ...svgMetadata(result.svg),
                error: matches ? undefined : "rendered hrefs differ from expected hrefs",
              });
            } catch (error) {
              results.push({ id: input.id, status: "failed", hrefs: [], error: String(error).slice(0, ${maxErrorCharacters}) });
            }
          }
          const failed = results.some((result) => result.status === "failed");
          document.documentElement.dataset.mermaidBatch = encodeResult(JSON.stringify({ status: failed ? "failed" : "ok", results }));
        } catch (error) {
          document.documentElement.dataset.mermaidBatch = encodeResult(JSON.stringify({ status: "error", results, error: String(error).slice(0, ${maxErrorCharacters}) }));
        }
      })();
    </script>
  </body>
</html>
`;
};

const decodeBase64Json = <T>(encoded: string): T => {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
};

async function runBrowser(
  configuration: MermaidRendererConfiguration,
  pagePath: string,
  signal?: AbortSignal,
): Promise<string> {
  const browser = Bun.spawn([
    configuration.browser,
    "--headless",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-extensions",
    "--disable-sync",
    "--no-default-browser-check",
    "--no-first-run",
    `--user-data-dir=${join(dirname(pagePath), "browser-profile")}`,
    "--allow-file-access-from-files",
    "--virtual-time-budget=60000",
    "--dump-dom",
    pathToFileURL(pagePath).href,
  ], { stdin: "ignore", stdout: "pipe", stderr: "pipe" });
  let aborted = false;
  const abort = () => {
    aborted = true;
    browser.kill();
  };
  const timer = setTimeout(() => browser.kill(), browserTimeoutMs);
  signal?.addEventListener("abort", abort, { once: true });
  try {
    const [stdout, stderr] = await Promise.all([
      new Response(browser.stdout).text(),
      new Response(browser.stderr).text(),
    ]);
    const exitCode = await browser.exited;
    if (aborted) throw new Error("Mermaid browser rendering was cancelled");
    if (exitCode !== 0) throw new Error(`Mermaid browser exited with status ${exitCode}: ${stderr.trim()}`);
    return stdout;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

async function browserVersion(browser: string): Promise<string | undefined> {
  const process = Bun.spawn([browser, "--version"], { stdin: "ignore", stdout: "pipe", stderr: "pipe" });
  const stdout = await new Response(process.stdout).text();
  await process.exited;
  return stdout.trim() || undefined;
}

export async function renderMermaidBatch(
  diagrams: MermaidDiagramInput[],
  configuration: MermaidRendererConfiguration | UnsupportedRenderer,
  signal?: AbortSignal,
): Promise<MermaidBatchResult> {
  validateInputs(diagrams);
  const started = performance.now();
  if ("status" in configuration) {
    return { status: "unsupported", diagrams: [], durationMs: performance.now() - started, error: configuration.reason };
  }

  const directory = mkdtempSync(join(tmpdir(), "as-is-mermaid-navigation-"));
  const pagePath = join(directory, "render.html");
  writeFileSync(pagePath, browserPage(configuration.bundle, diagrams));
  try {
    const output = await runBrowser(configuration, pagePath, signal);
    const encoded = output.match(/data-mermaid-batch="([A-Za-z0-9+/=]+)"/)?.[1];
    if (!encoded) throw new Error("Mermaid browser output did not contain a batch result");
    const payload = decodeBase64Json<{ status: "ok" | "failed" | "error"; results: MermaidDiagramResult[]; error?: string }>(encoded);
    if (payload.status === "error") throw new Error(payload.error ?? "unknown Mermaid batch rendering failure");
    const results = payload.results.map((result) => ({
      ...result,
      hrefs: uniqueSorted(result.hrefs),
      expectedHrefs: result.expectedHrefs ? uniqueSorted(result.expectedHrefs) : undefined,
    }));
    const failed = results.some((result) => result.status === "failed");
    const hasExpectedHrefChecks = results.some((result) => result.expectedHrefs !== undefined);
    return {
      status: failed ? "failed" : hasExpectedHrefChecks ? "passed" : "rendered",
      renderer: { ...configuration, browserVersion: await browserVersion(configuration.browser) },
      diagrams: results,
      durationMs: performance.now() - started,
    };
  } catch (error) {
    return {
      status: "failed",
      renderer: { ...configuration },
      diagrams: [],
      durationMs: performance.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
