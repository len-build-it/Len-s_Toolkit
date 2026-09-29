# Implementation Plan: Integrate UI/UX Pro Max Skills

Created: 2026-09-29T12:38:30+08:00
Updated: 2026-09-29T12:50:30+08:00
Revision: 1
Status: Completed
Feature spec and revision: [FEAT-004 revision 1](../features/FEAT-004-ui-ux-skills.md)
Target branch: `master`
Test command: `npm test`
Package check: `npm pack --dry-run --ignore-scripts`

## Overview

Bundle 7 upstream UI/UX skills from Next Level Builder's UI/UX Pro Max repository as separate toolkit templates.
Exclude heavy binary font assets and build cruft, normalize em dashes to plain dashes, and add author attribution and MIT licenses.
Update the toolkit documentation and test suite to reflect the expanded 57-skill catalog.

## Phase 1: Specification, Attributions & Baseline Structure

Requirements: FEAT-004/REQ-005 (package notice) and baseline specification.
State: Completed.

### Tasks

- [x] Create `docs/features/FEAT-004-ui-ux-skills.md`.
- [x] Create `docs/plans/FEAT-004-implementation.md`.
- [x] Create `UI-UX-SKILLS-NOTICE.md` package-level notice.
- [x] Update `docs/SPEC_INDEX.md` and root `IMPLEMENTATION_PLAN.md`.

### Verification gate

- [x] Run `npm test` to ensure existing baseline tests remain green.

### Review gate (Ponytail)

- [x] Confirm no runtime dependencies or extraneous packages were added.
- [x] Confirm all sentences are on their own lines and no em dashes exist.

### Git checkpoint

Committed as `f10cc98 docs: specify FEAT-004 UI/UX skills integration`.

### Hard stop

Stop after Phase 1 and report status and commit hash to Len before modifying templates or test suites.

## Phase 2: Bundle and Normalize UI/UX Skills

Requirements: FEAT-004/REQ-001, FEAT-004/REQ-002, FEAT-004/REQ-003, FEAT-004/REQ-004, FEAT-004/REQ-005.
State: Completed.

### Tasks

- [x] Copy the 7 skills into `templates/skills/`: `ui-ux-pro-max`, `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`.
- [x] Prune heavy binary fonts (`canvas-fonts/*.ttf`), `.coverage`, and `__pycache__` artifacts.
- [x] Normalize all em dashes to plain dashes across all bundled skill files.
- [x] Add `LICENSE` (MIT Next Level Builder) and `THIRD-PARTY-NOTICE.md` to each of the 7 skill directories.
- [x] Adjust script invocation paths in `SKILL.md` to resolve reliably across both `.agents/skills/` and `.claude/skills/`.

### Verification gate

- [x] Execute `python templates/skills/ui-ux-pro-max/scripts/search.py "minimal clean" --domain style` to confirm data search functions.
- [x] Check for any remaining em dashes across `templates/skills/`.

### Review gate (Ponytail)

- [x] Confirm zero binary assets and zero unrequested dependencies.
- [x] Confirm directory sizes are strictly text-based and lightweight.

### Git checkpoint

Committed as `2b64a2f feat(skills): bundle UI/UX Pro Max skill collection`.

### Hard stop

Stop after Phase 2 and report bundling status to Len before updating catalog documentation and installer test assertions.

## Phase 3: Catalog Documentation, Installer Test Updates & Verification

Requirements: FEAT-004/REQ-006, FEAT-004/REQ-007.
State: Completed.

### Tasks

- [x] Update `README.md` catalog counts from 50 to 57 skills, add the UI/UX Pro Max skill group, and author attribution.
- [x] Update `test/installer.test.js` to expect all 57 skills and verify license/notice files for UI/UX skills.
- [x] Update `test/existing-repo.test.js` line 158 assertion for 57 unchanged skills.
- [x] Create `docs/evidence/FEAT-004-verification.md` recording test run results.
- [x] Update `HANDOFF.md` and mark `IMPLEMENTATION_PLAN.md` complete.

### Verification gate

- [x] Run `npm test` (all 85 tests passing).
- [x] Run `npm pack --dry-run --ignore-scripts` to verify valid package output.
- [x] Verify working tree is clean.

### Review gate (Ponytail)

- [x] Verify no unnecessary changes were made outside the scope of FEAT-004.

### Git checkpoint

Commit the reviewed phase as `test(skills): verify UI/UX skills installation and documentation`.

### Hard stop

Present final summary and commit hash to Len.
Versioning, release, and npm publishing remain user-controlled.
