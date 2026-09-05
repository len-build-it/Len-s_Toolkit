---
name: implementation-plan
description: >
  Create, execute, or resume a phased plan from Len's approved feature spec.
  Use for implementation planning, phase execution, or plan status.
  Requires approval before execution, then continues through verified phase
  commits until completion or a real blocker.
license: MIT
---

# Implementation planning and execution

Read project `AGENTS.md` and the current handoff for authority, commits, recovery, and evidence policy.
For planning, read the approved product baseline, architecture, and feature spec before choosing tasks.
An approved spec alone does not approve a new plan.

## Create a plan

Use `.agents/templates/docs/IMPLEMENTATION_PLAN.md`, installed by `len-toolkit start`.
In the toolkit source checkout, the same source template is `templates/docs/IMPLEMENTATION_PLAN.md`.
Write the active feature plan under `docs/plans/FEAT-NNN-implementation.md` unless an existing convention applies.
Keep a root `IMPLEMENTATION_PLAN.md` pointer when useful; do not maintain a second task checklist there.
Link tasks and verification to stable requirement IDs.
Choose the number of phases by testable outcomes, with one phase sufficient for small work.
Inspect actual branch, existing edits, scripts, and environment before filling commands; unresolved placeholders cannot pass a readiness gate.
Present the feature spec and plan to Len for chat approval and record exact approved revisions in the current handoff.

## Execute or resume

Reread the approved files and reconcile plan state with actual Git status and evidence.
Do not treat a checked box as proof that a command ran or a commit succeeded.
Implement only the approved phase, verify with its required commands or scenarios, and review the diff for correctness and Ponytail simplicity.
Update evidence, task progress, and handoff; stage only the reviewed phase paths and verify the staged diff.
Complete the checkpoint only when Git confirms the phase commit succeeded.
Proceed automatically through the remaining approved phases without requesting routine sign-off.
If execution is interrupted, preserve edits uncommitted and record the exact next step.

## Failure report

Follow the shared three-attempt limit, counting attempted corrections followed by a check for the same problem.
Report the failed requirement or gate, actual error, each attempt and result, outstanding edits, dependent work blocked, and the smallest decision or access needed.
Do not reset counts between sessions or substitute a different architecture to force progress.
