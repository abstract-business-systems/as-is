# as-is Data Resolution

## Purpose

Provide preparation-time resolution for distributed `as-is.json` data without
replacing the existing YAML configuration authority in the root `as-is.md`.

## Design

The resolver accepts a repository root and logical target component directory,
then reads `as-is.json` files on the root-to-target directory chain. It produces
an in-memory effective view. The `configuration` object cascades; other data
remains local unless explicitly classified by a later policy. Source files are
never rewritten and inherited values are never copied into them.

Malformed applicable JSON, unsafe target paths, and invalid configuration
objects are reported through diagnostics and make the result incomplete.

## Links

- [`resolver.ts`](resolver.ts) — bounded preparation-time resolver.
- [`resolver.test.ts`](resolver.test.ts) — deterministic resolution tests.
- [`../as-is-setup/as-is.md`](../as-is-setup/as-is.md) — related setup component.

## Changelog

- Initial resolver component added for distributed `as-is.json` data.
