# Agentic Development System — Full-Flow Realization Plan

## 1. Purpose, authority, and execution

This plan defines the complete realization flow through benchmarking: the full reusable-skill catalog from the composable-skills draft, the target agent roster, the master skills and compositions, and the benchmark protocol — all inside the isolated `candidate/` namespace, following the process the skill-fidelity pilot validated. The plan does not change the live skill catalog, any live agent, `core/`, or any `as-is.md` record.

- **Design context (exclusive)**: drafts only. The primary design authorities are `drafts/composable-skills.md` (referred to below as "the skills draft") for per-skill and per-master contracts, and `drafts/agentic-development-system-high-level-design-draft11/target-design.md` (referred to below as "target-design") for the accepted target envelope, the authority model (section 7.1), and the agent roster (section 8). No design source outside `drafts/` is consulted as design context.
- **Design authority, never task authority**: the skills draft states at lines 2-3 that it does not authorize implementation or create task authority, and lines 972-974 confirm it is not a live catalog, repository-wide policy, task authority, or implementation plan. Target-design states at line 77 that it is a design proposal only and does not adopt contracts, retire artifacts, create tasks, or authorize implementation.
- **Execution authority**: as with the pilot, recorded user acceptance of this verified plan authorizes the realization flow itself; per-artifact implementation passes then run under an applicable active task record as the current task authority (skills draft line 18). **User acceptance: pending** — recorded user acceptance must precede any implementation artifact (section 10, gate 4) and recorded acceptance of the benchmark protocol must precede benchmark execution (section 8).
- **Executing role**: the implementer transient agent (`candidate/agents/implementer/agent.md`, per the transient roster in `handoffs/agentic-development-system-continuity-checklist.md` section 6) executes this plan under that recorded acceptance, inside `candidate/`, with all evidence candidate-local.
- **Claim limitation**: every completion claim in this flow is limited to candidate fidelity — realized artifacts match their draft contracts under the protocol in section 9. This flow produces no repository-skill promotion, no live-catalog change, and does not by itself satisfy the full promotion evidence set (structure, owner, name, independent consumer, validation) required by skills draft line 88; owner and independent-consumer evidence remain for a later adoption decision.
- **User direction on scope**: the user has directed that the plan cover the ENTIRE flow through benchmarking — the full reusable-skill catalog, target agent roster, master compositions, and benchmark. This supersedes, for candidate-namespace purposes only, the drafts' caution against wholesale realization: skills draft line 134 states the 25 proposed skills "are not a one-for-one replacement catalog" and are "planning estimates, not migration decisions", and target-design section 2 (line 88-89, artifact disposition) rejects wholesale capability creation as a mandate and does not adopt the proposed catalog. Because this flow is confined to `candidate/` and changes no live artifact, realizing the full catalog here is a **user decision**, recorded here and flagged as such; it is not derivable from either draft. A later adoption decision remains a separate, unresolved decision (section 12).
- **Reversal history**: this flow is the successor to the previously reversed candidate realization (24 TypeScript skill stubs and 77/77 tests, commit `c647a35`), removed as unfaithful to its source design. It differs deliberately: procedure documents faithful to draft contracts, not synthetic stubs; authority held by recorded user acceptance; evidence candidate-local; behavioral walk-throughs; and a benchmark that is pre-registered and human-approved rather than a synthetic test suite.

## 2. Source authority map

Items that trace to the drafts trace to the two documents below. Items in sections 4-8 marked "plan decision" or "user decision" are not draft-derived and are flagged as such per the pointer-discipline rule.

