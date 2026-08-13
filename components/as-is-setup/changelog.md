# Changelog

- Initial component extracted from the setup skill; canonical skills and agents are linked only from their respective bundle folders.
- Replaced the former `skills/setting-up-as-is` skill with the component-owned `as-is-setup` skill and added the component backlog.

- 2026-08-09 reconciliation: removed the completed `host-wiring-adapters`
  planning row after verifying implementation `008accc` is in history and its
  adapter-separation evidence satisfies the row's acceptance. Retained the
  dependent collision/recovery and host-discovery-validation rows as open.

- Added explicit Pi, OpenCode, and generic-agent wiring plans. Pi now projects
  only skills and its prompt alias, OpenCode validates existing JSON before
  updating its skill path and projects skills and agents through `.opencode`,
  and generic-agent setup retains the `.agents` projection. Added malformed
  configuration atomicity and adapter-separation coverage; focused tests,
  syntax validation, and diff checks passed. Residual risk: live host
  discovery was not rerun.

- Added structured persisted client detection with absolute signal paths and
  ambiguity reporting; implicit setup now refuses ambiguous detection while
  explicit client selection remains available.

- Added an explicit canonical resource inventory that scans only top-level
  `skills/<name>/SKILL.md` and `agents/<name>/agent.md` entries in stable order;
  setup now consumes it and focused tests cover exclusion boundaries.

- Recovered `canonical-agent-source-setup-phase-2`: setup now reads canonical
  agents from the bundle's top-level `agents/` directory while projecting to
  client `.agents/agents`; fixtures and durable design documentation were
  updated, with collision and repeat behavior retained.

- Removed the completed `replace-setup-skill` planning row from the component
  backlog; retained all open items and documented that completed work is removed
  from the planning index after its summary is recorded here.
