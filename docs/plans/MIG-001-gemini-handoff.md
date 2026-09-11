# Gemini handoff: Superpowers migration

Created: 2026-09-11T09:45:43+08:00
Revision: 3
Status: Phase 1 completed and verified; Phase 2 approval pending.

## Read first

1. Read [the exact Len guidelines](../../AGENTS.md).
2. Read [MIG-001 implementation plan](../../IMPLEMENTATION_PLAN.md) completely.
3. Inspect Git state and the files relevant to the next approved phase.

The root [legacy HANDOFF.md](../../HANDOFF.md) records FEAT-001 history, not authority for this migration.
The completed banner plan is historical; do not resume or overwrite it.
Do not run `npx len-toolkit start` as a migration prerequisite.

## Objective

Preserve Len's Toolkit and its exact `AGENTS.md`, then create a separate Superpowers fork with explicit Plan, Code, Review, Search, and Off selection.
Retain Superpowers' generic workflow and integrate Len's existing Ponytail and Council preferences.
Prove that the exact policy reaches consuming projects; a file in the fork root alone does not establish this.
Keep original guideline wording distinct from approved mode-related interpretations.

## Authority and constraints

Len requested preparation of this plan for execution by Gemini.
No migration phase has been executed or approved by the plan's author.
Use one agent; do not invoke upstream subagent execution or review workflows unless Len explicitly changes this constraint.
After every phase, verify, review, commit reviewed paths, report, and wait for Len before the next phase.
Mode selection does not waive any outstanding approval or expand permissions.
Do not publish npm packages, submit upstream PRs, delete the legacy checkout, or alter unrelated projects.
The old GitHub archive request remains paused until resumed under the plan's gates.

## Initial checkpoint

- Legacy remote: `https://github.com/len-build-it/Len-s_Toolkit.git`.
- Pre-plan commit: `c85e261923ab56a00e8fac9395c6f767aff4b2c9` on `master`.
- Exact root policy SHA-256: `86EE90450B7032F2CC0AED01DE32F069D81E555F6BBAEE08B286528861433463`.
- Archive, fork, installation, and global disable operations: not performed.
- GitHub CLI: unavailable at the previous check; rediscover tools and authentication safely.

## First action

Read the plan, inspect the current repository without running setup, and ask Len to approve Phase 1 if this handoff arrives without execution approval.
Phase 1 resolves fork owner/name, checkout and backup locations, supported clients, policy interpretations, exact upstream revision, validation commands, and runtime policy loading.
Do not guess those targets or claim unresolved behavior is supported.
After forking, carry the execution records into the new checkout, identify the new active paths, and leave legacy links as history rather than maintaining two progress ledgers.

## Progress record

- Phase 1: completed and verified.
  Archive bundle created and verified at `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\backups\Len-s_Toolkit_backup_2026-09-11\Len-s_Toolkit.bundle`.
  Restored archive verified matching commit `22d127a` and policy hash `86EE90450B7032F2CC0AED01DE32F069D81E555F6BBAEE08B286528861433463`.
  Approved fork: `len-build-it/superpowers` at `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\superpowers`.
  Approved backup path: `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\backups\Len-s_Toolkit_backup_2026-09-11`.
  Primary validation client: Antigravity / Gemini CLI.
  Pinned upstream revision: `obra/superpowers` tag `v6.3.0` at `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.
  Mode contract and policy interpretations: approved per MIG-REQ-02 and MIG-REQ-03.
- Phase 2: pending Len's explicit confirmation to proceed.
- Phase 3: not started.
- Phase 4: not started.
- Phase 5: not started.
- Failed implementation attempts: none; baseline tests passed (46/46 passed).

Update the active handoff with approved phase, current mode, exact commit, checks, failed attempts, unfinished changes, pending decisions, and next action at each checkpoint or interruption.
Never replace actual verification with checked boxes or a claim that a skill should work.
