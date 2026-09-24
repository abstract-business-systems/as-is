**FREEZE-READY**

**1. Prior mechanics (binding quotes)**  
- Ledger cadence: “Create or reconcile a parent-owned administrative closure ledger: at the start of every parent session; at every resume; after every observed child result; after every parent-produced result; and immediately before completion.”  
- Clean invoke every reconcile + stop/recovery: “Immediately after every reconciliation, launch a clean process… and directly load or invoke every integration or composition surface… A missing, unloadable, uninvokable, stale, or unsupported declared surface is a stop condition… No checkpoint may call the parent state acceptable while it persists. Enter bounded recovery… After each recovery result, reconcile… invoke every declared surface… create and reread the required checkpoint… Resume ordinary progression only when they agree and every invocation succeeds.”  
- Checkpoint gate (child or parent): “containing exactly one newly observed and accepted result, whether child-produced or parent-produced.” “Maintain one incrementally ordered checkpoint per accepted result; later cumulative evidence cannot replace a missing earlier checkpoint.”  
- Parent-solo parity: “Parent-solo work provides full parity with the child-produced-result gate.” Plus the for-each gate covers “child-produced or parent-produced result.”  
- Child self-check: “Before claiming success or emitting a final handoff, every child must inspect its promised artifacts… After writing the handoff, reread it. If an artifact is absent… never success.”  
- Consultation format: “record each source’s role, location or stable identity, version or consulted pre-change hash, owning authority, exact controlling quotation, conclusion drawn, and omissions.”  
- Categories: six-way split (manifests / ledgers / decisions / checkpoints / handoffs / durable design records) and “No tracker, ledger, decision, checkpoint, handoff… or successful process exit authorizes itself or replaces the owning durable record.”  
- Boundary/design-first: “Work boundary- and design-first. Change only authorized manifest members; deny all others…”

**2. Anti-overfit**  
No project, product, or repo names. Vocabulary is generic (manifest, cwd, aliases, handoff).

**3. Regression / 8 claims**  
Present and imperative: per-child model/thinking order; three executor contracts; “Do not inherit caller model or thinking”; launching-client project cwd; explicit identity wiring + verify received; alias chains / unaliased literal; handoff budget/usage; checkpoint = one accepted result, ordered, non-substitutable.

**4. Cap cuts**  
No distinct mechanic missing; remaining text still forbids self-authorization, baseline rewrite, dual writers, and ungated missing surfaces.

**5. New failure mode**  
Solo “result” granularity is thin: a parent may batch many writes as one result and under-fire ledger → clean invoke → checkpoint, despite parity language.