| Flow item | Draft source (exact location) |
| --- | --- |
| Draft-only framing; no promotion, implementation authorization, or task authority | Skills draft lines 2-3, 972-974; target-design line 77 |
| Reusable skill definition; separate promotion evidence (structure, owner, name, independent consumer, validation) | Skills draft lines 86-88 |
| Master skill definition (composes reusable skills; owns selection, ordering, gates, recovery) | Skills draft line 90; master-skill preamble at lines 688-690 |
| Master-first selection; composition variants; preference order, not mandatory activation | Skills draft lines 92-104 |
| "Fit, not permission" description rule | Skills draft line 107 |
| Tool-access rule (a skill does not grant tools; missing capability stops the workflow; no weaker-tool substitution) | Skills draft lines 111-129, especially 113 |
| Size planning target: reusable skill at most 2,000 characters when that is enough; enforcement requires an adoption decision | Skills draft line 132 |
| Catalog-coverage caution (planning estimates, not migration decisions) | Skills draft line 134 |
| Change scope resolution (component / artifact / root; stop when ambiguous) | Skills draft lines 136-144 |
| `writing-code` vs `applying-bounded-edits` separation | Skills draft lines 146-148 |
| Changelog resolution rules | Skills draft lines 150-160 |
| Master workflow examples (composition context) | Skills draft lines 162-176 |
| Reusable-skill contracts (24 defined skills) | Skills draft lines 182-686, per-skill ranges in section 5 |
| Master-skill contracts (12 masters) | Skills draft lines 692-945, per-master ranges in section 7 |
| Child stop conditions (contradiction, missing dependency, prohibited access, failed validation, out-of-packet) | Target-design lines 537-559, especially 541, 557 |
| Child integration conflict and out-of-scope stops | Target-design lines 561-567 |
| Unresolved-question blocking stops and closure prevention | Target-design lines 595-605 |
| No inferred completion, no automatic retry, no scope widening | Target-design lines 607-613 |
| Design constraints (composition does not transfer authority; smallest scope; explicit validation path) | Skills draft lines 947-955 |
| Reserved for later (metadata, registries, dependency schemas, wholesale replacement) | Skills draft lines 957-970 |
| Target lifecycle (three phases, one human decision) | Target-design section 6, lines 260-303 |
| Authority model (actor/authority/limits table) | Target-design section 7.1, lines 307-324 |
| Escalation ladder | Target-design section 7.2, lines 326-360 |
| Agent disposition roster; names provisional | Target-design section 8, lines 362-377 |
| Model assignments are replaceable implementation choices | Target-design line 377 |
| Proposed skill introductions (`developing-target-designs`, `making-changes`, `planning-realization`) | Target-design section 9.2, lines 405-415 |
| Proposed agent-to-skill compositions; `developing-target-designs` and `building-components` text compositions | Target-design section 9.3, lines 417-489 |
| Implementation packet contents and child stop conditions | Target-design section 10.3, lines 537-559 |
| Parent planning, child implementation, child integration | Target-design section 10.4, lines 561-593 |
| Benchmark: advisory, not authority; comparison protocol; human approval required | Target-design section 5.2 subsection, lines 246-250 |
| Benchmark: first-proof design; seed; measured dimensions; pre-registration requirement; "no benchmark has run" | Target-design section 13, lines 659-666 |

Items deliberately **not** sourced from the drafts (flagged per gate §4 of `handoffs/agentic-development-system-continuity-checklist.md`): the `candidate/` artifact paths and directory layout (section 4); the fidelity-test protocol mechanics (section 9, inherited from the pilot plan section 6 and validated by the pilot execution record); the agent-verification method (section 6, a plan decision); the staging order and stage gates (section 3, a plan decision implementing checklist section 5 direction); the benchmark's concrete mechanics inside `candidate/` (section 8, a plan decision within target-design's protocol requirements); and the review/acceptance gates (section 10, inherited from the pilot). The drafts do not define a benchmark protocol beyond section 13's requirements; all benchmark mechanics below the pre-registered fields are plan decisions.

**Flagged design discrepancy**: skills draft line 134 says "The 25 proposed reusable skills", but the draft defines exactly 24 per-skill contract sections (the 36 backtick headings at skills-draft lines 182-686 and 692-945 comprise 24 reusable skills and 12 masters). This plan realizes the 24 defined contracts; the "25" count is treated as a draft arithmetic slip, not a hidden 25th skill. Adjudication is a user decision (section 13).

