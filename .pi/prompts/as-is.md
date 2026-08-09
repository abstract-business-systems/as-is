
Route this request to the repository's canonical `as-is` agent. Do not handle
the request in this host session and do not infer a different role. Launch the
agent through the repository launcher with the request as its task:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent agents/as-is/agent.md \
  --task "$@" \
  --cwd "$PWD" \
  --approve
```

Return the launched agent's result to the user. The agent contract, durable
records, launcher admission, and supplied target descriptions remain
authoritative; this prompt is only the host entrypoint.
