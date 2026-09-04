# Skills - as-is

## Purpose
Maintain the durable organization, authority context, and authoritative classification catalog for reusable skills. The flat `skills/` namespace is the capability roster; classification is recorded as an attribute rather than inferred from storage placement. The 2026-09-03..04 records documented the retired `master/` and `reusable/` storage grouping as mount provenance, not semantics.

## Components

| Component | Purpose |
| --- | --- |
| [Building components](building-components/as-is.md#design) | Build bounded components and produce durable handoffs. |
| [Committing completed work](committing-completed-work/as-is.md#design) | Create scoped commits for validated completed work. |
| [Consulting humans](consulting-humans/as-is.md#design) | Guide concise, agency-preserving consultation. |
| [Designing Mermaid diagrams](designing-mermaid-diagrams/as-is.md#design) | Design bounded Mermaid diagrams for complete component context. |
| [Exploring execution evidence](exploring-execution-evidence/as-is.md#design) | Investigate traces and readable sessions. |
| [Implementing tasks](implementing-tasks/as-is.md#design) | Run bounded component-task lifecycle. |
| [Maintaining components](maintaining-components/as-is.md#design) | Perform evidence-based component housekeeping. |
| [Making changes](making-changes/as-is.md#design) | Apply bounded, validated changes to components. |
| [Managing as-is records](managing-as-is-records/as-is.md#design) | Create and maintain durable component records. |
| [Managing backlogs](managing-backlogs/as-is.md#design) | Prioritize bounded work proposals. |
| [Managing changelogs](managing-changelogs/as-is.md#design) | Maintain component changelogs. |
| [Spawning subagents](spawning-subagents/as-is.md#design) | Launch and observe bounded Pi subprocesses. |
| [Applying bounded edits](applying-bounded-edits/as-is.md#design) | Make small, precise edits within a bounded scope. |
| [Assessing determinism](assessing-determinism/as-is.md#design) | Identify evidence-supported deterministic improvements. |
| [Building context](building-context/as-is.md#design) | Assemble bounded, provenance-bearing context. |
| [Choosing change methods](choosing-change-methods/as-is.md#design) | Select the smallest change method that satisfies the need. |
| [Choosing names](choosing-names/as-is.md#design) | Choose semantically accurate names for repository concepts. |
| [Delegating bounded work](delegating-bounded-work/as-is.md#design) | Delegate bounded tasks under existing authority. |
| [Designing diagrams](designing-diagrams/as-is.md#design) | Design bounded diagrams for component context. |
| [Drafting changelog entries](drafting-changelog-entries/as-is.md#design) | Draft concise changelog entries. |
| [Drafting content](drafting-content/as-is.md#design) | Draft durable repository content. |
| [Identifying owners](identifying-owners/as-is.md#design) | Identify owning components and authorities. |
| [Inspecting execution evidence](inspecting-execution-evidence/as-is.md#design) | Investigate traces and readable sessions read-only. |
| [Locating changelogs](locating-changelogs/as-is.md#design) | Locate the owning changelog for a change. |
| [Observing delegated work](observing-delegated-work/as-is.md#design) | Observe delegated work without granting execution authority. |
| [Preparing scoped commits](preparing-scoped-commits/as-is.md#design) | Prepare scoped Git commits for validated work. |
| [Presenting decisions](presenting-decisions/as-is.md#design) | Present decisions with alternatives and material effects. |
| [Recording backlog items](recording-backlog-items/as-is.md#design) | Record bounded work proposals in backlog records. |
| [Recording evidence](recording-evidence/as-is.md#design) | Record completion and validation evidence. |
| [Resolving scopes](resolving-scopes/as-is.md#design) | Resolve component scopes and boundaries for work. |
| [Running tests](running-tests/as-is.md#design) | Run the smallest relevant test automation. |
| [Structuring content](structuring-content/as-is.md#design) | Organize repository knowledge. |
| [Validating changes](validating-changes/as-is.md#design) | Validate changed behavior against acceptance conditions. |
| [Writing code](writing-code/as-is.md#design) | Create or substantially implement code from bounded requirements. |
| [Writing tests](writing-tests/as-is.md#design) | Write focused tests for bounded behavior. |

## Design

**Lineage**: [as-is](../as-is.md#design) / **Skills**

The Skills component provides the concise capability catalog and the authoritative classification of all thirty-five skill components. Classification is an attribute in the catalog table below; physical placement in the flat namespace does not determine classification. The roster has no semantic storage subgroups: composition authority and composable procedure are classification values attached to individual capabilities.

### Capability classification

| Skill | Physical path | Classification |
| --- | --- | --- |
| Building components | `building-components` | `composition-authority` |
| Committing completed work | `committing-completed-work` | `composition-authority` |
| Consulting humans | `consulting-humans` | `composable-procedure` |
| Designing Mermaid diagrams | `designing-mermaid-diagrams` | `composable-procedure` |
| Exploring execution evidence | `exploring-execution-evidence` | `composable-procedure` |
| Implementing tasks | `implementing-tasks` | `composition-authority` |
| Maintaining components | `maintaining-components` | `composition-authority` |
| Making changes | `making-changes` | `composition-authority` |
| Managing as-is records | `managing-as-is-records` | `composition-authority` |
| Managing backlogs | `managing-backlogs` | `composition-authority` |
| Managing changelogs | `managing-changelogs` | `composable-procedure` |
| Spawning subagents | `spawning-subagents` | `composition-authority` |
| Applying bounded edits | `applying-bounded-edits` | `composable-procedure` |
| Assessing determinism | `assessing-determinism` | `composable-procedure` |
| Building context | `building-context` | `composable-procedure` |
| Choosing change methods | `choosing-change-methods` | `composable-procedure` |
| Choosing names | `choosing-names` | `composable-procedure` |
| Delegating bounded work | `delegating-bounded-work` | `composable-procedure` |
| Designing diagrams | `designing-diagrams` | `composable-procedure` |
| Drafting changelog entries | `drafting-changelog-entries` | `composable-procedure` |
| Drafting content | `drafting-content` | `composable-procedure` |
| Identifying owners | `identifying-owners` | `composable-procedure` |
| Inspecting execution evidence | `inspecting-execution-evidence` | `composable-procedure` |
| Locating changelogs | `locating-changelogs` | `composable-procedure` |
| Observing delegated work | `observing-delegated-work` | `composable-procedure` |
| Preparing scoped commits | `preparing-scoped-commits` | `composable-procedure` |
| Presenting decisions | `presenting-decisions` | `composable-procedure` |
| Recording backlog items | `recording-backlog-items` | `composable-procedure` |
| Recording evidence | `recording-evidence` | `composable-procedure` |
| Resolving scopes | `resolving-scopes` | `composable-procedure` |
| Running tests | `running-tests` | `composable-procedure` |
| Structuring content | `structuring-content` | `composable-procedure` |
| Validating changes | `validating-changes` | `composable-procedure` |
| Writing code | `writing-code` | `composable-procedure` |
| Writing tests | `writing-tests` | `composable-procedure` |

`composition-authority` identifies a skill that composes authoritative workflow steps and bounded component outcomes. `composable-procedure` identifies a focused capability that can be invoked independently. Classification remains an attribute of each skill and does not grant authority to the skill itself.

### Runtime support

The following runtime homes are cross-references to capabilities executed outside the Skills component; they are not Skills children and do not change the catalog's thirty-five-skill count.

| Runtime home | Actual record | Skill capability executed |
| --- | --- | --- |
| `core/adapters/pi` | [Pi adapter](../core/adapters/pi/as-is.md) | [Spawning subagents](spawning-subagents/SKILL.md) — governed delegation launcher and worker registration. |
| `tools/as-is-validators` | [As-is validators](../tools/as-is-validators/as-is.md) | [Managing as-is records](managing-as-is-records/SKILL.md) — repository-wide record and navigation validation. |
| `tools/backlog-query` | [Backlog query](../tools/backlog-query/as-is.md) | [Managing backlogs](managing-backlogs/SKILL.md) — backlog schema walk and query operations. |
| `tools/mermaid-renderer` | [Mermaid renderer](../tools/mermaid-renderer/as-is.md) | [Designing Mermaid diagrams](designing-mermaid-diagrams/SKILL.md) — rendered navigation checks and service support. |

The flat namespace also retains these directly owned artifacts: `AGENTS.md`, `as-is.md`, `backlog.md`, `changelog.md`, and `building-components-consolidation.md`. The last is planning evidence for the composition-authority skills, remains in `skills/`, and is not an operational skill or a component record.

**As-is guidance ownership**

| Concern | Canonical owner | Boundary and unresolved work |
| --- | --- | --- |
| Project adoption, setup scope, and approved component identification | [`Managing as-is records`](managing-as-is-records/SKILL.md) (adopted; absorbed disposition) and [`core/adapters/host-setup`](../core/adapters/host-setup/as-is.md) | The standalone setup skills are retired with the capability absorbed: durable record creation is carried by the adopted records skill (which grants no tools or authority and does not perform host setup), executable existing-project host wiring remains with the host-setup adapter, and approved component identification remains root-owned backlog work. |
| Durable as-is record shape, component meaning, hierarchy, navigation, and as-is-specific diagram meaning | [`Managing as-is records`](managing-as-is-records/SKILL.md) (adopted) | The adopted records skill owns record-specific structure and meaning; it does not select components or own generic Mermaid mechanics. (Baseline `managing-as-is-document` retired at F5; runtime-only home retains its validators at `tools/as-is-validators/`.) |
| Generic Mermaid representation, view selection, functional framing, labels, readability, and render checks | [`Designing Mermaid diagrams`](designing-mermaid-diagrams/SKILL.md) | The generic skill is target-neutral; host-specific record and navigation rules remain with the adopted records skill. (Baseline retired at F5; renderer runtime is retained at `tools/mermaid-renderer/`.) |
| General repository instruction and durable-document disposition | Root [`AGENTS.md`](../AGENTS.md) and root backlog/design tasks | The temporary `As-Is Guidance` section and the root `dissolve-documents-into-as-is-records` review remain unresolved root-owned work; this map does not retire or relocate them. |

The table is an ownership map, not a second procedure or task authority. The linked skill contracts remain authoritative.

The [`building-components-consolidation.md`](building-components-consolidation.md) assessment records the current comparison and recommendation for keeping component maintenance, task lifecycle, and builder composition separate; it is planning evidence, not another operational skill.

| Concept | Meaning |
| --- | --- |
| Capability domain | Groups related competence for navigation. |
| Atomic skill | Has one primary purpose and can be independently invoked, assessed, improved, permissioned, and reused. |
| Operational skill | Applies one or more capabilities to a recurring bounded procedure. |
| Agent role | Combines shared skills with tools, permissions, model settings, and bounded responsibility; agents do not own skill definitions. |
| Workflow or orchestrator | Composes agents and skills, preserves state, applies policy, and coordinates human input. |

Prefer canonical atomic skills over tool-specific procedures or duplicated role instructions. Use the smallest reusable skill with enough independent value to assign, test, improve, observe, or govern. Keep domain playbooks extensible and preserve authority in the owning agent, workflow, or task record.

| Concern | Rule |
| --- | --- |
| Skill composition | Skills remain focused, reusable procedures composed by agents or workflows. |
| Flow ownership | Reusable flow logic belongs in skills rather than duplicated role prompts. |
| Handoff contracts | A skill may describe a handoff or subagent contract, but agent or orchestrator authority remains separate. |
| Repository preference | Prefer repository-local skills for setup, naming, and knowledge organization. |
| External skills | Use installed or external skills only when their assumptions, tools, and output contracts fit. |

### Skills relationship map

```mermaid
%%{init: {"securityLevel": "loose"}}%%
flowchart LR
    subgraph Skills["Skills"]
        %% composition-authority roster
        BuildingComponents["<a href='./building-components/as-is.md#design'>Building components</a>"]
        CommittingCompletedWork["<a href='./committing-completed-work/as-is.md#design'>Committing completed work</a>"]
        ImplementingTasks["<a href='./implementing-tasks/as-is.md#design'>Implementing tasks</a>"]
        MaintainingComponents["<a href='./maintaining-components/as-is.md#design'>Maintaining components</a>"]
        MakingChanges["<a href='./making-changes/as-is.md#design'>Making changes</a>"]
        ManagingAsIsRecords["<a href='./managing-as-is-records/as-is.md#design'>Managing as-is records</a>"]
        ManagingBacklogs["<a href='./managing-backlogs/as-is.md#design'>Managing backlogs</a>"]
        SpawningSubagents["<a href='./spawning-subagents/as-is.md#design'>Spawning subagents</a>"]
        %% composable-procedure roster
        ConsultingHumans["<a href='./consulting-humans/as-is.md#design'>Consulting humans</a>"]
        DesigningMermaidDiagrams["<a href='./designing-mermaid-diagrams/as-is.md#design'>Designing Mermaid diagrams</a>"]
        ExploringExecutionEvidence["<a href='./exploring-execution-evidence/as-is.md#design'>Exploring execution evidence</a>"]
        ManagingChangelogs["<a href='./managing-changelogs/as-is.md#design'>Managing changelogs</a>"]
        ApplyingBoundedEdits["<a href='./applying-bounded-edits/as-is.md#design'>Applying bounded edits</a>"]
        AssessingDeterminism["<a href='./assessing-determinism/as-is.md#design'>Assessing determinism</a>"]
        BuildingContext["<a href='./building-context/as-is.md#design'>Building context</a>"]
        ChoosingChangeMethods["<a href='./choosing-change-methods/as-is.md#design'>Choosing change methods</a>"]
        ChoosingNames["<a href='./choosing-names/as-is.md#design'>Choosing names</a>"]
        DelegatingBoundedWork["<a href='./delegating-bounded-work/as-is.md#design'>Delegating bounded work</a>"]
        DesigningDiagrams["<a href='./designing-diagrams/as-is.md#design'>Designing diagrams</a>"]
        DraftingChangelogEntries["<a href='./drafting-changelog-entries/as-is.md#design'>Drafting changelog entries</a>"]
        DraftingContent["<a href='./drafting-content/as-is.md#design'>Drafting content</a>"]
        IdentifyingOwners["<a href='./identifying-owners/as-is.md#design'>Identifying owners</a>"]
        InspectingExecutionEvidence["<a href='./inspecting-execution-evidence/as-is.md#design'>Inspecting execution<br/>evidence</a>"]
        LocatingChangelogs["<a href='./locating-changelogs/as-is.md#design'>Locating changelogs</a>"]
        ObservingDelegatedWork["<a href='./observing-delegated-work/as-is.md#design'>Observing delegated work</a>"]
        PreparingScopedCommits["<a href='./preparing-scoped-commits/as-is.md#design'>Preparing scoped commits</a>"]
        PresentingDecisions["<a href='./presenting-decisions/as-is.md#design'>Presenting decisions</a>"]
        RecordingBacklogItems["<a href='./recording-backlog-items/as-is.md#design'>Recording backlog items</a>"]
        RecordingEvidence["<a href='./recording-evidence/as-is.md#design'>Recording evidence</a>"]
        ResolvingScopes["<a href='./resolving-scopes/as-is.md#design'>Resolving scopes</a>"]
        RunningTests["<a href='./running-tests/as-is.md#design'>Running tests</a>"]
        StructuringContent["<a href='./structuring-content/as-is.md#design'>Structuring content</a>"]
        ValidatingChanges["<a href='./validating-changes/as-is.md#design'>Validating changes</a>"]
        WritingCode["<a href='./writing-code/as-is.md#design'>Writing code</a>"]
        WritingTests["<a href='./writing-tests/as-is.md#design'>Writing tests</a>"]
    end
    classDef component fill:#f8fafc,fill-opacity:0.1,stroke:#334155,stroke-width:2px
    classDef authority fill:#2563eb,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    classDef procedure fill:#16a34a,fill-opacity:0.1,stroke:#64748b,stroke-width:1px
    class Skills component
    class BuildingComponents,CommittingCompletedWork,ImplementingTasks,MaintainingComponents,MakingChanges,ManagingAsIsRecords,ManagingBacklogs,SpawningSubagents authority
    class ConsultingHumans,DesigningMermaidDiagrams,ExploringExecutionEvidence,ManagingChangelogs,ApplyingBoundedEdits,AssessingDeterminism,BuildingContext,ChoosingChangeMethods,ChoosingNames,DelegatingBoundedWork,DesigningDiagrams,DraftingChangelogEntries,DraftingContent,IdentifyingOwners,InspectingExecutionEvidence,LocatingChangelogs,ObservingDelegatedWork,PreparingScopedCommits,PresentingDecisions,RecordingBacklogItems,RecordingEvidence,ResolvingScopes,RunningTests,StructuringContent,ValidatingChanges,WritingCode,WritingTests procedure
```

All live skill definitions are cataloged directly in this flat roster; classification is an attribute in the catalog table, not a namespace boundary.

## Links

- [../design-principles.md](../design-principles.md) — repository-wide authority and design principles.