## 3. Scope and staging

The flow covers the four artifact families the user directed, staged so that each family is verified before the next consumes it (`handoffs/agentic-development-system-continuity-checklist.md` section 5):

- **Stage 1 — Reusable skills.** The 22 skills not yet realized (section 5). Each is implemented and fidelity-tested independently, one bounded unit at a time, following the pilot's protocol and process learnings.
- **Stage 2 — Target agent roster.** The candidate target-roster agent definitions (section 6), each defined and verified independently against target-design section 7.1 and section 8.
- **Stage 3 — Master skills and compositions.** The 12 master skills (section 7), realized only after every reusable skill they reference has independently passed verification (checklist section 5). Master fidelity includes the composition tables and workflow examples they cite. The two target-design-only introductions join stage 3 only under user decision (section 13, item 3).
- **Stage 4 — Benchmark.** Pre-registration of the benchmark protocol (section 8), recorded user acceptance of the protocol, then execution and candidate-local results recording. The benchmark is re-established only after re-aligned implementation exists, per checklist section 3; stages 1-3 supply that implementation.

Two skills are already realized and PASS under the pilot protocol; they appear in the roster table below marked realized (evidence in `candidate/evidence/skill-fidelity-pilot-execution-record.md`) and are not re-realized; their candidate artifacts and evidence carry forward unchanged into stage 3's composition dependencies.

Staging order within stages 1-3 is a plan decision (no draft prescribes it), chosen so composition prerequisites pass first: skills referenced by master compositions (skills draft lines 100-101, 165) are sequenced before the masters that cite them. A stage gate is violated if a master is realized while any skill its composition table names has a failing or missing fidelity record.

### 3.1 Full reusable-skill roster (24 contracts)

| # | Skill | Draft contract lines | Status |
| --- | --- | --- | --- |
| 1 | `building-context` | Skills draft 182-202 | Stage 1 |
| 2 | `resolving-scopes` | Skills draft 204-224 | Stage 1 |
| 3 | `identifying-owners` | Skills draft 226-245 | Stage 1 |
| 4 | `locating-changelogs` | Skills draft 247-266 | Stage 1 |
| 5 | `choosing-names` | Skills draft 268-287 | Stage 1 |
| 6 | `structuring-content` | Skills draft 289-308 | Stage 1 |
| 7 | `drafting-content` | Skills draft 310-329 | Stage 1 |
| 8 | `writing-code` | Skills draft 331-350 | Stage 1 |
| 9 | `applying-bounded-edits` | Skills draft 352-371 | Realized (pilot PASS) |
| 10 | `writing-tests` | Skills draft 373-392 | Stage 1 |
| 11 | `running-tests` | Skills draft 394-413 | Stage 1 |
| 12 | `validating-changes` | Skills draft 415-434 | Stage 1 |
| 13 | `recording-evidence` | Skills draft 436-455 | Stage 1 |
| 14 | `designing-diagrams` | Skills draft 457-476 | Stage 1 |
| 15 | `rendering-diagrams` | Skills draft 478-497 | Stage 1 |
| 16 | `inspecting-execution-evidence` | Skills draft 499-518 | Stage 1 |
| 17 | `assessing-determinism` | Skills draft 520-539 | Stage 1 |
| 18 | `recording-backlog-items` | Skills draft 541-560 | Stage 1 |
| 19 | `drafting-changelog-entries` | Skills draft 562-581 | Stage 1 |
| 20 | `delegating-bounded-work` | Skills draft 583-602 | Stage 1 |
| 21 | `observing-delegated-work` | Skills draft 604-623 | Stage 1 |
| 22 | `preparing-scoped-commits` | Skills draft 625-644 | Stage 1 |
| 23 | `presenting-decisions` | Skills draft 646-664 | Stage 1 |
| 24 | `choosing-change-methods` | Skills draft 667-686 | Realized (pilot PASS) |

## 4. Artifact form (plan decisions, following the validated pilot pattern)

