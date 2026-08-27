# Target-design author plain-language explanation for Section 18

Purpose: Explain the three disputed Section 18 topics in practical language and recommend how to retain them without turning them into a technical questionnaire.

## Status and authority

This is a bounded, read-only author recommendation. It does not approve draft 10, adopt target contracts, create tasks, authorize kick-off, or authorize implementation. `startsWork: false`. Current `as-is.md` records remain current-state authority.

## Direct recommendation

Keep all three topics in Section 18, but reframe them as short, plain-language safeguards. Put detailed mechanics in the relevant implementation, safety, setup, migration, and evaluation sections.

The human should not need to understand engineering terminology to know the practical question: **what could go wrong, what is being promised, and what must be checked before proceeding?**

## 1. Before replacing or removing something, find out who still uses it

### What it means

Before renaming, replacing, or removing an existing agent, skill, workflow, file, or behavior, find out what still depends on it. “Users” can include people, scripts, projects, tests, or other tools.

### Example

Before renaming `implementing-component-tasks`, search the repository for references in agent records, skills, setup scripts, documentation, and tests. Record which references need updating and which behavior must remain compatible.

### Why it matters

The proposed rearchitecture changes existing agents, skills, and workflows. Removing something without checking its users could silently break current development or setup.

### What the human needs to decide

The human does not need to approve every search. The human needs to decide whether a particular replacement, rename, or removal is acceptable after its affected users and migration path are known. This is normally an implementation/admission issue, not a separate decision about unrelated work.

### Options and impact

- **Require an affected-user check before each retirement or replacement — recommended.** Prevents avoidable breakage while allowing unrelated design and proof work to continue.
- **Require one complete inventory before any work begins.** Safer for a broad migration, but delays work that does not affect existing users.
- **Wait until implementation to check.** Faster initially, but risks discovering breaking dependencies too late.
- **Skip the check.** Not recommended because breakage may be silent.

### Plain-language disposition

Keep this in Section 18 as a scoped blocker: no replacement, rename, deprecation, or removal proceeds until its affected users and migration steps are recorded. It does not block the entire design.

## 2. Keep automated work from touching the wrong things

### What it means

“Isolation” means keeping automated work from accidentally changing the wrong files, reading private information, contacting outside services, or interfering with another project. A separate Git worktree is only a separate working directory; it is not a complete safety barrier.

### Example

A child builder may work in its own Git worktree, but that alone does not prove it cannot read files elsewhere, access credentials, use the network, or alter protected tests, fixtures, or scoring files.

### Why it matters

The proposed system is intended to perform work with substantial independence. The design must distinguish safety that is merely requested in instructions from safety that the host actually enforces.

### What the human needs to decide

For ordinary repository-local, credential-free work, the human may accept limited controls if their limitations are stated. For high-risk work involving secrets, external systems, destructive actions, or untrusted repositories, the human must decide whether to wait for enforced safeguards or explicitly accept the risk. This is normally an implementation/admission issue and becomes a human-envelope decision for higher-risk work.

### Options and impact

- **Classify work by risk and require stronger controls for higher-risk work — recommended.** Low-risk proof work can proceed honestly; high-risk work stops unless the host enforces the needed boundaries or the human explicitly decides otherwise.
- **Require enforced isolation for every task.** Strongest protection, but likely prevents the first repository-local proof and may claim capabilities not yet demonstrated.
- **Describe the safeguards only in technical sections.** Keeps Section 18 shorter, but makes it easier to overlook whether work is safe to admit.
- **Leave the issue unclassified.** Not recommended because nobody can tell what may safely proceed.

### Plain-language disposition

Keep a short version in Section 18 as an admission safeguard. Put detailed control mechanics in the relevant safety, host, and task-control sections. State plainly that prompts and worktrees are not the same as enforced isolation.

## 3. Do not promise installation and upgrades before testing them

### What it means

Do not promise that the system can be installed, upgraded, downgraded, removed, or used across multiple projects until those behaviors have actually been tested.

### Example

The first proof may show that a project can use the system directly from this repository. That does not prove that an independently installed version can upgrade safely, uninstall cleanly, keep two projects’ settings separate, or work with different providers.

### Why it matters

Readers may interpret a design description as a support promise. Overstating what has been tested creates expectations the system cannot yet reliably meet.

### What the human needs to decide

The human only needs to decide how broad the initial claim should be and, later, whether evidence supports broader distribution promises. Choosing a package format or release model now is an implementation/admission issue and can safely be deferred.

### Options and impact

- **Claim only the repository-local behavior demonstrated by the first proof and defer broader promises — recommended.** Permits useful evaluation without pretending that packaging and upgrades are solved.
- **Choose a distribution model now.** May simplify planning, but creates early compatibility and support obligations.
- **Move all discussion to setup and distribution sections.** Technically tidy, but removes the Section 18 warning that these promises remain unproven.
- **Make broad promises now or omit the topic.** Not recommended; either choice invites unsupported assumptions.

### Plain-language disposition

Keep a short warning in Section 18 and put the detailed testing plan in setup, migration, and evaluation sections. Make no promise of independent installation, upgrades, downgrades, uninstall, multi-project separation, or provider portability until setup-inclusive evidence supports it.

## Related clarifications retained

- Each component’s `as-is.md` is the anchor for that component’s design package. Prototypes, plans, implementation packets, results, and evidence link back to it but do not silently replace its current-state authority.
- Child plan injection is part of one parent bounded task. Different agents may perform subtasks, but that does not turn plan injection into a separate product task, lifecycle phase, or human approval.
- The parent accounts for child outcomes, while the child owns its implementation, child-level checks, and integration of its own result. A separate parent-level control checks plan injection and launch readiness; it does not review the child’s implementation.
- Section 19 remains good as a provisional-contract map. It should guide later bounded work without pretending that target contracts have already been adopted.

## Author recommendation for the successor

Revise Section 18 so each of these topics begins with a plain-language heading and a short practical disposition. Show the recommendation and practical consequence first; put technical terms, evidence requirements, and detailed controls after that explanation or in linked sections.

Retain the broader human-cognitive-load principle: present the smallest sufficient information for the next safe decision or action while preserving traceability. Continue recommending that every human-facing Markdown artifact begin with a title followed immediately by a succinct `Purpose:` line.

This memo recommends a successor revision only. Preserve draft 10 unchanged unless the design owner creates a successor packet with a new manifest, digest, and bounded review. No design adoption or implementation authorization is implied.
