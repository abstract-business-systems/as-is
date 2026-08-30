# High-level design review manifest — draft 2

This manifest identifies the frozen human-facing design packet for the second revision. It is planning context only; it does not adopt target architecture, change current records, create task authority, or authorize implementation.

## Packet identity

| Field | Value |
| --- | --- |
| Revision | `draft2` |
| Predecessor | `draft1` — `fd3df76b70e8846a6e2db7bdce7c2107f335bcad705e334c8502d28d7b6aff84` |
| Authoring role | Sol, through the read-only expert contract |
| Authoring session | `sol-disposition-kimi-review-draft1-round2` |
| Review state | Frozen for bounded alternate-family review; no draft-2 Kimi review recorded yet |
| Digest algorithm | `sha256-path-digest-v1` |
| Manifest digest scope | All listed non-manifest files |
| Packet digest | `9ba6d3e721f86e1bd42012c381ff45ae3fdd9f1fa4c9c612c19ea0dbef663ade` |

## Frozen file set

| Relative path | SHA-256 |
| --- | --- |
| `target-design.md` | `b356846cfc6d241273a54132832d14a44315670042044086668c8372e9bb64c2` |

## Digest construction

For this revision, `sha256-path-digest-v1` is the canonical multi-file construction: normalize each relative POSIX path; hash each file’s raw bytes; sort entries by normalized path UTF-8 bytes; begin the canonical byte stream with `as-is-packet-v1` followed by NUL; append for each entry its ASCII decimal path-byte length, colon, UTF-8 path bytes, NUL, lowercase hexadecimal file digest, and LF; hash the complete byte stream with SHA-256. The manifest is excluded from the digest scope.

## Review scope

Kimi’s bounded read-only review should assess the human-facing high-level design against this manifest’s fixed checklist and declared review scope, including proposed skill, agent, workflow, boundary, migration, authority, setup, evaluation, and current-versus-planned changes. It should identify supported omissions, contradictions, unsafe assumptions, and concrete repairs. It must not edit this packet, approve it, create tasks, adopt contracts, or authorize implementation.

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
