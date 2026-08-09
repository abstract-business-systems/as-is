# Component-Scoped Context Resolution

## Purpose

Define a component-building execution model that minimizes ambient context while
preserving legitimate project-tool behavior and on-demand access to linked
resources.

## Proposed model

- Start the component agent with the component directory as its working
  directory.
- Derive project context from the launching client's current working directory;
  the requested component directory identifies the target but does not redefine
  the project root.
- Keep launcher-owned repository operations anchored to the resolved project
  root rather than relying on the child working directory or requiring Git for
  project-context discovery.
- Do not inject project configuration or linked-file contents into the prompt.
- Provide specialized resolver/check tools for project-level configuration and
  tool outcomes.
- Let the agent resolve relative and remote links on demand through those tools;
  do not require a user-authored dependency declaration for each link.
- Keep raw filesystem reads bounded to the component and other policy-approved
  resources.

## Scope distinctions

| Scope | Default treatment |
| --- | --- |
| Component files | Readable through bounded tools; component is the default relative context. |
| Project configuration | Resolved through specialized tools or a small approved configuration surface; availability does not imply unrestricted project reads. |
| Relative links | Resolved from a trusted base reference, canonicalized, and policy-checked. |
| Remote links | Resolved only through a mediated, non-credentialed, bounded resolver. |
| Sibling/parent files | Not readable through raw tools unless the policy explicitly permits the resource. |
| Tool execution | Project-aware where required, but separate from the agent's content-read scope. |

## Resolver principles

The resolver, not the model, enforces access. It should:

- accept logical references and a trusted base rather than arbitrary unrestricted
  paths or destinations;
- canonicalize local paths and validate symlink, traversal, include, and
  redirect targets;
- deny unsafe schemes, credential-bearing URLs, private/link-local/metadata
  network targets, and unapproved cross-origin redirects by default;
- impose bounds on recursion depth, fan-out, bytes, elapsed time, and response
  size;
- never execute downloaded code, plugins, templates, or dynamic configuration;
- return effective structured values or bounded extracted content by default;
- mark results as complete, incomplete, filtered, or truncated explicitly;
- attach bounded provenance including canonical source, redirect chain where
  relevant, content hash, media type, retrieval time, and policy decisions;
- treat resolved content as untrusted data, not as instructions or authority.

Project checks such as linting, testing, or type checking should be preferred
when the agent needs an outcome rather than configuration internals.

## Preparation-time `as-is.json` data

`as-is.json` is an extensible machine-readable data holder paired with
`as-is.md`; it is not required to have a fixed top-level schema. The first
resolver slice is additive: the existing YAML front matter in the root
`as-is.md` remains the authoritative project configuration source, and this
resolver does not migrate or reinterpret it.

During preparation, the resolver may traverse the relevant repository-to-target
component chain and read each available `as-is.json`. It produces an in-memory
effective view without copying inherited values back into source files. The
resolver may classify useful data into views such as `configuration`, `state`,
metadata, links, and unclassified data. Classification is a tool view, not a
requirement that authors organize every key in advance.

The initial behavior is intentionally narrow:

- configuration data may cascade from repository to parent to target;
- state is normally component-local;
- unclassified data is preserved locally and is not automatically cascaded;
- malformed applicable JSON produces an incomplete or failed result;
- provenance and diagnostics accompany the result;
- task records remain the authority for active task state;
- source files are never rewritten by resolution.

The preparation result is execution input, not policy authority. A temporary
materialized result may be introduced later if retries or independently
launched workers need to reuse the exact resolution, but persistence is not
required for the first slice.

## Open design questions

1. What logical component reference and parent-chain discovery contract should
   the first resolver expose?
2. Which configuration data is sufficiently understood to cascade, and how are
   conflicts or malformed values reported?
3. Which local project metadata is needed by supported tools, and how should
   sensitive configuration be redacted?
4. What host/runtime sandbox or tool-path mediation can enforce the component
   read/write boundary?
5. Which remote hosts, if any, are permitted, and what retention/caching policy
   preserves reproducibility?
6. How should a human-authorized diagnostic retrieve bounded raw source when an
   effective result is insufficient?

## Acceptance direction

A future implementation should demonstrate that:

- the child starts in the component directory while launcher operations still
  use the repository root;
- project-level lint/test configuration works without exposing the whole project
  tree through raw reads;
- relative and approved remote links resolve on demand through bounded tools;
- unauthorized sibling, parent, symlink-escape, private-network, and
  credentialed-resource access is denied;
- results retain provenance and clearly report incomplete resolution;
- the agent cannot use the resolver as a disguised unrestricted file or network
  reader;
- preparation can resolve distributed `as-is.json` data without duplicating
  inherited values into source files or replacing the current root configuration
  authority.

This document is planning context only. It does not authorize implementation,
network access, sandbox changes, or changes to task authority.
