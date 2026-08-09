# Agents Backlog

Planning index for the `agents/` component. Active work belongs to the
owning component task record; completed items are removed after their summary
is recorded in the owning changelog.

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| generic-agent-specialization | open | 3 | 2 | Downsize agent prompts while retaining justified authority boundaries | Migrate one agent at a time by moving reusable operational flow into globally available skills; begin with component-builder, then assess execution-advisor, expert, and worker. Keep as-is user-intent detection and routing role-owned rather than extracting a shared routing skill. Do not add skills to agent front matter. | - | Each changed agent has a materially smaller role contract; extracted procedures have explicit inputs, outputs, stopping conditions, and evidence; current deterministic and applicable live-gated behavior tests remain passing; skills never select, launch, delegate, or mutate task authority; each agent migration has its own bounded task, expert gates, changelog, and scoped commit. | Clarified by the user after reviewing `designs/skills-agents-separation-plan.md`. First implementation target: `component-builder`, using existing `skills/building-components/` and supporting skills where possible. Provisional future execution-advisor skill name: `evidence-based-consultation`, subject to naming review. |