All artifact forms follow the pilot-validated pattern (`candidate/skills/reusable/<name>/SKILL.md`, pilot plan section 4) and are plan decisions, not draft-derived requirements:

- **Reusable skills**: `candidate/skills/reusable/<name>/SKILL.md`; one file per skill; YAML front matter with exactly two fields (`name` exact draft heading name; `description` one line derived from the draft Purpose line, establishing fit, not permission, per skills draft line 107); body carries the draft's `Purpose`, `Approach`, `How it should be done`, and `Design view` (Mermaid) sections by pointer; no additional sections; no TypeScript stubs, runtime code, or tool registration.
- **Master skills**: `candidate/skills/master/<name>/SKILL.md`; same front-matter rule; body carries the master's draft contract sections plus its composition context (the draft's composition tables and workflow-example lines the master cites, per section 7). Master skills may exceed the 2,000-character planning target because they carry compositions, gates, recovery, and stopping rules (skills draft line 132).
- **Target-roster agents**: `candidate/agents/target/<role>/agent.md` plus a model-alias entry in that directory's config, following the transient-roster file pattern (`candidate/agents/<role>/agent.md`). The `candidate/agents/target/` sub-namespace keeps the construction roster (`implementer`, `worker`, `planning-adviser`, `external-adviser`) separate from the target roster. Placement and the sub-roster naming are plan decisions.
- **Benchmark**: `candidate/benchmark/` for the pre-registration record, seed, feature definition, rubric, scorer, and results (section 8). Location is a plan decision.

## 5. Stage 1 — Reusable-skill catalog realization

The 22 unrealized skills in the section 3.1 roster are realized in stage 1, each in its own bounded pass. Contracts are authoritative as written in the draft at the exact per-skill line ranges listed there; the plan does not restate them. The fidelity test for each skill diffs the realization against its cited draft lines. Fidelity-sensitive per-skill notes (terminal-stop locations, ordering rules, and outcome semantics) are carried in the per-skill side-by-side documents (section 9 checks 4, 5, 11) against the cited lines, not pre-summarized here.

Cross-cutting interpretation rules (fidelity-sensitive points, applying the pilot's validated interpretations):

| Draft source | Interpretation carried into every realization |
| --- | --- |
| Any "stop ..." clause in a skill's How-it-should-be-done line | Realized as a terminal stop-for-direction step, not an advisory note or fallback (the pilot's validated interpretation, pilot plan section 5.1). |
| Skills draft line 107 | Front-matter descriptions establish fit, never permission; no tool or authority grants. |
| Skills draft lines 100-104, 148, 162-176 | A skill body may note composition context only where the draft itself provides it (e.g., `writing-code`/`applying-bounded-edits` separation at line 148); it must not reference or depend on other candidate skill files during its own fidelity test (per-skill isolation, section 9 check 9). |
| Skills draft line 113 | Where a contract mentions verifying tools or permissions (e.g., the already-realized `choosing-change-methods`), the body acknowledges the tool-access rule without defining any tool-access matrix (out of scope per section 12). |

Skill-specific interpretations discovered during realization are recorded per-skill in that skill's side-by-side document as flagged items for human adjudication — the pilot's pattern (pilot execution record, residual risk 1) — rather than pre-specified here, because checklist section "Design-context authority rule" makes the per-skill draft sections the only authority for per-skill procedure detail.

## 6. Stage 2 — Target agent roster realization

The roster is realized from target-design section 8 (lines 362-377) with authority and limits from the section 7.1 table rows cited per row below (target-design lines 311-322). Each agent is defined independently and verified against its source-draft role definition before any composition or master references it (checklist section 5). Each realized `agent.md` must trace every authority claim and limit it states to the cited rows; the side-by-side evidence (section 9) records the row-to-definition mapping, and the definition must not restate or widen the table row.

