# Skills Instructions

- Procedures, contracts, authority, inputs, outputs, and acceptance conditions use declarative language.
- Repeatable policy enforcement, discovery, validation, task lifecycle, and cleanup use deterministic scripts.
- Skills remain composable and focused. Reusable flow logic belongs in skills rather than duplicated agent role prompts.
- Skills are reusable procedures, not authority-bearing callers. Skills do not select, authorize, start, observe, recover, cancel, or delegate agents. Authority-bearing agents and orchestrators retain launch, approval, observation, recovery, cancellation, and delegation authority. A mechanical adapter invoked from a skill does not transfer that authority.
- Each skill SHOULD have a validating live test that exercises its behavior through its supported interface. A skill without a live test records the reason and residual risk.
