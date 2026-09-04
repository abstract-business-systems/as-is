# Choosing Change Methods - as-is

## Purpose
Select appropriate change capabilities for bounded scopes and risks.

## Design

The skill classifies a requested transformation as new implementation, surgical edit, content drafting, test work, delegation, or maintenance, then selects the least powerful fitting method from the requirement, scope, and risk rather than habit. It is a selection sibling under the Skills catalog that feeds a master composition's choice between `writing-code` and `applying-bounded-edits`, but it implements, references, and depends on no other skill. The skill establishes fit only and grants no tools or authority; it verifies that the selected path's tools and permissions exist and stops with a bounded missing-capability blocker rather than silently substituting weaker tools.

**Lineage**: [as-is](../../as-is.md#design) / [Skills](../as-is.md#design) / **Choosing Change Methods**

## Links
- [SKILL.md](SKILL.md) — authoritative procedure and contract.
- [../as-is.md](../../as-is.md) — concise capability catalog entry.