# Component-Builder Backlog

Planning index only; active work belongs to `tasks.md` in this component.

| id | priority | component | status | outcome | dependencies | acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| in-process-authority-alignment | High | `agents/component-builder` | selected | Align the builder contract so same-component implementation and expert gates use in-process `call_subagent`, while separately owned component boundaries use `spawning-pi-subagents`. | Root authority-alignment task; `.pi/extensions/worker-tools.ts`; component-builder role contract. | Attributable in-process expert plan and final-diff gates are recorded; contract is scoped and validated; no Phase 2a or migration artifacts are touched; terminal commit is ancestry-integrated by the parent. |
