# Component-Builder Backlog

Planning index only; active work belongs to `tasks.md` in this component.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| in-process-authority-alignment | selected | 3 | 3 | Align builder expert gates with the correct same-component authority boundary | Align the builder contract so same-component implementation and expert gates use in-process `call_subagent`, while separately owned component boundaries use `spawning-pi-subagents`. | - | Attributable in-process expert plan and final-diff gates are recorded; contract is scoped and validated; no Phase 2a or migration artifacts are touched; terminal commit is ancestry-integrated by the parent. | Original dependency text: Root authority-alignment task; `.pi/extensions/worker-tools.ts`; component-builder role contract. |
