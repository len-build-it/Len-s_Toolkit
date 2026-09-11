# Implementation Plan: MIG-001 - Migrate to a customized Superpowers fork

> **Status:** Completed and verified; repository archived and superseded by Superpowers fork (https://github.com/len-build-it/superpowerfork).
> **Created:** 2026-09-11T09:45:43+08:00
> **Target Branch:** `codex/superpowers-migration` in the new fork; inspect before creation.
> **Test Command:** Legacy baseline: `npm test`; fork commands must be discovered and recorded in Phase 1.
> **Lint/Check Command:** Legacy: `node --check bin/cli.js` and `node --check src/installer.js`; all repositories: `git diff --check`.

## Overview

Use Superpowers as the engineering workflow, with explicit conversation-scoped modes and Len's Ponytail and Council preferences.
Preserve Len's exact general coding guidelines and the existing toolkit before creating and customizing a separate fork.
This document is the migration specification and execution checklist; do not create a competing checklist or import the legacy workflow wholesale.
The receiving-agent entry point is [the Gemini migration handoff](docs/plans/MIG-001-gemini-handoff.md).
The completed [banner plan](docs/plans/BUG-001-responsive-banner.md) and [FEAT-001 plan](docs/plans/FEAT-001-implementation.md) remain historical records.

## Authority and scope

- Len requested this migration plan for Gemini, after accepting Superpowers as the base and identifying the exact `AGENTS.md` to preserve.
- Creating this plan is not approval to execute its phases, install plugins, change global settings, or publish a fork.
- The earlier request to archive the old repository was paused; resume it only through approval of Phase 1 below.
- Obtain approval to start Phase 1, then stop after every phase's verified commit and wait for Len before the next phase.
- Use one agent throughout this migration; do not dispatch subagents, including through upstream review or execution skills, unless Len changes this constraint.
- Do not resume FEAT-001 or BUG-001, launch `npx len-toolkit start`, or follow historical automatic-continuation approvals.
- Do not publish an npm release, modify other application repositories, delete the old checkout, or submit fork-specific changes upstream.
- Do not manually edit `CHANGELOG.md` or generated files.

## Observed baseline and sources

At drafting time, the old checkout was clean on `master`, tracking `origin/master` at `c85e261923ab56a00e8fac9395c6f767aff4b2c9`.
Its remote is `https://github.com/len-build-it/Len-s_Toolkit.git`.
The exact policy source is root `AGENTS.md`, with SHA-256 `86EE90450B7032F2CC0AED01DE32F069D81E555F6BBAEE08B286528861433463` at drafting time.
The installed `.agents/skills/` and distributed `templates/skills/` contain different revisions; neither may silently substitute for the other.
No archive, tag, fork, plugin installation, or global disabling operation was performed in this conversation.
GitHub CLI was unavailable during the earlier inspection; current authentication and tool availability must be checked again.

Reviewed upstream sources are mutable references, not a pinned implementation baseline:

- [Superpowers repository](https://github.com/obra/superpowers).
- [Bootstrap and user-instruction precedence](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md).
- [Brainstorming paths and approval gates](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md).
- [Plan creation](https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md) and [execution](https://github.com/obra/superpowers/blob/main/skills/executing-plans/SKILL.md).
- [Codex plugin manifest](https://github.com/obra/superpowers/blob/main/.codex-plugin/plugin.json) and [contributor guidance](https://github.com/obra/superpowers/blob/main/CLAUDE.md).
- [Official skill discovery and invocation controls](https://learn.chatgpt.com/docs/build-skills).

The inspected Codex manifest reported version `6.3.0` and an empty `hooks` object.
Do not infer that a startup hook exists on every client from the generic README.
Installing a plugin does not by itself prove its repository-root `AGENTS.md` governs work in consuming projects.

## Required behavior

### MIG-REQ-01: Exact policy preservation

Preserve root `AGENTS.md` byte-for-byte in the archive and as a clearly identified policy source in the fork.
Preserve all four Core Directives and every General Guideline, including hard stops, no agent co-author, Markdown sentence formatting, quality priorities, E2E reproduction, incidental UI fixes, and lint/test/flakiness expectations.
Do not replace this policy with the newer toolkit templates or a summary.
Keep proposed interpretations in a separate, reviewable adapter document.
Do not silently weaken a directive to make an implementation or test pass.

### MIG-REQ-02: Modes and transitions

The following is the proposed contract for approval with this plan:

| Mode | Work allowed by the mode | Supporting workflow |
| --- | --- | --- |
| None selected | Ordinary conversation and read-only inspection; request an explicit mode before starting a specialized workflow | No automatic Council or production implementation |
| Plan | Requirements, design, and plan documents; no production implementation | Superpowers brainstorming/planning; Council for consequential trade-offs |
| Code | Implement authorized work and run its checks | Superpowers execution, TDD, debugging, verification, plus Ponytail |
| Review | Inspect and report findings; run appropriate non-destructive checks; no source fixes | Superpowers review plus Ponytail simplicity checks |
| Search | Research and cite findings; no project edits or implementation | Available browsing with source-quality and recency checks; no new search dependency |

Provide an explicit, clearly named mode-selection skill using the client's supported skill picker or mention mechanism.
Prefer one selector accepting Plan, Code, Review, Search, and Off rather than duplicating whole workflows in wrapper skills.
Exact invocation syntax and user-facing name must be verified on each client and recorded before release.
These are Len workflow labels, not new native UI buttons, native Codex Plan mode, permission profiles, or guaranteed hard skill disables.
Modes govern subsequent behavior; they cannot remove instructions already present in conversation history.
Switching replaces the previous mode in that conversation and preserves task progress, approvals, pending phase stops, and constraints.
A switch to Code never grants missing scope, dependency, commit, or phase authorization.
Off ends the selected specialized workflow; baseline quality and safety rules still apply.
Do not automatically switch Plan to Code or Review to Code because an upstream skill requests a follow-on skill.
Scope mode state to one conversation; do not toggle shared global plugin configuration as the mechanism for changing modes.
For a resumed conversation, restore only explicitly recorded mode state; if unavailable, report that and request selection.
A new conversation starts with no mode selected.

### MIG-REQ-03: Policy interpretation and specialist skills

Keep Ponytail's engineering principles applicable to code changes as directed by `AGENTS.md`, while its full workflow is selected through Code or explicit invocation.
Council's full deliberation is optional for routine tasks; Plan must still surface meaningful trade-offs as the original directive requires.
Propose applying the mandatory plan, commit, and phase-stop lifecycle to substantial implementation; do not invent a trivial-task exemption without Len approving this interpretation at Phase 1.
Preserve the incidental-quality instructions; any proposed boundary between fixing incidental defects and expanding approved scope must be explicitly approved rather than silently inserted.
Interpret preservation of tests as preserving valid coverage and a passing completion gate, not as forbidding an intentional new failing regression test in TDD.
Keep original guideline wording intact while documenting that interpretation for Len's review.
Do not implement new UI/UX, cybersecurity, or external search skills in this migration.
Record those as deferred additions; ordinary security, accessibility, and verification remain part of engineering work.

### MIG-REQ-04: Integration and maintenance

Use a separate fork and checkout; never repoint or replace the existing toolkit repository in place.
Preserve upstream licensing, attribution, history, and contributor instructions.
Record the exact upstream commit and maintain an `upstream` remote distinct from the fork's `origin`.
Keep Len-specific policy and mode instructions together, with minimal targeted upstream edits where required.
Inventory both automatic triggers and explicit cross-skill transitions; a manual-only flag on the selector alone is insufficient.
Ensure the policy is actually loaded in a consuming project with the installation procedure for each supported client.
Detect duplicate original Superpowers, fork, legacy toolkit, and Ponytail installations; never remove unrelated plugins or overwrite personal rules automatically.

## Execution and evidence rules

At each phase, inspect Git status, perform the tasks, run required checks, review correctness and simplicity, update evidence, stage only reviewed paths, and create the phase commit.
Never use blanket staging or include unrelated pre-existing edits.
Use `git diff --cached --check` and inspect `git diff --cached` before committing; confirm the result with `git log -1 --oneline` afterward.
Record the unique checkpoint message before committing and verify its resulting hash; do not create an extra commit solely to record its own hash.
Maintain `docs/len/MIG-001-evidence.md` in the fork after it exists, with requirement, scenario/command, environment/version, timestamp, result, limitations, and transcript location.
Until then, use a migration evidence file in the old repository's `docs/evidence/` directory.
Never claim a file-content assertion proves agent behavior or that one successful client session establishes cross-client support.
Do not install a dependency merely to run a validator; inspect existing tooling first and seek authorization when a new dependency is necessary.
On failure, preserve edits and record the initial failure and attempted corrections.
After three unsuccessful fix-and-check attempts on the same issue, stop with evidence and the required next decision; do not reset the count on resume.

## Phase 1: Preserve the toolkit and settle the integration contract

**Goal:** Produce a recoverable archive and an approved, concrete fork configuration before customization.

### Tasks

- [x] Read this plan and its Gemini handoff; obtain Phase 1 execution approval.
- [x] Recheck the old repository state, remote, policy hash, available tools, and upstream source revision.
- [x] Run `npm test`, `node --check bin/cli.js`, and `node --check src/installer.js`; record failures without silently rewriting the old product.
- [x] Confirm the GitHub fork owner/name, separate checkout path, durable backup path outside the old checkout, and first validation client with Len.
- [x] Record any new or ignored user material; preserve it separately without uploading secrets or silently excluding relevant files.
- [x] After the phase record is committed, create a full Git bundle using `git bundle create` with `--all` and explicit approved destination, plus an exact policy copy and checksums.
- [x] Verify with `git bundle verify`, then restore the bundle into a disposable isolated directory and compare the archived commit and policy hash.
- [x] Inspect current upstream bootstrap, skill chains, manifests, hooks, and available tests; record the exact planned file edits, native validation commands, and supported installation paths.
- [x] Present the policy interpretations in MIG-REQ-03, mode contract, and policy-loading mechanism for explicit approval.

### Approved configuration decisions

- Fork repository: `len-build-it/superpowers`.
- Fork checkout path: `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\superpowers`.
- Durable backup destination: `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\backups\Len-s_Toolkit_backup_2026-09-11`.
- Primary validation client: Antigravity / Gemini CLI.
- Pinned upstream revision: `obra/superpowers` tag `v6.3.0` at `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.
- Mode contract & policy interpretations: Approved per MIG-REQ-02 and MIG-REQ-03.

### Verification Gate

- [x] Legacy checks are recorded honestly; unresolved baseline problems have a disposition agreed with Len.
- [x] Restored archive resolves the recorded commit, includes migration documents, and reproduces the exact policy hash.
- [x] Paths, fork identity, pinned upstream revision, commands, and policy-loading method are concrete; unresolved choices block Phase 2.

### Review Gate (Ponytail)

- [x] No unnecessary package, global configuration edit, skill engine, or copied generic workflow.
- [x] Backup and fork targets cannot overwrite the old checkout or existing user directories.

### Git Checkpoint and Hard Stop

Commit the reviewed Phase 1 migration records in the legacy repository as `docs(migration): record archive baseline and integration contract`.
Create and verify the archive after this commit so it contains the checkpoint.
Report the commit, archive location, restore result, selected upstream revision, proposed policy interpretations, and concrete next-phase targets.
Stop and obtain Len's approval before creating the fork or changing runtime behavior.
GitHub read-only archival is deferred to Phase 5 so migration and recovery records can still be maintained; the verified backup satisfies preservation before forking.

## Phase 2: Create the fork and load Len's exact policy

**Goal:** Establish a separate maintainable fork and prove policy delivery in a consuming project.

### Tasks

- [ ] Create the approved GitHub fork and separate local checkout through available authenticated tooling; do not fabricate success if access is unavailable.
- [ ] Verify `origin` is Len's approved fork and `upstream` is `obra/superpowers`; record the baseline commit and create the target branch if absent.
- [ ] Carry this plan and handoff into the fork once; update their relative source links and identify the fork copy as the active execution record.
- [ ] Preserve upstream contributor documents and any symlinks; inspect before editing rather than replacing them with pointers.
- [ ] Copy the exact legacy `AGENTS.md` into `docs/len/AGENTS.original.md` without normalization and verify its SHA-256.
- [ ] Add only the Phase 1-approved adapter and loading mechanism; keep original policy text distinguishable from interpretations.
- [ ] Add import/provenance notes for the old repository, policy hash, pinned upstream, licensing, and later upstream-update procedure.
- [ ] Use a disposable consuming project to demonstrate policy loading through the selected client's actual installation route.

### Verification Gate

- [ ] Run the upstream baseline commands discovered in Phase 1 and record environment limitations.
- [ ] Verify archive restoration, fork remotes, branch, exact policy hash, and license retention.
- [ ] A fresh consuming-project session can locate the policy and correctly apply a harmless rule without manually pasting the policy into the prompt.
- [ ] Run `git diff --check`; inspect user-visible installation instructions for unsupported claims.

### Review Gate (Ponytail)

- [ ] No wholesale rewrite of upstream skills or contributor files; no second canonical policy copy to maintain.
- [ ] No original plugin cache edited as a substitute for a reproducible fork installation.

### Git Checkpoint and Hard Stop

Commit reviewed fork paths as `feat(policy): load Len guidelines in consuming projects`.
Report policy-loading evidence and the installation scope; obtain approval before implementing modes.

## Phase 3: Implement explicit modes with Ponytail and Council

**Goal:** Make mode transitions govern the actual workflow and preserve approvals.

### Tasks

- [ ] Add the approved mode selector, its metadata, and minimal bootstrap/transition changes identified in Phase 1.
- [ ] Review all relevant skill descriptions and internal skill calls so no off-mode workflow bypasses the selector.
- [ ] Integrate the chosen existing Ponytail and Council revisions with provenance; reconcile their persistent and automatic behavior with the approved contract.
- [ ] Preserve Superpowers testing, debugging, verification, and code-review behavior within Code instead of building duplicate implementations.
- [ ] Ensure Plan/Review/Search cannot silently enter production implementation, and Code respects phase stops and plan approval.
- [ ] Enforce the migration's single-agent constraint throughout execution and review pathways.
- [ ] Provide an observable response on explicit mode changes that identifies the selected mode and any pending approval; avoid repetitive status boilerplate on every response.
- [ ] Add focused checks using upstream test infrastructure for new routing logic or metadata, without introducing a testing framework.

### Verification Gate

- [ ] Run the recorded upstream checks and targeted new checks; run `git diff --check`.
- [ ] Exercise no-mode, explicit Plan, Code, Review, Search, and Off in the primary client.
- [ ] Verify a request to switch to Code does not bypass a missing approval or a phase hard stop.
- [ ] Verify incidental review findings remain findings unless implementation is authorized.

### Review Gate (Ponytail)

- [ ] No redundant mode-specific copies of Superpowers workflows and no global mutable mode setting.
- [ ] No silent weakening of the preserved policy, security, accessibility, or verification requirements.

### Git Checkpoint and Hard Stop

Commit reviewed fork paths as `feat(modes): add explicit workflow selection with Ponytail and Council`.
Report the commands users actually invoke and all behavior limitations; obtain approval before broader client validation.

## Phase 4: Verify cross-client behavior and recovery

**Goal:** Establish actual evidence for switching and resuming modes on the target clients.

### Tasks

- [ ] Test Codex CLI, Codex in the desktop app, and Gemini through Len's actual chosen client; record exact versions and installation scopes.
- [ ] Treat regular ChatGPT Chat/Work as separate surfaces; do not advertise them as validated merely because desktop Codex passed.
- [ ] Run the matrix below in disposable projects and fresh conversations using the installation procedure, not pasted substitute prompts.
- [ ] Store concise transcripts and relevant file/Git diffs; distinguish self-review by one agent from independent review.
- [ ] Verify duplicate plugin/skill discovery is visible and that installation does not silently leave conflicting original and customized workflows active.
- [ ] Exercise an upstream update rehearsal in an isolated branch and rerun relevant checks; do not silently upgrade the approved baseline.
- [ ] If a client is unavailable or does not honor required behavior, mark it unsupported/pending and seek Len's acceptance of reduced scope before proceeding.

### Behavioral verification matrix

| Scenario | Expected evidence |
| --- | --- |
| Fresh conversation, small question | No Council, implementation, or automatic mode selection |
| Select Plan, discuss a consequential decision | Design and meaningful trade-offs; Council available; no production edits |
| Select Code before approval | Pending approval reported; no unauthorized implementation |
| Approved Plan to Code | Existing plan reused; Ponytail and Superpowers checks applied |
| End an implementation phase | Tests/review/commit recorded; no next-phase work before confirmation |
| Code to Review with a seeded defect | Defect reported; source and fixes remain untouched |
| Code to Search | Sources and dates checked; unsupported conclusions labeled; no source edits |
| Explicit Council request | Requested deliberation; no subagents during this migration |
| Select Off | Specialized workflow ends; baseline policy still applies |
| Resume or compact a conversation | Mode and pending gates restored from reliable records, or selection requested if lost |
| Open another conversation | No mode leakage from the first conversation |
| Attempt a destructive operation through a mode switch | Existing authorization and permission boundary remains intact |
| Update/reinstall and remove customization | Reproducible mode behavior and recoverable original installation |

### Verification and Review Gates

- [ ] Run upstream and targeted checks once after final fixes, plus `git diff --check`.
- [ ] Every required matrix result identifies client/version, actual transcript, result, and limitations; no unrun scenario is marked passed.
- [ ] Confirm no unrelated repository or global plugin state was changed by fixtures.

### Git Checkpoint and Hard Stop

Commit reviewed tests and evidence as `test(modes): verify client switching and recovery behavior`.
Report validated clients, failures, and pending checks; obtain approval for retirement and rollout.

## Phase 5: Roll out and retire the legacy toolkit safely

**Goal:** Make the verified fork usable and archive the original without losing policy or recovery options.

### Tasks

- [ ] Document installation, exact mode invocation, policy scope, upgrade steps, known limitations, and rollback in the fork.
- [ ] Document that `npx len-toolkit start` is a one-shot command, not a running global service; there is no toolkit-wide disable command in the inspected CLI.
- [ ] Inspect only approved instruction/configuration locations for rules that automatically tell agents to run it; propose precise removal or replacement of those startup instructions while retaining general coding guidelines.
- [ ] Do not treat `npm uninstall -g len-toolkit` as disabling `npx`; uninstall only if a global installation exists and Len authorizes removal.
- [ ] Apply the approved installation changes and resolve duplicate legacy/original/fork skills without removing unrelated plugins or user files.
- [ ] Commit final rollout and rollback documentation; publish/push only the approved fork branch and destination, never upstream or npm.
- [ ] Record the fork URL and migration outcome in the legacy repository while it is still writable, then refresh and verify the durable archive including these records.
- [ ] Confirm Len is ready to resume the previously paused GitHub archive action, then archive only `len-build-it/Len-s_Toolkit` through authenticated tooling.
- [ ] Verify GitHub reports the old repository read-only, the old local checkout still exists, the fork is usable, and the policy hash remains preserved.

### Verification Gate

- [ ] Run a fresh-session installation and mode-selection smoke test after rollout.
- [ ] Verify agent startup no longer reintroduces the legacy toolkit in the approved target scope.
- [ ] Demonstrate rollback using the recorded installation procedure and archive restore in a disposable location.
- [ ] Record archive status from GitHub and all final local commits/remote destinations; do not confuse a local backup with GitHub archival.

### Review Gate (Ponytail)

- [ ] No new legacy installer or permanent service retained without a demonstrated need.
- [ ] Original guidelines and upstream provenance remain accessible; backup is outside the old checkout and recoverable.

### Git Checkpoint and Final Hard Stop

Commit fork documentation as `docs(migration): document rollout and legacy retirement`.
Commit only legacy migration records as `docs(archive): record Superpowers successor and recovery` before the final archive refresh and remote archival.
Report both checkpoint hashes, fork and archive locations, validated clients, pending limitations, rollback steps, and any global changes actually made.
Stop at completion; do not start deferred design, security, or search-skill development.
