# Proposed Design-First Dynamic-Component Benchmark

## Status

Planning record only. No fixture, scored provider execution, repository artifact, consolidation, or live architecture change is authorized by this record.

## Decision captured

The next candidate must be tested on a task that genuinely exercises its added capabilities. The task must require design-first work, distinguish current design from planned design, and require a minimum implementation whose component boundaries are identified dynamically. The current composition must be freshly measured on the same task; prior current-arm results are historical context, not a valid baseline for this new capability set.

## Candidate C

Candidate C is a portable design-first thin arm. It uses the isolated Candidate B operating surface and adds semantic guidance to:

1. inspect the existing system before changing it;
2. capture the current design as an observation of what exists;
3. record a separate planned design before implementation;
4. identify the minimum meaningful component or component set from responsibility, boundary, lifecycle, and relationship evidence;
5. implement only the minimum required scope;
6. validate implementation against the planned design without overwriting current design;
7. report current design, planned design, identified components, implementation evidence, assumptions, and residual risk.

Candidate C must not prescribe filenames, folders, frontmatter, schemas, headings, fixed component counts, or directory-based ownership. The host must enforce permissions, isolation, budgets, delegation, validation, recovery, and completion.

## Three benchmark arms

Run the same fresh fixture, task, model, budgets, launcher, hidden evaluator, and validity rules for:

1. **Current composition:** the full current component-builder composition and design-management procedures, freshly measured on this task.
2. **Candidate B:** the existing isolated thin arm with minimal tools and no explicit design-first component-management guidance.
3. **Candidate C:** the same isolated tool and filesystem surface as Candidate B, with design-first and dynamic-component guidance added.

The comparisons are:

- current versus Candidate B: capability and efficiency loss from the current architecture to the portable baseline;
- Candidate B versus Candidate C: value added by design-first and dynamic-component guidance within the portable surface;
- current versus Candidate C: whether the portable design-first candidate approaches current behavior without restoring the full architecture.

The earlier current, Candidate A, and Candidate B measurements remain historical context and must not be pooled numerically with this new task's results.

## Task requirements

Use a fresh disposable task rather than extending the incident-report fixture. The fixture should contain a small existing application with meaningful responsibilities but no predeclared component map or child ownership slices. The requested feature should be bounded but require inspection and a design decision.

The task should require the agent to make the feature change while preserving an evidence-supported account of the existing design, recording the intended design separately before implementation, identifying the minimum meaningful components dynamically, and implementing only the necessary component scope.

Delegation, if used, must be derived from the design and component findings rather than supplied as fixed parse/correlate/present slices. A correct solution may use one component and no delegation when the evidence supports that minimum.

## Shared semantic acceptance

All arms use the same acceptance conditions:

- current design describes observed pre-change behavior;
- planned design is distinct from current design;
- current design is not overwritten by the plan;
- component boundaries are supported by responsibility, boundary, lifecycle, or relationship evidence;
- the minimum necessary component scope is implemented;
- no unnecessary components or unrelated changes are created;
- implementation matches the planned design;
- public and hidden behavior checks pass;
- validation, assumptions, and residual risk are reported truthfully.

The hidden evaluator should assess semantic content rather than require one document layout or record schema.

## Metrics

Record separately for every arm:

- current-design capture quality;
- current/planned design separation;
- planned-design clarity;
- dynamic component identification quality;
- minimum-scope discipline;
- implementation correctness;
- design-to-code alignment;
- unnecessary component creation;
- delegation quality and retry/recovery behavior;
- validation quality;
- completion and handoff truthfulness;
- cost, tokens, latency, retries, and human intervention.

## Disqualifying failures

A repetition is invalid or fails acceptance for hidden-test access, harness mutation, unauthorized scope expansion, implementation before required design evidence, overwriting current design with planned design, directory-only component claims, unsupported component invention, false completion claims, or hidden-test custody failure.

Infrastructure-invalid repetitions must be separated from semantic failures and may be rerun only under the preregistered validity rule.

## Controls and budgets

Initially retain the prior large-preset controls for comparability:

- same model and reasoning level across arms;
- parent wall-clock limit: 900 seconds;
- parent provider-cost cap: USD 2.00;
- child wall-clock limit: 420 seconds;
- child provider-cost cap: USD 0.50;
- one retry slot;
- same launcher, worktree containment, hidden-test custody, and evidence capture.

Run a provider-free pilot before scored execution to verify dynamic component recording, current/planned separation checks, sandbox boundaries, child admission, retry accounting, hidden-test isolation, and cost capture.

## Required preregistration before scored execution

Freeze:

- exact Candidate B and Candidate C instruction sources;
- current-arm composition and tool/context surface;
- fixture revision and task text;
- hidden evaluator custody and semantic checks;
- arm order randomization;
- repetition count and validity rules;
- budgets, retry allowance, and stop criteria;
- metrics and treatment of infrastructure-invalid runs;
- human owner for deciding whether evidence supports later productionization.

## Open decisions

- Select the concrete fresh task family and ensure it does not contain predeclared component ownership.
- Decide the minimum semantic evidence required for current and planned design records without prescribing their document structure.
- Decide whether delegation is an optional measured behavior or a required part of the task.
- Select the number of valid repetitions and total cost ceiling.
- Decide whether Candidate B and Candidate C use the same disposable child-agent wrappers and external launcher.
- Confirm that current, Candidate B, and Candidate C are all freshly measured on the same task before interpreting capability differences.

## Prior evidence context

The prior valid large-preset current baseline averaged USD 0.69024175, 264.663 seconds, and 1,546,701.5 tokens across two runs, with 2/2 completion, hidden acceptance, and initial parallel admission. The prior isolated Candidate B averaged USD 0.52750805, 223.718 seconds, and 1,091,150 tokens across two runs, with 2/2 completion, hidden acceptance, and initial parallel admission. These figures provide context only; they are not the new task baseline.

## Recovery and compaction handoff

No fixture or scored run has started. Before continuing after compaction, read this plan together with `/tmp/thin-portable-benchmark-checkpoint-2026-09-07.md`, `/tmp/thin-portable-parallel-child-benchmark-plan.md`, and `/tmp/thin-agents-isolated-followup-summary-2026-09-07.md`. Do not create the fixture or contact the provider until the open decisions and human-alignment gate are resolved.