| Candidate target agent | Disposition pointer | Authority/limits pointer |
| --- | --- | --- |
| Project orchestrator (working name `as-is-orchestrator`) | target-design:368 (`as-is`, **Modify**) | target-design:312 (non-implementing; does not infer human acceptance) |
| `component-builder` | target-design:369 (**Retain and adapt**) | target-design:314 (parent planner) and target-design:316 (fresh child-scoped builder; cannot change parent plan, sibling scope, accepted envelope, parent task state, or protected parent artifacts outside the admitted integration operation) |
| `evidence-validator` | target-design:370 (**Retain and adapt**) | target-design:317 (no mutation, task admission, parent integration, or human acceptance authority) |
| `execution-advisor` | target-design:371 (**Retain**) | target-design:371 (telemetry stays supplementary) with the observability limits row target-design:322 (never defines task status, budget, recovery, or completion) |
| `expert` | target-design:372 (**Retain and compose**) | target-design:318 (not an alternate-model gate; no authority from reviewing) |
| `design-prototyper` (working name) | target-design:375 (**Introduce** a design/prototyping agent) | target-design:313 (cannot accept its own envelope or authorize implementation) |
| `thinking-companion` | target-design:373 (**Deprecate, then replace**) | Not created in the candidate target roster; per target-design:373, general consultation moves to the human-facing orchestrator plus the consulting master skill (`consulting-humans`, skills draft 905-924), and design facilitation moves to the design/prototyping role |
| `worker` | target-design:374 (**Defer replacement decision**) | Not created; child work uses fresh child-scoped `component-builder` instances (target-design:374, 369). The transient construction `worker` (checklist section 6) is unaffected and remains the construction mechanism |

Roster rules:

- Each agent definition maps its authority and explicit limits to the target-design 7.1 table rows (lines 307-324); a definition whose authority exceeds its table row's limits fails verification.
- **Model/roster assignments are implementation choices, not role names or lifecycle stages** (target-design line 377); the model-alias config is replaceable and the transient candidate/agents roster (checklist section 6) remains the construction mechanism that implements and tests everything.
- No agent definition grants tools or authority; skills declare capability needs only (target-design lines 320-321; skills draft line 113). The launcher's hard rejection of empty `tools:` declarations applies (checklist section 7 process note); read-only tool access is the default for advisory roles.
- The target-roster agents are construction artifacts for this candidate flow, not the live roster; they exist to be exercised by the benchmark (section 8) inside `candidate/`.

## 7. Stage 3 — Master skills and compositions

The 12 master-skill contracts are authoritative as written; the plan points, not restates. Each master's fidelity test includes the composition tables and workflow examples it cites from the draft.

| Master skill | Draft contract lines (section span) | Composition context cited |
| --- | --- | --- |
| `making-changes` | 692-712 | Variants table at lines 98-104; workflow example at lines 164-166 |
| `building-components` | 714-734 | Workflow example at lines 168-170; target-design text composition at lines 481-489 |
| `implementing-tasks` | 736-756 | Component-variant table row at line 100 (position in order) |
| `maintaining-components` | 758-777 | — |
| `managing-as-is-records` | 779-798 | — |
| `designing-mermaid-diagrams` | 800-819 | — |
| `managing-backlogs` | 821-840 | — |
| `managing-changelogs` | 842-861 | Changelog resolution rules at lines 150-160 |
| `spawning-subagents` | 863-882 | Tool-access row at line 123 |
| `exploring-execution-evidence` | 884-903 | Workflow example at lines 172-174 |
| `consulting-humans` | 905-924 | — |
| `committing-completed-work` | 926-945 | Tool-access row at line 124 |

Cross-cutting master interpretation rules:

