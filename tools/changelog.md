# tools - changelog

## 2026-09-24 - Tool records conform to rendered-navigation contract; walker excludes temp; renderer bootstraps its dependency

- `tools/agent`, `tools/context`, and `tools/evidence` records: removed source-file hrefs from their diagrams (each file link already lives in the record's Links section). The rendered-navigation contract compares rendered hrefs against record hrefs, and these were the only three diagrams whose rendered hrefs differed.
- `validate-as-is-diagrams-and-navigation.rendered.test.ts` walker now excludes `temp/`, so transient artifacts and stale nested snapshots no longer enter the repository-wide record walk.
- `tools/mermaid-renderer`: mermaid is declared as a dev dependency (`package.json` + `bun.lock`, `node_modules` gitignored); on first run without configuration the renderer resolves mermaid through bun and bootstraps one local `bun install` when it is missing, discovers a Chromium-compatible browser on PATH, and derives the version from the resolved package. `MERMAID_BUNDLE` and `MERMAID_RENDERER_VERSION` remain explicit overrides; a failed bootstrap reports an explicit unsupported reason. The long-standing unverified-render gap is closed by default on bun hosts.
- Validation: 14 tests across renderer and validators, 0 fail, env-free run; first-run bootstrap proven with local `node_modules` and the global bun cache hidden (fresh-clone simulation).
