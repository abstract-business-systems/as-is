# Rendered Mermaid Navigation

This repository-local contract defines the optional browser-backed check for rendered Mermaid output. It is a validation aid, not a Mermaid-design, task, or document-discovery authority. The generic skill keeps only the short host-neutral rule; this file owns the repository's browser-batch details.

## Input

The renderer accepts a bounded batch of diagram inputs:

```json
{
  "diagrams": [
    {
      "id": "fixture-map",
      "source": "flowchart TB\n  A[Start] --> B[Done]",
      "expectedHrefs": ["./child/as-is.md#design"]
    }
  ],
  "requireRenderer": false
}
```

`source` is Mermaid source, not a Markdown or `as-is.md` path. The caller owns document discovery, fence extraction, expected-target selection, and independent Markdown-fallback validation. Each batch has at most 64 diagrams and 500,000 source characters; one source has at most 100,000 characters.

## Browser configuration

The check uses a local browser and local Mermaid bundle only:

- `MERMAID_BUNDLE` — absolute or working-directory-relative browser bundle path;
- `MERMAID_BROWSER` — optional executable path or command; otherwise a local Chromium-compatible command is detected;
- `MERMAID_RENDERER_VERSION` — caller-supplied bundle/version identity retained in the result.

No renderer is installed, no provider is contacted, and browser background networking is disabled. Mermaid runs with `securityLevel: "loose"` so diagrams that intentionally use linked SVG nodes can be inspected; the check does not activate links or fetch their targets.

## Result and use

One browser process renders the whole batch. Each diagram reports `passed` when its expected href set matches the rendered SVG, `rendered` when it rendered without an href expectation, or `failed` when rendering or comparison fails. The batch reports `unsupported` when the local renderer configuration is absent. A caller may require configuration explicitly; otherwise unsupported is a capability result, not rendered-navigation evidence.

The Pi tool is `render_mermaid_batch` and is read-only. A direct library caller may use `renderMermaidBatch` with the same diagram-source contract. The focused dogfood test extracts one fixture document as its caller-owned setup, then sends two diagram sources in one browser batch.

## Evidence boundary

This check establishes rendered SVG parse/render success and, when requested, preservation of expected href strings. It does not prove layout quality, browser-independent behavior, Markdown fallback navigation, target-anchor existence outside the caller's checks, or behavior in every host renderer. Source-level Mermaid, link, and `Components`-table checks remain separate.
