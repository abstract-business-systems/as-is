# High-level design review manifest — draft 6

This manifest identifies the frozen human-facing design packet for the presentation-only successor to draft 4. It is planning context only; it does not adopt target architecture, change current records, create task authority, or authorize implementation.

## Packet identity

| Field | Value |
| --- | --- |
| Revision | `draft6` |
| Predecessor | `draft5` — `da2bce46fd914fbb81011b7bf478554f99c7ab4a18e7d58e99d4b5b14f640122` |
| Authoring role | Successor repair prepared by the caller from the bounded expert finding F-01; no substantive design change |
| Review state | Reviewed by a bounded read-only expert; no supported manifest-scoped repair remains; user alignment is still required |
| Digest algorithm | `sha256-path-digest-v1` |
| Manifest digest scope | All listed non-manifest files |
| Packet digest | `051f202ff7c27557c1e614ddd647ee97e5ed8ba34a4dd7fd856c3c24457cd926` |

## Frozen file set

| Relative path | SHA-256 |
| --- | --- |
| `target-design.md` | `0c4ccd0925a579823b846454fadee943bbdad1f8729a5203d8df3b89be9907d3` |

## Digest construction

For this revision, `sha256-path-digest-v1` is the canonical multi-file construction: normalize each relative POSIX path; hash each file’s raw bytes; sort entries by normalized path UTF-8 bytes; begin the canonical byte stream with `as-is-packet-v1` followed by NUL; append for each entry its ASCII decimal path-byte length, colon, UTF-8 path bytes, NUL, lowercase hexadecimal file digest, and LF; hash the complete byte stream with SHA-256. The manifest is excluded from the digest scope.

## Review scope

The bounded read-only expert review recorded at `reviews/agentic-development-system/expert-high-level-design-review-draft6.md` assessed this exact successor against the predecessor's fixed checklist and declared repair scope. It reported that F-01 is repaired and found no supported manifest-scoped repair remaining. Reviewer identity, alternate-family provenance, and formal admission remain caller-side concerns. This revision is a narrow successor to draft 5 that removes the duplicate model-routing sentence identified as finding F-01 in the bounded expert review. It otherwise preserves the reviewed packet content, including the role/skill normalization, human detail-plan gate, combined-document guidance, workflow-benchmark context, and Mermaid views. The review must not edit this packet, approve it, create tasks, adopt contracts, or authorize implementation.

## Fixed acceptance checklist

- The root design is understandable to a human before technical appendices.
- Current architecture, planned architecture, and migration relationships remain distinct.
- Proposed introductions, modifications, retentions, compositions, replacements, deprecations, and drops are explicit and evidence-seeking.
- Human authority, agent orchestration, reviewer authority, escalation, design completion, detail-chunk planning, kick-off, and implementation authorization are distinct.
- The first proof includes setup, a separately owned mock consumer, baseline/candidate separation, and deterministic comparison.
- Claims about installation, isolation, provider behavior, and future workloads are bounded by evidence.
- The design preserves recovery, validation, semantic review, integration, and feedback paths.
- Unresolved choices and provisional contract questions are visible.

## Revision rule

Any change to the packet requires a successor revision with a new manifest and packet digest. Reviews remain tied to the exact frozen revision they assessed.
