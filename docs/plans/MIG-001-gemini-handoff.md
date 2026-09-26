# Gemini handoff: Superpowers migration (Discontinued / Historical Archive)

Created: 2026-09-11T09:45:43+08:00
Updated: 2026-09-20T21:40:00+08:00
Revision: 5
Status: Discontinued and cancelled; Len decided not to proceed with migrating to the Superpowers fork and will continue maintaining and improving Len's Toolkit directly.

> [!NOTE]
> Migration to the Superpowers fork has been cancelled.
> Len decided not to go along with this migration plan and will stay improving Len's Toolkit as an active project.
> Len's Toolkit is active, unarchived, and remains the primary active toolkit.

## Read first

1. Read [the exact Len guidelines](../../AGENTS.md).
2. Read [MIG-001 implementation plan](../../IMPLEMENTATION_PLAN.md) completely.
3. Inspect Git state and the files relevant to the next approved phase.

The [archived FEAT-001 handoff](../archive/FEAT-001-handoff.md) records FEAT-001 history, not authority for this migration.
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
- Phase 2: completed and verified (fork at `len-build-it/superpowerfork.git`, branch `codex/superpowers-migration`, exact policy verified in `docs/len/AGENTS.original.md`, adapter and loading mechanisms active).
- Phase 3: completed and verified (mode selector added, Council and Ponytail suite integrated, process skills gated, tests passing).
- Phase 4: completed and verified (cross-client discovery, upstream sync rehearsal clean, 13/13 behavioral matrix tests passing).
- Phase 5: completed and verified (rollout guide published in fork `docs/len/ROLLOUT.md`, legacy toolkit retired, successor documented).
- Successor Repository: `https://github.com/len-build-it/superpowerfork.git` (historical; migration discontinued).
- Active Execution Records: Maintained in `superpowers/docs/len/`.
- Cancellation update (2026-09-20): Migration cancelled.
  Len decided not to proceed with the Superpowers fork migration.
  Active development remains focused on Len's Toolkit, continuously improving its collection of tools and skills.
- Failed implementation attempts: none.

Update the active handoff with approved phase, current mode, exact commit, checks, failed attempts, unfinished changes, pending decisions, and next action at each checkpoint or interruption.
Never replace actual verification with checked boxes or a claim that a skill should work.
