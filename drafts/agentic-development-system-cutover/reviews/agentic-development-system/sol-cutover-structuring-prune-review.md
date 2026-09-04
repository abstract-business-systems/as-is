# Sol planning review — cutover structuring, runtime re-home, and prune approach

Consult recorded 2026-09-03 (planning-adviser, `@preset/abs-medium`, thinking high; session `a9597ca3`; task packet: /tmp/sol-cutover-structuring-consult.txt). Reviews the approach artifact `drafts/agentic-development-system-cutover-structuring-prune-approach-draft1.md`.

1. **Q1 — Recommend O2, with a record-boundary correction.**

   O2 is the better pre-merge choice. It preserves the existing record pattern with small structural diagrams: the master and reusable diagrams contain 12 and 23 immediate children respectively, while a flat catalog would require a roughly 39-node structural diagram. A 39-node diagram can be made valid, but it would be materially harder to read and maintain.

   O2 also separates two concerns cleanly:

   - the `master/` and `reusable/` records describe physical storage groupings;
   - the catalog classification table describes the authoritative capability classification.

   The catalog must stop implying that “master” and “reusable” are semantic or authority boundaries. The classification table should be the authoritative answer to whether each skill is a composition authority or composable procedure. The existing container `Components` tables and diagrams should continue to contain exactly their immediate declared children; the classification table must not be treated as a second structural hierarchy.

   O2 retains some physical coupling, but the catalog classification table makes later flattening or regrouping possible without first redefining the capability model. O1 would offer the cleanest eventual layout, but its larger rewrite and poor diagram density are not justified for this cutover.

   **Required correction / BLOCKER:** runtime homes moved to `core/` and `tools/` must not be listed as immediate `skills/as-is.md` children. That would violate the filesystem hierarchy and the structural-record rule. Their own records should be declared by their actual parents (`core/adapters/as-is.md` and `tools/as-is.md`); `skills/as-is.md` may cross-reference them in an ownership or runtime-support table, but not claim them as children.

   **Residual risk:** the words “master” and “reusable” will remain in paths and lineage navigation even after their semantic distinction is removed. The records must state plainly that these are storage namespaces, not capability classes.

2. **Q2 — The proposed homes are mostly accurate, but `launcher` should be resolved before implementation.**

   - `tools/as-is-validators` is an understandable name for several repository-facing validator programs, although it does not naturally fit the current `tools` description of agent-facing tools. Accept it only if the parent `tools` record explicitly includes bounded repository validation utilities. If these programs remain strictly content-test infrastructure, a validation-oriented parent would be semantically cleaner, but creating a new top-level category would exceed the smallest-change scope.
   - `tools/backlog-query` is accurate and convention-consistent.
   - `tools/mermaid-renderer` is accurate for the renderer runtime, provided the record distinguishes rendering mechanics from the Mermaid skill and from `.pi` registration.
   - Putting the launcher under `core/adapters` rather than `tools` is correct. It maps governed execution to the Pi/process host surface and does not itself constitute an agent-facing semantic tool. `tools/agent` should continue to own semantic agent operations such as `call_subagent`; the launcher should not become a second tool or task authority.

   The concern is the leaf name `core/adapters/launcher`. The repository’s architecture vocabulary already describes this broader responsibility as a Pi adapter: Pi invocation, session/model details, registration, and transport-specific mechanics. The proposed home contains the launcher, worker-tools registration boundary, and Pi dependencies, not merely a generic launcher.

   **Recommendation:** prefer `core/adapters/pi/` if the entire proposed home moves together. If the implementation is deliberately limited to the subprocess launcher, use a narrower name such as `core/adapters/pi-launcher/`. Retain `core/adapters/launcher/` only if its record explicitly describes it as the Pi execution adapter and explains why the narrower `pi` name is not being used.

   **Naming / boundary BLOCKER:** do not create a record whose name and purpose say “launcher” while its declared contents also own Pi registration or broader host-adapter behavior without explanation. Either resolve the name to `pi`/`pi-launcher`, or make the boundary and relationships explicit in the record. This is a record and architecture issue, not a reason to move the code under `tools`.

   **Residual risk:** package exports, explicit `.pi` extension loading, dynamic launcher paths, and node-module resolution remain more significant than the digest risk. The digest constraint is satisfied because no `SKILL.md` path is cited, but the launcher, extension, package, and behavioral tests still need the atomic reference sweep described in the draft.

