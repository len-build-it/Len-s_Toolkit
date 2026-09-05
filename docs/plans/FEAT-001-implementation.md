# Implementation plan: FEAT-001 personal spec-first workflow

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:25:11+08:00
Revision: 1
Status: In progress
Observed branch: `master`
Specification: [FEAT-001](../features/FEAT-001-spec-first-workflow.md)

## Execution contract

Len approved this plan and the linked baseline and feature revision 1 in chat: "Yes, and commit the changes".
Run all approved phases without intermediate approval stops.
Each phase requires passing checks, a focused review, evidence and progress updates, and a successful local commit.
Do not publish or push.
Preserve existing untracked `.agents/`, `.cursorrules`, `.editorconfig`, `AGENTS.md`, and `GEMINI.md` unless an individually reviewed change is necessary and authorized.
Do not stage those pre-existing files wholesale.
Use the three-attempt recovery policy in the shared constraints.

## Phase 1: Define the reusable workflow

Requirements: REQ-003 through REQ-010 and REQ-011.

- [x] Record actual chat approval of the baseline, feature, and plan revisions in the handoff.
- [x] Preserve the historical root implementation plan in `docs/archive/` and replace its root entry with a pointer to this active plan.
- [x] Add the focused `spec` skill and shared reusable document templates.
- [x] Update Council, implementation-plan, and personal rule templates for approvals, automatic phase continuation, bounded retries, evidence, and handoff recovery.
- [x] Resolve conflicting instructions in distributed skills without discarding their specialized review behavior.
- [x] Add honest verification evidence for this phase and update the handoff.

Verification: run `npm test`; run the skill validator on new or substantially changed skills using the available skill-creator validator.
Review the draft-to-approval, substantive-change, three-failure, and interrupted-phase scenarios against the written rules.
Record a scenario as inspected rather than executed if no agent behavior was actually exercised.
Review: no new dependency, no duplicate authoritative policy, no invented verification results, no unrelated changes.
Checkpoint: stage explicit phase paths and commit as `feat(workflow): define approved spec and handoff lifecycle`.

## Phase 2: Make startup repeatable

Requirements: REQ-001, REQ-002, and REQ-011.

- [x] Add the `start` CLI route using existing installation operations where possible.
- [x] Detect enclosing Git repositories and initialize only when needed.
- [x] Report working-tree and local commit-readiness conditions without staging, committing, or changing Git identity.
- [x] Install missing files, preserve existing files, and visibly report content differences.
- [x] Read the reusable plan template from the existing plan generator.
- [x] Add CLI-level temporary-project checks for fresh setup, repeat setup, custom-content preservation, enclosing repositories, and relevant failure paths.
- [x] Preserve existing commands and review help text for the new personal entry point.
- [x] Record test results and update the handoff.

Verification: run `npm test`, `node --check bin/cli.js`, and `node --check src/installer.js`.
Exercise `start` through the CLI in isolated temporary directories; do not bootstrap over this repository's custom instructions as a test.
Review: safe filesystem boundaries, no automatic overwrites, no shell interpolation, no approval inferred from document presence.
Checkpoint: stage explicit phase paths and commit as `feat(cli): add safe personal workflow startup`.

## Phase 3: Demonstrate and document the handoff

Requirements: REQ-004, REQ-007 through REQ-010, and REQ-012.

- [ ] Add a small fictional Flutter example that follows the full document chain and labels all unrun checks honestly.
- [ ] Rewrite the README around Len's `npx len-toolkit start` followed by `agi` workflow, local testing, and the current document hierarchy.
- [ ] Exercise document reuse, supersession, resume, and blocker-report scenarios with the example.
- [ ] Confirm distributed files are included in npm's package file selection without publishing.
- [ ] Record the limit that real Antigravity instruction consumption is unverified unless a supported local test becomes available.
- [ ] Run final checks, update evidence and the handoff, and mark completion only after the checkpoint succeeds.

Verification: run `npm test`, both source syntax checks, and `npm pack --dry-run --ignore-scripts`.
Inspect relative links and document references in new docs, templates, and example files.
No Flutter emulator or field result may be claimed from this documentation-only example.
Review: correct approval boundaries, matching feature IDs, truthful evidence, no credentials, no unnecessary scaffolding.
Checkpoint: stage explicit phase paths and commit as `docs(workflow): add personal guide and Flutter handoff example`.

## Definition of done

All three phase checkpoints exist, required checks pass, and the current handoff accurately records completion and remaining environment-specific limitations.
The original application repositories remain unchanged.
