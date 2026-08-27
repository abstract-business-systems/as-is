# High-level design review manifest — draft 9

This manifest identifies the frozen human-facing design packet for the substantive successor to draft 8. It is planning context only; it does not adopt target architecture, change current records, create task authority, or authorize implementation.

## Packet identity

| Field | Value |
| --- | --- |
| Revision | `draft9` |
| Predecessor | `draft8` |
| Authoring role | Target-design author, applying the user's correction to human decision scope and parent/child component realization |
| Review state | Frozen for bounded authorial repair; no subsequent review has occurred |
| Digest algorithm | `sha256-path-digest-v1` |
| Manifest digest scope | All listed non-manifest files |
| Packet digest | `a2adb66e9189964183ab5e758ce80df5da41eaa5991409f19b006eee2a5874a4` |

## Frozen file set

| Relative path | SHA-256 |
| --- | --- |
| `target-design.md` | `cd86181273c0965a190342d7545096ff412dce85ca4cf241629753e737272bee` |

## Requested repair scope

The target-design author applied these user-requested corrections:

- sections 17, 18, and 19 no longer imply that the human must answer every listed question; section 17 defines the single Human Review decision, section 18 holds author/open questions and admission blockers, and section 19 holds provisional operational-contract questions;
- parent/child realization now follows the intended flow: the parent reads its own `as-is.md`, identifies impacted children, writes child-specific changes to each child’s planned section, verifies plan injection, and starts a fresh child-scoped `component-builder` from each child’s record;
- the child implements its injected plan, verifies its own implementation, and integrates its own result into the parent worktree; and
- the parent records child status and plan accounting but does not semantically verify, revalidate, cherry-pick, or integrate the child implementation.

Draft 9 also preserves the previously requested three-phase lifecycle, non-normative treatment of alternate-model/family review history, detailed substantially-blind implementation packets, unresolved-question classification, current/accepted-target/migration separation, deterministic controls, recovery, and explicit no-authorization status.

This revision is a proposal for Human Review. It must not be treated as approved design, adopted contract, task authority, kick-off, or implementation authorization.

## Review scope for the next review

A subsequent bounded design-document review, if requested, should assess this exact packet against these checks:

- sections 17–19 clearly separate the ordinary human decision from author/open questions and operational-contract questions;
- the parent reads its own record, identifies impacted children, injects child plans, and verifies only plan injection before child launch;
- each fresh child-scoped component-builder reads its own record, implements, verifies, and integrates its own bounded result into the parent worktree;
- the parent does not acquire a child implementation verification or integration role;
- cross-component planning uses the nearest common parent without bypassing child ownership;
- implementation packets, unresolved-question handling, recovery, scope, and authority safeguards remain complete; and
- the three-phase lifecycle remains clear and no alternate-model/family review is made a target requirement.

Any subsequent review is advisory only. It may not edit this packet, approve the design, create tasks, adopt contracts, or authorize implementation.

## Revision rule

Any change to this packet requires a successor revision with a new manifest and packet digest. Reviews remain tied to the exact frozen revision they assessed.
