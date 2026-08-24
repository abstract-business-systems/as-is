# High-level design review manifest — draft 5

This manifest identifies the frozen human-facing design packet for the presentation-only successor to draft 4. It is planning context only; it does not adopt target architecture, change current records, create task authority, or authorize implementation.

## Packet identity

| Field | Value |
| --- | --- |
| Revision | `draft5` |
| Predecessor | `draft4` — `4f174a90734ecbbab61b98adbd2cdbc9ba75595ba123697edd5248333afa48f9` |
| Authoring role | Sol-authored design content preserved; presentation-only successor prepared at the user's request |
| Review state | Frozen for user presentation; this successor has not received a fresh bounded review |
| Digest algorithm | `sha256-path-digest-v1` |
| Manifest digest scope | All listed non-manifest files |
| Packet digest | `b5b70c77beef41b72c4ac9bbf7df6471bb49423e4d3eae987b675d67318f07fc` |

## Frozen file set

| Relative path | SHA-256 |
| --- | --- |
| `target-design.md` | `6ba4564ed486e904409cbe71297d527779f462fce1963e34b4a7a3d9511ce26c` |

## Digest construction

For this revision, `sha256-path-digest-v1` is the canonical multi-file construction: normalize each relative POSIX path; hash each file’s raw bytes; sort entries by normalized path UTF-8 bytes; begin the canonical byte stream with `as-is-packet-v1` followed by NUL; append for each entry its ASCII decimal path-byte length, colon, UTF-8 path bytes, NUL, lowercase hexadecimal file digest, and LF; hash the complete byte stream with SHA-256. The manifest is excluded from the digest scope.

## Review scope

A fresh bounded read-only review, if admitted, may assess this exact successor against the predecessor's fixed checklist and declared review scope. The only intended content change is a human-facing table of contents inserted after the title. The review must not edit this packet, approve it, create tasks, adopt contracts, or authorize implementation.

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
