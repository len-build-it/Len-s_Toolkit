# Implementation Plan: Integrate Finance Skills

Created: 2026-09-28T10:35:46+08:00
Updated: 2026-09-28T11:00:38+08:00
Revision: 1
Status: Completed
Feature spec and revision: [FEAT-003 revision 1](../features/FEAT-003-finance-skills.md)
Target branch: `master`
Test command: `npm test`
Package check: `npm pack --dry-run --ignore-scripts`

## Overview

Bundle the 26 upstream skills as separate toolkit templates so the existing installer discovers and copies them automatically.
Include each skill's supporting files, MIT license, attribution, and educational-use notice.

## Phase 1: Bundle the upstream skill collection

Requirements: FEAT-003/REQ-001 through FEAT-003/REQ-005.
State: Completed.

### Tasks

- [x] Copy all 26 skill folders and their supporting files under `templates/skills/`.
- [x] Add per-skill attribution, license, and financial-use disclaimer files, and add a package-level notice.
- [x] Repair links that relied on the upstream plugin layout and identify separately installed plugin requirements.
- [x] Update README counts, catalog groups, and attribution.
- [x] Update installer expectations and verify notices in both installed skill roots.
- [x] Update the spec index, handoff, and verification evidence.

### Verification gate

- [x] Run `npm.cmd test`.
- [x] Run `npm.cmd pack --dry-run --ignore-scripts --json` and confirm the finance skill files and package notice are included.
- [x] Check that relative Markdown links in the bundled finance skills resolve after flattening the skill folders.
- [x] Run `git diff --cached --check` during the phase checkpoint.

### Review gate

- [x] Confirm no runtime dependency or external service configuration was added.
- [x] Confirm all 99 source files are present and every finance skill includes `SKILL.md`, `LICENSE`, and `THIRD-PARTY-NOTICE.md`.
- [x] Confirm all 50 bundled skills install and the finance notices are mirrored into both supported skill roots.

### Git checkpoint

Commit the reviewed phase as `feat(skills): add finance and research skill collection`.

### Hard stop

Stop after the phase checkpoint and report its checks and commit hash.
No additional phase is required for this feature.
