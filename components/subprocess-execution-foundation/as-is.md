
# Subprocess Execution Foundation

## Purpose

Own the cross-cutting, host-neutral launch foundation that submits a bounded
worker attempt without making the submitting as-is/OpenCode/orchestrator turn
wait for worker completion.

## Changelog

- The historical Pi delegation investigation found that synchronous nested
  delegation, repeated recovery, blind waiting, and missing supervisor-owned
  enforcement materially increased elapsed time. The detached process-group
  foundation addressed the launch/lifecycle boundary; host capability and
  attribution limitations remain source-labelled residual risk.
- The shared task-record protocol and host-neutral execution contract remain
  external governing documents; this component implements only the supervisor
  portion of those boundaries.

## Links

- `changelog.md` — concise completed-task history.
