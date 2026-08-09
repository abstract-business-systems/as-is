# Component-Scoped Context Resolution

## Purpose

Define a component-building execution model that minimizes ambient context while
preserving legitimate project-tool behavior and on-demand access to linked
resources.

## Proposed model

- Start the component agent with the component directory as its working
  directory.
- Keep launcher-owned repository operations anchored to the canonical repository
  root rather than relying on the child working directory.
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

## Open design questions

1. Which configuration formats and project checks should the first resolver
   support?
2. Which local project metadata is needed by the supported tools, and how should
   sensitive configuration be redacted?
3. What host/runtime sandbox or tool-path mediation can enforce the component
   read/write boundary?
4. Which remote hosts, if any, are permitted, and what retention/caching policy
   preserves reproducibility?
5. How should a human-authorized diagnostic retrieve bounded raw source when an
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
  reader.

This document is planning context only. It does not authorize implementation,
network access, sandbox changes, or changes to task authority.
