# Agent Instructions

This project adopts the candidate agent workflow (as-is workflow, candidate revision). Setup was performed 2026-08-31 inside this consumer directory only; no enclosing project path was read for or changed by this setup.

- `.agents/agents/<role>` links to the workflow's canonical agent definitions under `/home/vc/dev/as-is/candidate/agents/` (implementer, worker, planning-adviser, external-adviser, target). Roles own responsibility, authority, and delegation; reusable skills are attached per role and never select, authorize, start, or delegate agents.
- `.agents/skills/<skill>` links to the workflow's canonical skill definitions under `/home/vc/dev/as-is/candidate/skills/` (master and reusable tiers). Skills establish fit only; they grant no tools or authority.
- Delegation runs only through the governed launcher (`skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts --agent candidate/agents/<role>/agent.md`) with explicit `--cwd`, `--model`, and budget caps.
- Durable repository records under `records/` remain the authority; private runtime state and conversation history are operational context, never authority.
- The relevant `as-is.md` record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.

Existing project content, instructions, and records are preserved; no canonical resource was copied, and no existing file was overwritten during setup.
