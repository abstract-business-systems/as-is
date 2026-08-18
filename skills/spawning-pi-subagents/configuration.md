# Spawning-Pi-Subagents Configuration

The `spawning-pi-subagents` launcher consumes two related configuration surfaces from the effective root JSON companion.

## Project Temporary Directory

`configuration.dirs.project-temp` is the repository-owned project-temporary directory base. It is resolved relative to the project root when relative and defaults to `.as-is`. The literal `<project-temp>` in a launcher-owned path expands to this resolved directory; it is a placeholder, not a literal filesystem directory.

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

`configuration.agents.sessionDirectory` is the launcher-owned durable Pi session directory. The repository default is `<project-temp>/subagents/sessions`, which resolves to `.as-is/subagents/sessions` under the project root. A configured absolute path is used as supplied; a relative path is resolved from the project root; `~` and `~/...` remain home-relative paths. The `<project-temp>` placeholder may be used to place a custom session subdirectory under `configuration.dirs.project-temp`.

Ordinary and validation sessions use this store unless an ordinary launch explicitly opts out with `--no-session`. Validation launches remain durable. Session UUIDs and display names are independent values; the directory is only a storage location and is never a session selector or public handle field.

## Ownership

The generic configuration resolver parses and cascades JSON companions. This skill owns the launcher interpretation of `configuration.agents.sessionDirectory` and the `<project-temp>` expansion used for its session store. The root configuration owns the repository-wide `configuration.dirs.project-temp` value. Provider session identity remains outside this configuration surface.
