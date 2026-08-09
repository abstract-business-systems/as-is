# as-is Data Resolution

## Purpose

Provide preparation-time resolution for distributed `as-is.json` data, including
root configuration and local transient task metadata, without replacing
human-facing Markdown context.

## Design

The resolver accepts a repository root and logical target component directory,
then reads `as-is.json` files on the root-to-target directory chain. It produces
an in-memory effective view. The `configuration` object cascades; `task` and
other data remain local unless explicitly classified by a later policy. Source
files are never rewritten and inherited values are never copied into them.

`parseAsIsJson` and `readAsIsJson` provide the shared strict companion parser
for central consumers. A present `configuration` or `task` value must be an
object. `task` is local transient machine metadata; it is never an inherited
configuration view.

Malformed applicable JSON, unsafe target paths, and invalid configuration
objects are reported through diagnostics and make the result incomplete.

## Links

- [`resolver.ts`](resolver.ts) — bounded preparation-time resolver.
- [`resolver.test.ts`](resolver.test.ts) — deterministic resolution tests.
- [`../as-is-setup/as-is.md`](../as-is-setup/as-is.md) — related setup component.

## Changelog

- Initial resolver component added for distributed `as-is.json` data.
