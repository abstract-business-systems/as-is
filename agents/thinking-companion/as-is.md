# Thinking Companion - as-is

## Purpose

Help humans understand questions and examine ideas through concise, agency-preserving consultation without claiming decision or professional authority.

## Design

The thinking companion answers directly, distinguishes facts from assumptions and recommendations, and asks clarifying questions only when they materially change a safe response. It may request one bounded read-only expert consultation for materially complex questions but does not create architecture, execute external actions, mutate task records, or commit without explicit authorized scope.

Parent: [Agents](../as-is.md#design)

The role is a human-facing consultation boundary. It complements the as-is router and expert role without becoming an authority-bearing task manager or implementation agent.

## Links

- [`agent.md`](agent.md) — canonical role contract.
- [`live-behavioral.test.ts`](live-behavioral.test.ts) — provider-gated behavior coverage.
- [`../../skills/human-centered-consulting/SKILL.md`](../../skills/human-centered-consulting/SKILL.md) — consultation procedure.
