# Spawning-Pi-Subagents Configuration

The `spawning-pi-subagents` launcher consumes two related configuration surfaces from the effective root JSON companion.

## Project Temporary Directory

`configuration.dirs` is the repository-owned object for directory settings. Its `project-temp` member is a relative project-temporary directory base and defaults to `.as-is`. This directory setting is descriptive configuration; launcher paths are configured literally and are not templated.

The root repository configuration currently declares:

```json
{
  "configuration": {
    "dirs": {
      "project-temp": ".as-is"
    }
  }
}
```

The project temporary directory is private runtime state. It is not task authority, configuration authority, a public metadata value, or a durable architecture record.

## Durable Session Store

`configuration.agents.sessionDirectory` is the launcher-owned durable Pi session directory. Its default is `.as-is/subagents/sessions`, resolved relative to the project root. A configured absolute path is used as supplied; a configured relative path is resolved from the project root; `~` and `~/...` remain home-relative paths. The launcher does not interpret templates or substitute `configuration.dirs["project-temp"]` into this value.

Ordinary and validation sessions use this store unless an ordinary launch explicitly opts out with `--no-session`. Validation launches remain durable. Session UUIDs and display names are independent values; the directory is only a storage location and is never a session selector or public handle field.

## Ownership

The generic configuration resolver parses and cascades JSON companions. This skill owns the launcher interpretation of `configuration.agents.sessionDirectory` and its `.as-is/subagents/sessions` default. The root configuration owns the repository-wide `configuration.dirs` object; it does not template launcher paths. Provider session identity remains outside this configuration surface.
