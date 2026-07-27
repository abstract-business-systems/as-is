---
name: setting-up-as-is
description: Sets up as-is for the current or user-selected CLI or agent host. Use when installing, wiring, configuring, or verifying as-is integration.
---

# Setting Up as-is

Set up the current repository as an `as-is` bundle for a supported CLI or agent
host. Prefer detection from the active repository and environment; ask the user
to select a host only when detection finds multiple viable targets or none.

## Scope

- Configure the host to discover the active as-is bundle's skills for the
  calling project, whether the calling project is this repository or another
  repository.
- Preserve existing host configuration and validate the host's configuration
  schema before editing it.
- Verify discovery using the host's available non-destructive inspection
  command.
- Explain any host restart requirement after configuration changes.

Do not add credentials, user-local paths, caches, session state, or generated
runtime state to the repository. Do not invent a generic adapter when a
host-specific adapter has not been designed.

## Host Detection

1. If the user names a supported host, use that host instead of detection.
2. Detect the active host from the current process before inspecting repository
   configuration. Pi sets `PI_CODING_AGENT=true` for CLI and RPC processes;
   Pi commands also commonly expose `PI_SESSION_ID`, `PI_PROVIDER`, `PI_MODEL`,
   or `PI_CODING_AGENT_DIR`. Treat these as Pi evidence. Do not use command
   availability alone because both Pi and OpenCode may be installed.
3. Inspect the repository for supported host configuration.
4. If exactly one supported host is configured, use it.
5. If the target is ambiguous, ask one concise question naming the detected
   options.
6. If the selected host is not yet supported, record the missing adapter as the
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

## Pi

Pi discovers project prompts from `.pi/prompts/` and project skills from
`.pi/skills/` or `.agents/skills/`. It does not discover `.agents/prompts/`.
For a bundle used by another calling project, the dedicated setup skill exposes
the canonical bundle resources with relative symlinks; it does not use Pi
package installation, copy the skills, or write absolute bundle paths into the
calling project.

First identify the as-is bundle root from this skill's location. From the
calling project's root:

1. Create `.agents/skills/` if it does not exist.
2. For each canonical `<bundle-root>/skills/<skill-name>` directory, create a
   relative symlink at `.agents/skills/<skill-name>`.
3. Create `.pi/prompts/` if it does not exist.
4. Create a relative symlink at `.pi/prompts/as-is.md` to the bundle's
   `.pi/prompts/as-is.md`.
5. Preserve an existing non-symlink target; do not overwrite a collision.

The symlink targets remain owned by the as-is bundle, while the calling project
gets the host-native Pi discovery locations. Relative links keep the setup
portable when the calling project and bundle are moved together.

When this repository itself is the calling project, its checked-in
`.pi/settings.json` points at the canonical root `skills/` directory and its
`.pi/prompts/as-is.md` supplies the same prompt alias. Do not edit
`.opencode/opencode.json` when Pi is the active host.

```bash
pi
```

After the calling project is trusted, a no-argument `pi` launch loads the
symlinked bundle skills and registers the bare `/as-is` prompt alias. When this
repository is the calling project, it loads the same resources from its local
`.pi/settings.json`. To start with only the skill entrypoint for a one-off
inspection, use the bundle-qualified path:

```bash
pi --skill <as-is-bundle-root>/skills/as-is
```

Pi exposes skills as `/skill:<name>` commands, so `/skill:as-is` remains the
direct skill invocation. The bundle's `.pi/prompts/as-is.md` resource adds the
shorter `/as-is` alias without duplicating the skill body.

Validate the selected Pi executable and the explicit path without contacting a
provider:

```bash
pi --version
pi --help
```

Project resource or symlink changes require a fresh Pi process. The first
interactive launch may ask for project trust; approve the project or use
`/trust`, then restart `pi`. Do not persist Pi session state, trust decisions,
caches, or user-local paths in the repository.

## Completion Evidence

Report the selected host, changed files, discovered skill names, validation
command and result, and any required restart.
