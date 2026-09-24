## Capability accounting

| Capability | Carried by instruction? (YES quote the sentence / PARTIAL quote + gap / NO declared) | If NO: reason (runtime-does-not-expose vs deliberately-out-of-scope vs oversight) |
|---|---|---|
| Delegation scope | **YES** — “Start a child only in a separate bounded session identifying … task, owner, parent, allowed members, consultation evidence, acceptance conditions, and handoff requirements.” | — |
| Expected delegation handoff | **YES** — “Each handoff must include lineage, actor and session IDs, changed members, pre- and post-tree hashes, the consulted record's role and exact consultation quotations, tests, resulting state, material choices, uncertainty, and residual risks.” | — |
| Escalation expectations | **YES** — “Update only the current component's authoritative record … escalate parent, sibling, child, or external boundary changes.” | — |
| Component purpose and design context | **YES** — “Before changing a component, inspect its code, tests, interfaces, behavior, and authoritative record.” Consultation requires exact quotations from “purpose, boundary, and links.” | — |
| Component relationships, hierarchy, links, and boundaries | **YES** — Exact quotations are required from boundary and links; parent, sibling, child, and external changes must be escalated. | — |
| Parent/child ownership rules | **YES** — “Do not write child-owned members” and “update only the parent's owned record for that child.” | — |
| Design principles and component contracts | **PARTIAL** — Component ownership and authority rules are explicit, but executor-role contracts are not consulted or enforced. | Oversight; runtime exposes installed role declarations. |
| Accurate maintenance of the owned record | **YES** — “Update only the current component's authoritative record, and only for completed reality it owns.” |
| Separation of task state, drafts, decisions, evidence, and durable design | **YES** — “Keep task state, authorization, drafts, decisions, and evidence separate from durable design.” | — |
| Human review and decision at the owning architectural level | **PARTIAL** — “Resume only with explicit authorization,” but the instruction does not identify the owning human/design authority or require changed durable records to be returned for human review. | Oversight. |
| Completion means implementation, record, and authority are aligned | **YES** — “Proposed, interrupted, or unvalidated work is not current design”; completion also requires record, scope, behavior, and hash validation. | — |
| Per-child model selection | **NO** — No child-model policy is declared. | Oversight; runtime exposes `--model` and role/project model selection. |
| User-configured named models and project default | **NO** — No reference to `agents.models` or `agents.defaultModel`. | Oversight; runtime exposes these configuration surfaces. |
| Per-role model mapping and precedence | **NO** — The instruction does not consult the role declaration’s `model`, resolve aliases, or prevent accidental caller-model inheritance. | Oversight; runtime exposes role model → named model/project default resolution. |
| Per-role/project thinking level | **NO** — No child thinking policy or reference to role `thinking` and `agents.defaultThinkingLevel`. | Oversight; runtime exposes `--thinking` and role/project resolution. |
| Executor-role selection with distinct contracts | **NO** — Children are called “roles,” but the instruction never chooses between implementation, read-only analysis, and read-only evidence-validation executors. | Oversight; the installed roster exposes distinct contracts. |
| Session and actor identification | **YES** — Child sessions identify “actor, session and parent-session IDs”; handoffs repeat lineage and IDs. | — |
| Child working-directory selection | **NO** — No policy names the child component root as its `cwd`. | Oversight; runtime exposes `--cwd`. |
| Least-privilege child tools and skills | **PARTIAL** — “allowed members” bounds writes, but child tool allow-lists and additional skills are not selected explicitly. | Oversight; runtime exposes `--tools` and repeatable `--skill`. |
| Child session naming and persistence | **PARTIAL** — Session IDs are required, but bounded task names and persistent versus non-persistent sessions are not addressed. | Oversight; runtime exposes `--task-name` and `--no-session`. |
| Project-local trust/approval policy | **NO** — Delegation does not state whether project-local files are trusted. | Oversight; runtime exposes `--approve`/`--no-approve`. |
| Provider-aware model resolution | **NO** — The configured `agents.provider` is not acknowledged. | Oversight; runtime carries provider alongside resolved model selection. |
| Independent read-only evidence-validation role | **PARTIAL** — Read-only checks must not alter state, but the instruction does not say when to delegate to the installed evidence validator or preserve its read-only contract. | Oversight; runtime exposes the role. |
| Budget/accounting stop behavior | **PARTIAL** — “When … a required stop occurs” and the interruption protocol cover stopping, but applicable child budget and usage state are not included in establishment or handoff. | Oversight; runtime provides accounting, while authorization to extend remains external. |
| Child launcher/Pi executable selection | **NO** — No `--pi` policy is provided. | Deliberately out-of-scope: executable discovery is runtime/installation policy, not a portable task-authority decision. |
| Session-directory implementation | **NO** — No filesystem session-directory policy is provided. | Deliberately out-of-scope: runtime resolves configured session storage; the instruction only needs persistence and lineage semantics. |
| Task-record naming implementation | **NO** — No configured task-record filename is prescribed. | Deliberately out-of-scope: runtime/project configuration owns concrete record names; the instruction carries semantic separation and interruption requirements. |

### Missing-capability notes

The additional carried-capable gaps are child `cwd`, least-privilege tools and skills, session naming/persistence, project-local trust, provider-aware model resolution, explicit use of the evidence-validation executor, and budget-state reporting. Launcher discovery, session-directory paths, and concrete task-record filenames should remain runtime/configuration concerns rather than portable instruction policy.
