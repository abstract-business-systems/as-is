# as-is Setup

## Purpose

Provide the deterministic setup component that detects persisted client
configuration and exposes the as-is bundle's canonical skills and agents to
that client without copying resources or discovering them from unrelated
locations.

## Design

`setup.ts` is the executable boundary. It treats `skills/` and
`agents/` in the bundle root as the only canonical resource folders.
For each detected client it creates relative symlinks under the client's
host-native `.agents/skills` and `.agents/agents` folders, preserves collisions,
and updates only an existing OpenCode configuration. A Pi prompt alias is
linked when the bundle provides one. Detection is based on persisted files and
folders; an explicit client root can be supplied for automation.

## Links

- [`setup.ts`](setup.ts) — detection, wiring, and JSON-safe configuration update.
- [`setup.test.ts`](setup.test.ts) — focused deterministic filesystem tests.
- [`backlog.md`](backlog.md) — bounded detection, wiring, and validation
  backlog.

## Changelog

- Initial component extracted from the setup skill; canonical skills and agents
  are linked only from their respective bundle folders.
- Replaced the former `skills/setting-up-as-is` skill with the component-owned
  `as-is-setup` skill and added the component backlog.
