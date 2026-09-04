# Transient agent roster integration (draft 1)

Status: draft for discussion — proposes integration of proven transient agents into the primary roster; adopts nothing and retires nothing by itself. Recorded 2026-09-04 in the cutover drafts folder (dropped at merge; the adoption decision and its records must land in durable component records before that drop).

## 1. Background

The candidate construction flow used a transient agent set under `candidate/agents/` (now `drafts/agentic-development-system-cutover/candidate/agents/`). Five of its roles were already adopted into the live roster (`worker`, `component-builder`, `expert`, `evidence-validator`, `execution-advisor`). Four roles were never adopted yet have real session-history usage, including active use during the F9 cutover itself. This draft inventories them, states the adoption criterion, and proposes a disposition per role for human acceptance.

## 2. Usage evidence (session-store reference counts, all-time, 2026-09-04)

| Transient role | Session references | Live roster equivalent | Actively used at cutover |
| --- | ---: | --- | --- |
| `planning-adviser` | 46 | none | yes (F9 structuring consult) |
| `target/as-is-orchestrator` | 36 | none | no (design-era) |
| `target/design-prototyper` | 25 | none | no (design-era) |
| `external-adviser` | 24 | none | no (multi-model review trials) |

## 3. Adoption criterion (proposed)

Advisor and challenger roles become **agents**: their distinguishing concerns are per-role model binding, thinking budget, and a read-only tool surface — none of which belong in a skill; they grant no authority by design. A capability that is a bounded procedure independent of model persona becomes a **skill**. Every adoption must pass the existing roster admission test and carry the standard agent record (`agents/<name>/as-is.md`), and must state its bounded read-only boundary in the role file.

## 4. Per-role proposal

### 4.1 planning-adviser — adopt as agent (strongest case)

Bounded planning advice to the implementer; read-only; model-bound (`openai/gpt-5.6-sol`, thinking high). It is the role behind every Sol planning consult in the adoption program, including the cutover structuring review, and is the only transient role still in active use. Proposal: adopt as `agents/planning-adviser/` with its existing frontmatter, an `as-is.md` record, and a live-behavioral test consistent with the other adviser roles. Open question for human acceptance: model binding in the primary roster (the candidate binding is a specific preset model; the roster admission test may constrain model policy).

### 4.2 external-adviser — adopt as agent, or generalize

Bounded independent advisory challenge; read-only; model-bound (`moonshotai/kimi-k3`). Used in the multi-model review trials as the independent challenger. Two shapes: (a) adopt as a second fixed-bind adviser agent; (b) generalize into one bounded-challenger adviser role with per-invocation model selection, of which the current kimi binding is the first instance. Proposal: prefer (b) only if the launcher and roster admission support per-invocation model override cleanly; otherwise (a). Decision deferred to the implementing task.

### 4.3 design-prototyper — adopt, or retire with evidence

Drafts prototypes, target designs, and decision briefs for human acceptance; read-only discovery tools. Proven during the design-convergence phase (25 uses) but idle since implementation began. Two defensible dispositions: adopt as the standing design-phase role for post-merge design work, or retire with the evidence tag and re-create on demand from this draft. Proposal: adopt — the post-merge backlog (draft-tree reduction, trust hardenings) will need bounded design drafts, and the role is proven; cost of custody is one record and one test.

### 4.4 as-is-orchestrator — retire with evidence (proposed)

Its own description is a placeholder ("One-line fit statement only; grants no tools and no authority"). Its 36 references come from design-era orchestration exploration, superseded by the human-led orchestration and the parent-child delegation model that the adoption program actually built and benchmarked. Proposal: do not adopt; the role remains recoverable via the evidence tag. If a concrete orchestration-admission need appears post-merge, design it then against the real admission machinery rather than reviving the placeholder.

## 5. Scope and boundaries

- Adoption tasks are separately selected, bounded, and human-accepted; this draft authorizes no roster change by itself.
- The transient set's source files move with the cutover drafts folder and drop at merge; adoption must copy (not reference) role content into durable agent records first.
- Integration must not weaken role restrictions: all four roles are read-only advisers or drafters; none gains write, edit, execution, or delegation authority.
- The roster admission test and the agents component record are the authorities for what the roster may contain; this proposal is input to them.
