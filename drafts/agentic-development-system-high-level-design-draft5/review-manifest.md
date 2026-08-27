# High-level design review manifest — draft 5

This manifest identifies the frozen human-facing design packet for the presentation-only successor to draft 4. It is planning context only; it does not adopt target architecture, change current records, create task authority, or authorize implementation.

## Packet identity

| Field | Value |
| --- | --- |
| Revision | `draft5` |
| Predecessor | `draft4` — `4f174a90734ecbbab61b98adbd2cdbc9ba75595ba123697edd5248333afa48f9` |
| Authoring role | Sol-authored design content; subsequent role and skill normalization prepared from Sol and Terra creator-model advisory specifications at the user's request |
| Review state | Frozen for user presentation after creator-model role and skill normalization; this revision has not received a fresh bounded review |
| Digest algorithm | `sha256-path-digest-v1` |
| Manifest digest scope | All listed non-manifest files |
| Packet digest | `da2bce46fd914fbb81011b7bf478554f99c7ab4a18e7d58e99d4b5b14f640122` |

## Frozen file set

| Relative path | SHA-256 |
| --- | --- |
| `target-design.md` | `b9fb0449a5df8259401cdd8d1a3fbcf4239dcb1971528676d215b63050ce6ef7` |

## Digest construction

For this revision, `sha256-path-digest-v1` is the canonical multi-file construction: normalize each relative POSIX path; hash each file’s raw bytes; sort entries by normalized path UTF-8 bytes; begin the canonical byte stream with `as-is-packet-v1` followed by NUL; append for each entry its ASCII decimal path-byte length, colon, UTF-8 path bytes, NUL, lowercase hexadecimal file digest, and LF; hash the complete byte stream with SHA-256. The manifest is excluded from the digest scope.

## Review scope

A fresh bounded read-only review, if admitted, may assess this exact successor against the predecessor's fixed checklist and declared review scope. This revision incorporates creator-model repair specifications: the proposed master skill is renamed to `developing-target-designs`, normative target sections use purpose-based agent roles rather than Sol/Terra/Kimi/Luna names, and exercise-only model/profile assignments are isolated in a non-target mapping. It retains the human review gate for component-builder detail plans, combined-document guidance, workflow-benchmark context, and Mermaid views. These changes have not received a fresh bounded alternate-family review. The review must not edit this packet, approve it, create tasks, adopt contracts, or authorize implementation.

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
