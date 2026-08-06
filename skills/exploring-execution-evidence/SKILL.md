---
name: exploring-execution-evidence
description: Explores execution traces and readable local Pi session evidence for debugging, process improvement, and budget analysis without granting execution or task authority.
---

# Exploring Execution Evidence

Use this skill when a user-mentioned execution context identifies a trace, run,
phase, worker, component, task, or authorized Pi session and the investigation
needs supplementary evidence. The skill provides a read-only evidence-gathering
procedure. It does not inspect arbitrary files, resolve unscoped private
content, change instrumentation, allocate budget, validate work, or change
task, job, recovery, or completion state.

## Inputs

- A focused question or decision, such as a failure explanation, process
  improvement hypothesis, or budget-allocation comparison.
- The narrowest available selector: an exact trace ID, event-name fragment,
  session ID, or two explicitly comparable trace/session IDs.
- The applicable component/task scope and any requested time, attempt, entry,
  or event limit. Local session inspection uses the effective user's readable
  Pi session files; no tracer-owned approval is required.

If no usable selector or task scope is available, ask for the smallest missing
input or return an explicitly scoped inability to investigate. Do not scan
arbitrary paths or infer a record from conversational similarity.

## Available Queries

Use only bounded read-only tools made available by the role:

| Question | Tool | Limit |
| --- | --- | --- |
| Which events match a known name or trace? | `search_traces` | Small `limit`, up to 100. |
| What happened in one identified trace? | `get_trace` | Small `limit`, up to 100. |
| What is the event/outcome shape of one trace? | `summarize_trace` | One exact trace ID. |
| How do two traces differ? | `compare_traces` | Like-for-like attempts only. |
| What data does one readable session contain? | `analyze_session` | One exact session ID, selectable detail mode, and paged/filtered entries. |

Start with discovery or a summary, then retrieve details when the investigation
needs them. Use `detail: entries`, `messages`, or `full`, with `offset`, `limit`, `role`, and `toolName` selectors for volume control. Keep selectors, limits, result counts, and reasons in the report. Missing or
empty results are observations,
not evidence that the event or session never existed.

## Procedure

1. **Frame the question.** State the decision, task scope, comparison set,
   exact session selector when applicable, and stopping condition. Keep
   debugging, process-improvement, and budget questions distinct when their
   evidence or authority differs.
2. **Discover narrowly.** Query by the supplied trace or session selector with
   bounded limits. Record the tool, selector, result count, and relevant
   timestamps or names. Do not broaden the query merely to obtain a more
   persuasive result.
3. **Inspect and correlate.** Summarize traces before retrieving events. Use
   parent/child spans, phases, outcomes, durations, attempts, roles, and
   approved bounded attributes. For a readable session, use only the returned
   metadata, entry counts, model/provider labels, usage totals, tool names, and
   status classes. Compare only equivalent attempts and measurement sources.
4. **Handle session references safely.** Treat `sessionReference` and session
   IDs as opaque correlation metadata. `analyze_session` resolves one exact ID
   through readable local Pi session stores, including the forwarded source
   store for isolated delegated children and the effective user's other local
   stores when needed. It is read-only and selector-driven, not an arbitrary
   path reader. Missing, inaccessible, expired, or out-of-range sessions remain
   unknowns.
5. **Select before retrieval.** Use summary mode for orientation and detail
   modes plus paging/role/tool selectors for focused investigation. Local
   `entries`, `messages`, and `full` results may include session payloads when
   the debugging question requires them. Never copy them into trace events or
   external trace fields.
6. **Separate evidence from reasoning.** Classify each material statement as an
   observation, inference, unknown, or recommendation. Distinguish telemetry
   and session-reported outcome from task-record status, and observed duration
   or reported usage/cost from an estimate.
7. **Make the bounded decision brief.** Report only findings that answer the
   framed question. Connect process recommendations to observed failure,
   delay, repetition, or missing evidence. For budget analysis, compare
   observed duration and reported usage/cost with sources and uncertainty, then
   recommend a next allocation or measurement action without authorizing it.
8. **Stop or escalate.** Stop when the acceptance need is supported, evidence
   conflicts, limits are reached, or the question requires task-record
   authority. Escalate missing identifiers, unavailable session detail, or
   budget decisions instead of guessing.

## Output Contract

Return a compact report with these sections:

- **Question and scope** — decision, task scope, selectors, limits, and
  comparison eligibility.
- **Observed evidence** — tool calls, result counts, event/session metadata,
  timestamps, relationships, outcomes, durations, and explicitly reported
  usage or cost fields.
- **Sources** — exact tools, selectors, limits, IDs, and source/authority
  labels for each material observation.
- **Inferences** — conclusions tied to observations, with confidence or
  competing explanations where material.
- **Unknowns and session status** — absent data, unavailable references,
  file-access limits, unverified attribution, and retention/query limits.
- **Recommendation** — smallest debugging, process, instrumentation, or
  measurement action supported by the evidence.
- **Budget implications** — observed resource use, comparison basis, reserve
  impact, and a proposed allocation input or follow-up measurement. State that
  task records/control-plane policy authorize allocation; evidence only informs
  it.
- **Residual risk and next action** — what remains unproven and the safest
  bounded follow-up.

## Authority And Privacy Boundaries

- Traces and session evidence are supplementary. Durable task records own
  status, budget, recovery, validation, completion, and descendant closure;
  job runners own runtime job state.
- Evidence can report outcomes, durations, or usage/cost observations but cannot
  accept completion, enforce a budget, authorize work, or convert an estimate
  into actual spend.
- Session references in traces are not session contents. Preserve only the
  opaque ID in trace events and external sinks. Local analysis may retrieve
  prompts, responses, thinking, tool payloads, and other session data when the
  debugging question requires it; avoid copying unrelated secrets or personal
  data into durable reports.
- `analyze_session` must remain exact-ID scoped, read-only, and backed by
  readable local Pi stores. It may return selected session entries through
  explicit detail modes; paging and selectors control volume. It must not
  become an arbitrary path reader or a normal trace-content source.
- External trace sinks receive the session ID only; they never resolve or carry
  local session data.
- Query failures, malformed events, unavailable backends, and missing sessions
  are evidence gaps and must not affect instrumented work.
- Do not mutate traces, sessions, task records, configuration, or runtime state.
  Implementation or policy changes require a separately bounded task.

## Checks

Before reporting completion of an investigation, verify:

- every finding has a named query source and bounded selector; session evidence
  identifies the readable project-local store as its source;
- observations, inferences, unknowns, recommendations, and sources are
  distinguishable;
- session detail retrieval used an explicit mode and selectors, and any raw
  payload reproduced was necessary for the debugging question;
- budget claims identify observed versus estimated values and defer authority to
  task records/control-plane policy;
- the report answers the original question without presenting missing evidence
  as success or failure.

For a documentation or skill change, additionally validate matching front
matter/name/heading, catalog discoverability, privacy and authority boundaries,
and `git diff --check`. No live model or private session-content inspection is
required for structural validation.