| Draft source | Interpretation carried into master realizations |
| --- | --- |
| Skills draft lines 98-104 | Composition arrows are a master-selected preference order, not mandatory activation; omissions must be stated with reasons, required gates preserved, and a stop when the applicable owner or contract is unresolved. |
| Skills draft lines 162-176 | Master workflow examples are composition context; existing task, backlog, changelog, delegation, and commit authorities remain authoritative (line 176). |
| Skills draft lines 111-129 | Each master carries its composition's tool-access acknowledgment (the applicable row(s) of the lines 119-124 table as composition-admission documentation); no runtime admission change and no agent front-matter change (out of scope per section 12). |
| Skills draft lines 947-955 | Design constraints apply as written: composition does not transfer authority; smallest applicable scope; explicit validation path; changelog omission only when the work contract permits no durable history. |
| Target-design lines 405-415, 417-489 | `making-changes` here realizes the skills-draft master (lines 692-712); the target-design 9.2 introduction table (line 412) and 9.3 compositions (lines 417-489) are the accepted-envelope composition context for `developing-target-designs` and the adapted `building-components` text composition at lines 481-489, which stage 3 records alongside the skills-draft `building-components` composition as two named compositions of the same master (flagged for human adjudication in the side-by-side evidence, since the two drafts give overlapping-but-distinct compositions for `building-components`). |
| Target-design lines 405-415 | `developing-target-designs` (line 411) and `planning-realization` (line 413) appear in target-design 9.2 as proposed introductions with purpose lines but no per-skill contract sections in either draft. **Master cardinality is a user decision (section 13, item 5)**: this plan's default stage 3 realizes exactly the 12 skills-draft masters (skills draft lines 692-945); the two target-design-only introductions are realized as additional thin masters only if the user accepts that 14-master scope. If accepted, their bodies carry only their target-design 9.2 purpose lines (411, 413) and the 9.3 text composition (470-477 for `developing-target-designs`) — plus, for `planning-realization`, the implementation-packet content requirements of target-design lines 537-559 as its procedure context. Their thinner contracts (single purpose line, no Mermaid design view) are a flagged design asymmetry for human adjudication, not silently filled with invented contract sections. |

Stage gate: a master is realized only after every reusable skill its composition names has a passing stage-1 fidelity record (checklist section 5). The composition note discipline from the pilot applies: a master may name and order skills, but must not depend on another master.

## 8. Stage 4 — Benchmark (pre-registered, human-approved, candidate-local)

The benchmark follows target-design section 13 (lines 659-666) and the advisory-not-authority constraints of section 5.2 (lines 246-250). Status: no project-specific workflow benchmark has run (target-design lines 248, 665).

1. **Pre-registration (before any run)**: a benchmark pre-registration record at `candidate/benchmark/pre-registration.md` records the exact seed, pinned baseline revision, candidate revision, feature, settings, budget, retry policy, deterministic checks, protected inputs, rubric, scorer, safety-critical failures, thresholds, and advancement rule (target-design line 665). These field values are plan/user decisions made at pre-registration time; the drafts define the required fields, not the values.
2. **Setup**: one separately owned mock project seed and one simple feature requiring setup, component or scope resolution, a small human-facing design, one bounded code change, focused tests, deterministic validation, implementation review, integration, and status reporting (target-design line 661). The seed project is authored under `candidate/benchmark/seed/` (plan decision). Per target-design line 663, the baseline consumer uses a pinned `master` revision and the candidate consumer the active candidate revision, created from the same seed, in separate directories and worktrees, with identical feature request, model settings, budget, retry policy, deterministic checks, protected fixture, rubric, validators, and scorer outside worker write scope.
3. **Measurements**: setup, correctness, scope discipline, human effort, agent operation, integration, evidence, design alignment, and recovery (target-design line 665). The rubric and scorer are plan decisions recorded in the pre-registration.
4. **Distinct experiments**: workflow comparison is labelled separately from any model-selection or reviewer-selection experiment (target-design lines 250, 665).
5. **Human approval**: the benchmark protocol and any advancement decision require recorded human approval (target-design line 250). Gate: pre-registration is presented to the user with the stage 1-3 consolidated results; benchmark execution begins only after acceptance is recorded.
6. **Claims**: benchmark results support only the pre-registered comparison claim. They are advisory, not a target lifecycle gate or adoption result (target-design line 248); they do not promote candidate artifacts or authorize live-catalog change.

## 9. Fidelity-test protocol (completion gate, inherited from the pilot)

