---
name: setting-up-as-is
description: Sets up as-is for the current or user-selected CLI or agent host. Use when installing, wiring, configuring, or verifying as-is integration.
---

# Setting Up as-is

Set up the current repository as an `as-is` bundle for a supported CLI or agent
host. Prefer detection from the active repository and environment; ask the user
to select a host only when detection finds multiple viable targets or none.

## Scope

- Configure the host to discover this repository's `skills/` directory.
- Preserve existing host configuration and validate the host's configuration
  schema before editing it.
- Verify discovery using the host's available non-destructive inspection
  command.
- Explain any host restart requirement after configuration changes.

Do not add credentials, user-local paths, caches, session state, or generated
runtime state to the repository. Do not invent a generic adapter when a
host-specific adapter has not been designed.

## Host Detection

1. Inspect the repository for supported host configuration.
2. If exactly one supported host is configured, use it.
3. If the user names a supported host, use that host instead of detection.
4. If the target is ambiguous, ask one concise question naming the detected
   options.
5. If the selected host is not yet supported, record the missing adapter as the
   next design task instead of guessing its configuration format.

## OpenCode

For OpenCode, configure `.opencode/opencode.json` with a `skills.paths` entry
of `skills`, which resolves from the project root to the repository `skills/`
directory. Keep the required
`$schema` field and all unrelated configuration intact.

Validate the JSON after editing. Then use `opencode debug config` and
`opencode debug skill`, or an equivalent available command, to confirm the
configuration is accepted and the skills are discoverable. If the host accepts
the configuration but does not expose the configured skills while it scans
`.agents/skills`, create relative symlinks from that directory to each
canonical `skills/<skill-name>` directory. Do not copy the skills. Record the
effective host behavior as an adapter limitation. OpenCode loads configuration
and skills at startup, so tell the user to restart OpenCode after any change to
configuration, skills, or skill symlinks.

## Completion Evidence

Report the selected host, changed files, discovered skill names, validation
command and result, and any required restart.
