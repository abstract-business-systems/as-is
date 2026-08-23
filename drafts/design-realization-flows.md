The design realization flow and itts allied flows are to be in a document for a planned drafting skill. In the current iteration the idea is to drop every existing skill and create the new skills and have them do tasks and build components and compare them with a versions of the same done by existing skills. IE: The approach is rapid prototype and comparison with the old system.

## Design
- Planning and updating as-is documents across the project is done by a single agent or done interactively. Building components is through subagent delegation for ever component.
- Any skill could be triggered on demand.

## Philosophy
- Code is liability.

## On the skills

1. building-context:
	- What's provenance bearing context?
	- What's the purpose behind escalation?
	- How to build differing context for components and non-components? Another skill could draw the FS / context boundary of the component, under which this could operate. This needs a decision on defining component context boundary.
	- Or it might be two skills: building-component-context and this one.

2. resolving-scope:
	- Changes by default are scoped to the project. When as-is compnents are involved (at any level) the agent should stop at updating the as-is document, instead of implementation. Once an as-is component is encountered, an as-is flow starts, Have to decide on whether it's interactive / subagent driven.

3. identifying-owners:
	- as-is documents marks the components.
	- When no as-is document is available, the root acts like a component (may be after adding an as-is).

4. locating-changelogs:
  - not just changelog, but backlog etc are also located with the help of a tool and a configured dir name. We might need a managing changelogs skill though.

5. choosing-names:
  - Follow the patterns from the config file. Record new exploration into config.

6. structuring-content: something similar to the current skill will help. It might need some redundancy reduction and compation, though.

7. drafting-content:
	- Could use a better name.
	- In initial stages. We'll go with the current design and evolve.

8. writing-code: aligned.

9. applying-bounded-edits:
	- Should the name specify additions and deletions too?

10. writting-tests:
	- should take wall clock time into account.
	- Focuses on what's in the design document.
	- New plans propogated to the deisn document befor tests are written.

11. running-tests
	- What does "Limits and next Check" mean?

12. validating-change
	- ACs cascade from global to local
	- Should validate the minimal possible change constraint.

## Missing skills

1. building-knowledge:
	- stores knowledge at a component level, in a preconfigured file name or utilizes a skill or tool to do the same, ex: utilizing store-config to record inferred config.
2. seeking-advise
3. escalating
4. architecting
5. standardizing:
	- For new implementations look for existing standards and practices.
	- For existing ones, try to extract from the implementation.
	- Use the building-knowledge skill to record this.
	- Needs a better name.