Each stage-1 skill passes the 12-check protocol validated by the pilot (`designs/agentic-development-system-skill-fidelity-pilot-plan.md` section 6), applied per skill with the pilot's process learnings (`candidate/evidence/skill-fidelity-pilot-execution-record.md`):

1. Clause-coverage check against the skill's draft Purpose, Approach, and How-it-should-be-done lines (the line ranges in section 5).
2. Exact skill name and directory name.
3. Description semantic check (fit, not permission; skills draft line 107).
4. No invented steps or authority claims; each realized step maps to a draft line; additions flagged and adjudicated by human review via the side-by-side document.
5. Stop conditions preserved as terminal stops.
6. Least-powerful-fitting-method rule where the contract states it.
7. Consumer-inspection ordering where the contract orders it (e.g., `applying-bounded-edits`, line 358).
8. Size check: character count recorded against the voluntary 2,000-character planning target (skills draft line 132); a pilot-validated criterion, not a draft mandate.
9. Per-skill test isolation: the fidelity check runs in an ephemeral fixture containing only that skill's directory, with the listing recorded as evidence.
10. Behavioral scenario walk-throughs: 2-3 scripted scenarios per skill, walked through by an agent following only the candidate skill document in an isolated candidate fixture, evaluated against the draft contract. At minimum, every skill with a terminal stop clause gets one stop-path scenario, and every skill with a selection or ordering rule gets one compliant-selection scenario. Scenario fixtures and results remain inside `candidate/`.
11. Human-reviewable side-by-side diff evidence mapping each draft contract line to the realized `SKILL.md` with exact line references on both sides.
12. Design-view check: the Mermaid block reproduced structurally (nodes, edges, labels) from the draft's `#### Design view` block.

Masters (stage 3) pass an adapted protocol: checks 1-5, 8-11 applied to the master's contract lines (section 7), a composition-fidelity check (check 13, plan decision) verifying every named composition entry against the cited composition table lines, and one end-to-end behavioral walk-through per composition variant (e.g., the component-based and non-component variants of `making-changes`, draft lines 100-101).

Agents (stage 2) pass a verification adapted to their artifact form (plan decision; no draft defines an agent test protocol):

- **Static authority/limits mapping**: every claimed authority traces to the cited target-design 7.1 row and section 8 disposition; every table-row limit appears in the definition; nothing beyond the rows.
- **Human-reviewable side-by-side evidence per agent** (pilot check 11 pattern): a document mapping each cited target-design authority/limits row (and section 8 disposition line) to the corresponding `agent.md` section with exact line references on both sides, with additions flagged for adjudication.
- **Isolation evidence** (pilot check 9 pattern): each agent's verification fixture listing is recorded, showing the agent under test alone.
- **Behavioral walk-throughs**, including the agent's own boundary plus the target-design stop conditions it owns: the design-prototyper refuses to accept its own envelope; the evidence-validator declines mutation; the orchestrator does not infer human acceptance; the child-scoped component-builder stops on contradiction, missing dependency, prohibited access, failed validation, or an out-of-packet condition (target-design lines 541, 557), stops on integration conflict or out-of-scope requirements (line 567), stops affected work on blocking unresolved questions and does not close with one hidden (lines 599-605), and neither infers completion from process exit or telemetry, retries automatically, nor widens scope (lines 611-613).

Every walk-through result, fixture listing, and side-by-side mapping is recorded candidate-local (section 11).

Completion claims from this flow are limited to candidate fidelity (checklist section 7 direction; pilot execution record claim limitation). A passing fidelity record never implies repository promotion, consumer validation, or adoption.

## 10. Process gates

The same gate structure the pilot established and the user validated (checklist sections 4 and 7):

