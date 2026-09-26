# Implementation Plan: Coexist with existing repository skills

Created: 2026-09-26T14:23:14+08:00
Updated: 2026-09-26T14:38:58+08:00
Revision: 1
Status: Completed
Feature spec and revision: [FEAT-002 revision 1](../features/FEAT-002-existing-repository-skills.md)
Approved baseline and architecture revisions: Product documents revision 1; architecture delta proposed in FEAT-002 revision 1
Len's chat approval: "Yes, Yes, Yes. Proceed. Commit to main/master then" (2026-09-26)
Target branch: master (verified 2026-09-26, clean tree at `fd737a1`)

## Scope

Implements FEAT-002/REQ-001 through FEAT-002/REQ-008.
No existing edits to preserve; the tree is clean after the CLAUDE-001 commits.
Tests that assert overwrite-everything `update` behavior are changed intentionally and listed per phase.
No new dependencies.

## Phase 1: Pure skill sync policy

Requirements: FEAT-002/REQ-001, FEAT-002/REQ-002, FEAT-002/REQ-003, FEAT-002/REQ-004, FEAT-002/REQ-005
State: Completed

### Tasks

- [x] On approval, record Len's approval of FEAT-002 revision 1 and this plan revision 1 in root `HANDOFF.md`, `docs/SPEC_INDEX.md`, and this plan.
- [x] Add `src/skill-sync.js` with `hashContent` (CRLF-normalized SHA-256 via `node:crypto`) and pure `planSkillSync({ bundled, installed, record, mode })`.
- [x] Cover every state and mode combination: absent, owned-unmodified, owned-modified, owned-but-deleted, unowned same-name, link, non-directory, retired owned skill, missing record.
- [x] Add `test/skill-sync.test.js` with a table-driven test per state and mode, a CRLF-equivalence test, and a boundary test asserting the module imports no `node:fs`, `node:child_process`, or `node:process`.

### Verification

- [x] `npm test` passes all existing and new tests on Windows with Node 24.14.0.
- [x] `node --check src/skill-sync.js` exits 0.

### Review and checkpoint

- [x] Review correctness, scope, dependencies, and unrelated changes (Ponytail and Clean Architecture checklists).
- [x] Update plan progress and the handoff.
- [x] Stage only phase-related paths and verify the staged diff.
- [x] Commit and verify Git reports success.

Checkpoint message: `feat(skills): add ownership-aware skill sync policy`

## Phase 2: Wire the policy into every install path

Requirements: FEAT-002/REQ-001 through FEAT-002/REQ-006, FEAT-002/REQ-008
State: Completed

### Tasks

- [x] In `src/installer.js`, add an adapter that reads a skills root into plain data (refusing links as `start` does), applies planned actions with the existing copy helpers, and writes `.len-toolkit.json`.
- [x] Route `installSkills`, `updateSkills`, and the skill entries of `startWorkspace` through the adapter for both `.agents/skills/` and `.claude/skills/`, keeping the existing return values used by callers.
- [x] Add `--adopt` to `update` in `bin/cli.js`, extend `update --force` to modified owned skills, and print the per-skill summary.
- [x] Update tests that assert the old behavior: `test/installer.test.js` (updateSkills overwrite tests) and `test/cli.test.js` (update command test) now use owned skills.
- [x] Add integration tests reproducing the observed problem: team `refactoring/` and `deploy/` unchanged under `start`, `skills`, `--yes`, `update`, and `update --force`; legacy root reported then adopted with `--adopt`; retired owned skill removed only when unmodified; junction under `.claude/skills/` refused by `skills` and `update`.

### Verification

- [x] `npm test` passes; `node --check` passes for `bin/cli.js`, `src/installer.js`, and `src/skill-sync.js`.
- [x] End-to-end: rerun the reproduction repository from FEAT-002 with `npm exec --offline --package=<checkout> -- len-toolkit start`, then `update`; `git status` shows no change inside `refactoring/` or `deploy/`.
- [x] End-to-end: headless Claude Code in that repository lists the team `refactoring` and `deploy` skills plus the toolkit skills, and does not report `.len-toolkit.json` as a skill or error.
- [x] Record actual commands, results, versions, and limitations in `docs/evidence/FEAT-002-verification.md`.

### Review and checkpoint

- [x] Review correctness, scope, dependencies, and unrelated changes.
- [x] Update plan, evidence, and the handoff.
- [x] Stage only phase-related paths and verify the staged diff.
- [x] Commit and verify Git reports success.

Checkpoint message: `feat(skills): preserve project-owned skills during install and update`

## Phase 3: Claude Code policy reporting and documentation

Requirements: FEAT-002/REQ-007
State: Completed

### Tasks

- [x] In `startWorkspace`, detect an existing `CLAUDE.md` without an `@AGENTS.md` import and return a specific notice; print it in `bin/cli.js` instead of the generic difference line for that file.
- [x] Add a startup test for both cases (import present, import missing) confirming `CLAUDE.md` is never modified.
- [x] Update `README.md` (existing repositories, ownership record, `--adopt`, `--force` scope) and `docs/product/ARCHITECTURE.md` to revision 2 with the skill ownership boundary.
- [x] Mark the FEAT-002 rows in `docs/SPEC_INDEX.md` as completed.

### Verification

- [x] `npm test`, the three `node --check` commands, `git diff --check`, and `npm pack --dry-run --ignore-scripts` (package includes `src/skill-sync.js`).
- [x] End-to-end: `start` in the reproduction repository prints the `@AGENTS.md` notice for the team `CLAUDE.md`.
- [x] Append results to `docs/evidence/FEAT-002-verification.md`.

### Review and checkpoint

- [x] Review correctness, scope, dependencies, and unrelated changes.
- [x] Update plan, evidence, and the handoff.
- [x] Stage only phase-related paths and verify the staged diff.
- [x] Commit and verify Git reports success.

Checkpoint message: `docs(skills): report Claude Code policy loading and document existing-repository support`

## Recovery

Follow project `AGENTS.md` for the three-attempt limit and immediate blockers.
If end-to-end checks show Claude Code treats `.len-toolkit.json` as a skill or an error, stop and report before choosing another record location, because that changes FEAT-002 data interfaces.
Record unresolved work and attempt counts in the current handoff.
Interrupted or failing work remains uncommitted and the phase remains incomplete.
