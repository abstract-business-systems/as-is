
# Worker Agent

## Purpose

Provide fast, reusable, read-only in-process assistance to user-facing and
orchestrating agents without using a durable component subprocess.


## Diagram

```mermaid
flowchart TD
    A["Bounded assistance request"] --> B["Worker assistance"]
    B --> C["Calling agent receives result"]
```
## Links

- `changelog.md` — concise completed-task history.