1. **Plan verification (internal)**: this plan is reviewed by the planning-adviser for scope fidelity, authority mapping accuracy, and stop-condition preservation.
2. **Independent challenge (external)**: the planning-adviser's findings, with the internal verdict inline, are submitted to the external-adviser for independent challenge.
3. **Consolidated verification to user**: the implementer consolidates both reviews into a single verification summary and presents it to the user before any implementation artifact of this flow is created.
4. **Recorded user acceptance before implementation**: no stage-1 through stage-4 artifact is created before the user's acceptance of this verified plan is recorded. No acceptance is inferred from reviews, transcripts, or agent reports. A separate recorded acceptance of the benchmark pre-registration precedes benchmark execution (section 8).
5. **Independent implementation and testing per artifact**: each skill, agent, and master is implemented and fidelity-tested in its own bounded pass with the other artifacts of its family absent from the fixture (section 9 check 9); a failure in one artifact's test does not block or contaminate another's record.
6. **Behavioral evidence**: walk-throughs and side-by-side documents per section 9; completion claims limited to candidate fidelity.
7. **Stage-gate ordering**: stage 2 consumes only stage-1 passing skills where its definitions cite them; stage 3 masters realize only after their referenced skills pass (checklist section 5); stage 4 executes only after stages 1-3 records exist and the pre-registration is user-accepted (checklist section 3).

## 11. Evidence recording (candidate-local)

All artifacts, fixtures, validation scripts, comparisons, walk-throughs, and evidence are recorded under `candidate/` following the pilot's pattern (`candidate/evidence/`, `candidate/skills/`, `candidate/agents/`, `candidate/benchmark/`):

- plan verification findings (planning-adviser), external-adviser challenge results, and the consolidated summary;
- the recorded user acceptance events (plan acceptance; benchmark pre-registration acceptance) with dates and accepted scope;
- per-skill fidelity results (checks, character counts, isolation listings, scenario outcomes), side-by-side documents, and flagged adjudication items;
- per-agent authority/limits mappings and boundary walk-through results;
- per-master fidelity and composition walk-through results;
- the benchmark pre-registration record and, after execution, results and residual risks;
- residual risk and deviations from this plan, consolidated in a full-flow execution record.

The handoff checklist `handoffs/agentic-development-system-continuity-checklist.md` records only verification events and pointers to candidate-local evidence; it does not hold the evidence itself.

## 12. Out of scope

The following are explicitly excluded from this flow:

- Any change to the live skill catalog, live agents, agent front matter, permissions, or runtime admission (skills draft line 128; target-design line 362 migration notes).
- Any change to `core/`, `as-is.md` records, or any parent-owned record outside `candidate/`.
- Promotion of any candidate artifact to a repository skill or agent; owner and independent-consumer evidence per skills draft line 88 remains for a later adoption decision.
- Tool-access matrices as runtime enforcement; the flow records composition tool requirements as documentation only (skills draft lines 111-129 are planning requirements, line 128).
- Machine-readable skill metadata, registries, dependency schemas, automated compatibility checks, and wholesale replacement of live skills (skills draft lines 957-970).
- Any migration or retirement of live artifacts (target-design section 14 is future adoption work, gated on benchmark results and separately accepted changes).
- Benchmark advancement decisions beyond recording results (target-design line 250 reserves these to the human).

## 13. Decisions requiring the user

1. **Acceptance of this verified plan** (gates 3-4) — authorizes stages 1-3.
2. **Adjudication of the "25 vs 24" catalog count** (section 2 discrepancy flag) — this plan proceeds on 24 defined contracts unless the user directs otherwise.
3. **Master cardinality** (section 7): the default stage 3 realizes exactly the 12 skills-draft masters; accepting the two target-design-only introductions (`developing-target-designs`, target-design:411; `planning-realization`, target-design:413) as thin masters makes the scope 14 and requires this explicit user decision.
4. **Naming review** for the two provisional working names (`as-is-orchestrator`, `design-prototyper`) per target-design line 362, before any adoption; candidate working names are used meanwhile.
5. **Benchmark pre-registration acceptance** (section 8, gate 5) — authorizes benchmark execution and fixes the protocol values.
6. **Any subsequent adoption decision** (owner, independent consumer, validation evidence per skills draft line 88; migration per target-design section 14) — out of this flow's scope regardless of benchmark outcome.