3. **Q3 — A3 is broadly sane, but the keep set needs provenance tightening.**

   The following should remain in-tree:

   - the advancement record and adoption sequence;
   - all pre-registrations that support the recorded benchmark history;
   - final and registered benchmark result summaries, manifests, scoring, scorer output, checksums, pristine/setup logs, and validation logs;
   - the migration matrix and fidelity-check scripts;
   - `drafts/composable-skills.md`, because it is a live contract source and fidelity-gate input;
   - `drafts/as-is.md`;
   - acceptance records, changelogs, backlog records, and handoffs;
   - the current cutover approach and any adoption-flow document still cited by retained evidence.

   The proposed pruning of session stores, consumer bundles, benchmark consumer working trees, `temp/`, and quarantine material is reasonable after the reference sweep. Those are bulky execution artifacts rather than the minimum evidence a merged-master reader needs.

   **Missing or conditional keeps:**

   - Retain the scorer instructions, rubric, launch/preparation scripts, or an equivalent durable summary whenever the retained result cannot otherwise be interpreted or reproduced.
   - Retain specific human decision and adjudication reviews that are cited by surviving records. Do not prune a whole `reviews/` tree merely because most reviews are stale. The migration matrix currently cites an F8 review, and surviving records also cite planning/adoption drafts.
   - The advancement record cites `temp/benchmarking/cost-wall-clock-comparison.md`. Before pruning `temp/`, that fact must either be retained in a durable record or the citation must be replaced with a tag/SHA-backed reference.
   - The migration matrix cites review and draft paths that may be removed. Those references must either remain valid or be deliberately rewritten to identify the preserved evidence and its recovery location.

   **Keep items that may be reduced:**

   - “The drafts tree” should not be retained wholesale indefinitely. Keep the record, live cited drafts, current cutover/adoption evidence, and human-decision provenance; remove or retire superseded proposals after the reference sweep.
   - Session stores and bundles do not need to remain in-tree if the retained score artifacts state their provenance and the full evidence snapshot remains recoverable.

   The tag is useful, but “recoverable forever” is too strong unless the tag and referenced commit are themselves retained and reachable after the branch lifecycle changes. The merge’s preserved branch history may provide that reachability, but the durable records should still name the evidence commit or tag explicitly.

   **Prune BLOCKER:** no bulk prune should occur until every retained record is checked for references to the planned deletions and every cited human decision or benchmark interpretation remains either in-tree or explicitly recoverable. In particular, the `temp/` cost comparison and cited review/adoption documents need disposition.

   **Residual risk:** retained logs and manifests may still contain stale paths or environment-specific details. They are valuable evidence, but they should not be mistaken for a clean reproducibility guarantee; the F9 result already records provider, runtime, scorer, and transcript-collection asymmetries.

4. **Q4 — Add the coverage check, but define “physical directory” narrowly and explicitly.**

   The check should be a deterministic content-test validator over the canonical `skills/` component tree. It should:

   1. discover records rather than rely on a hard-coded record-path list;
   2. extract declarations only from `Components` tables or the repository’s equivalent structural declaration;
   3. normalize declared paths relative to the owning record;
   4. require every declared component path to exist and contain its expected record;
   5. compare the declared component paths with discovered canonical component directories;
   6. reject duplicate declarations, path escapes, declarations of files instead of directories, and records whose parent/child relationship is inconsistent;
   7. emit repository-relative logical paths only.

   The scope needs one important clarification. A literal walk of every directory below `skills/` would treat implementation directories such as `scripts/` and `extensions/` as independent components, even though the house records currently describe the skill directory as the component boundary. The smallest consistent rule is therefore:

   > Every physical directory at an approved component boundary under `skills/` must be declared by a record; nested implementation/support directories are covered by their owning component and are not separate components unless they receive their own record.

   If the requirement truly means every nested directory, the records must declare those directories as children, which would be a substantially larger structural change and is not warranted for this cutover.

   Failure modes should be explicit:

   - **Symlinks:** use `lstat`, do not recursively follow directory symlinks, and fail or report a symlink at a canonical component boundary. Reject links that escape the repository scope.
   - **`node_modules`:** after the runtime move, this should not be present under `skills/`. Treat an occurrence as an unexpected infrastructure directory and fail rather than silently excluding it.
   - **`.pi` directories:** treat them as host/generated infrastructure, not skill components; nevertheless detect and report them rather than letting a broad hidden-directory exclusion conceal a misplaced component.
   - **Generated or temporary directories:** use an explicit, reviewed allowlist of known generated locations. Do not use a broad “ignore all hidden/generated-looking names” rule.
   - **Unexpected direct children:** an unrecognized physical directory directly below the declared skill namespaces should fail coverage, even if it has no `as-is.md`.

   Focused validator fixtures should cover undeclared directories, missing declared paths, duplicate declarations, symlinked directories, repository escapes, `node_modules`, `.pi`, generated directories, and nested support directories.

   **Coverage BLOCKER:** the implementation must settle the component-boundary rule and exclusion policy before the new check is accepted. A validator that silently ignores symlinks, dependency trees, `.pi`, or generated directories would recreate the current “conformance mistaken for coverage” failure.

   **Residual risk:** this check proves repository-local structural coverage, not dynamic consumers, package loading, external projections, or runtime behavior. The re-home still requires the launcher, extension, validator, backlog, renderer, and affected behavioral suites to pass, with the pinned catalog digest unchanged.

The recommendations do not authorize the merge. After these boundary and retention conditions are resolved, the existing human-controlled single `--no-ff` merge gate remains the appropriate approval point.