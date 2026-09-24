# Wrapper validation

## 1. Capability coverage
Present and usable: ownership (no parent/sibling/child record or child-member writes; escalate non-owned work), one-component sessions, observe-then-integrate, per-child integration + checkpoint, no collapsed/bypassed handoffs, decision fields + never-self-authorizing, task/design split, resume-only-with-auth, honest reporting / no invented completion.

**Missing or weak (fixture-gated):**
- **Sibling parallelism:** F0 requires overlapping sibling sessions and distinct concurrent credentials; intra-component parallel is forbidden. Wrapper never allows overlap and “one session = one component” can be read as serialize-everything → overlap gate fail.
- **Consultation evidence:** “consult / consultations” without role, pre-tree hash, or quotations from Purpose / Design / Links. Checkers fail invented or post-edit-only evidence.
- **Authz-scoped writes:** “allowed members” on delegate context only; not “unselected manifest members are denied.”
- **Reserve child roles before spawning.**
- **Interruption:** proposed-not-current and retain lineage, but not mark both task reps interrupted, stop with no completion claim, or packet contents (pre-hash, write log, stop reason).
- **Handoff IDs/hashes:** lineage/members/tests/risks yes; actor, parent session id, tree hash, quoted consultation no.

## 2. Overfitting
No QueueRelay/F0–F5/sink/Envelope names or paths. Mild fixture flavor: sequential checkpoint-before-next-child, decision field list, “tool/worker reports ≠ completion.” Still portable composition discipline, not a leaked answer key.

## 3. Actionability
A careful model can follow ownership, stop-on-overreach, and handoff order. Traps:
- Mandatory **plan-as-intent before implement** and **preserve baseline** invite extra artifacts; F4/F5 pre-auth only allow draft/decision/task/evidence → unauthorized writes.
- Parallel overlap and quotation/hash evidence are unstated, so easy to skip.
- No examples; dense shalls compete under load.
- “Smallest correct change” is unenforceable prose.

## 4. Size
~3052 B vs 1400–2200. Capabilities need ~2k, not 3k. Cut: opener (“Understand the requested…”); baseline/plan/compare paragraph (not a hard gate; causes write-set bugs); duplicated no-edit-child / no-bypass lines; long purpose/boundary/lineage list. Keep: ownership, delegate+observe+checkpoint, decision fields, no self-auth, interruption/resume, no invented provenance.

## 5. Comparison fairness
**Handicap vs skilled composition:** no consultation protocol, manifest-first, actor/parent ids, overlap/credentials, interruption packet — skills would supply these. **Not an unfair boost:** checkpoint/no-bypass/decision schema are the capabilities the thin arm must carry. Plan-before-implement is a self-handicap on F4/F5.

## Verdict
**APPROVE-WITH-CHANGES.** Add one clause: sibling-component sessions may overlap with distinct credentials; do not parallelize inside one component. Require consultation evidence (role, pre-state hash, quotes from purpose/boundary/links) in handoffs. Restrict planning writes to currently authorized admin artifacts; on overreach, stop, mark task interrupted, no completion. Compress lifecycle duplication to hit ~2200 B.