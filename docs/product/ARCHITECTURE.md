# Len's Toolkit architecture

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:19:52+08:00
Revision: 1
Status: Approved by Len in chat (revision 1)

## Observed foundation

The package is a dependency-free Node.js CLI with command routing in `bin/cli.js`, installation helpers in `src/installer.js`, and distributable content in `templates/`.
It uses built-in Node tests and currently advertises Node 18 or newer.
Installed workspace instructions can be customized and must not be overwritten by ordinary startup.
The shell used for this drafting session did not resolve `agi`; its instruction-loading behavior has not been verified here.

## Proposed implementation

Extend the existing CLI with `start`; retain existing commands for compatibility.
Use Node standard-library filesystem operations and `execFileSync` or its asynchronous equivalent for Git commands, without shell interpolation.
Keep routing in the CLI and setup operations in the existing installer module unless a distinct, necessary responsibility makes a separate file clearer.
Add no runtime dependency, background service, database, or agent launcher.

Startup checks Git availability, detects an existing enclosing worktree, and initializes a repository only when no repository exists.
It never creates a nested repository merely because the current directory lacks a `.git` directory.
It reports the current branch, dirty working tree, and missing local commit identity without modifying identity settings or staging files.
It installs missing local toolkit instructions and skills, compares existing distributed files with their proposed versions, and reports differences without overwriting them.
A difference may be a customization rather than an outdated file; startup must not pretend to know which.
Setup failures return a nonzero result with a concrete next action.

Startup does not manufacture approval or infer that a document's existence authorizes execution.
It reports setup checks separately from documents needing agent review.
It does not automatically populate a second spec system in a repository that already has specifications.
The spec workflow first inventories existing documents and either adopts the existing convention or proposes a migration.

## Rules, skills, and templates

Use project `AGENTS.md` as the shared workflow policy and a short `GEMINI.md` entry point directing Gemini to that policy, the spec index, and the current handoff.
Keep local skills under the existing `.agents/skills/` convention.
Verify Antigravity consumption in Len's environment before claiming automatic discovery works there; explicit handoff instructions remain available regardless of discovery.
Add one focused `spec` skill for product discovery, feature requirements, document reuse, and approval recording.
Update Council to feed approved specifications rather than jump straight into implementation.
Update the implementation-plan skill to follow the approved phase lifecycle and three-attempt limit.
Keep Ponytail's simplicity and correctness principles, removing conflicting workflow instructions and unnecessary copies of shared policy.
Retain other existing editor and global-install commands for compatibility, but document the personal local GPT/Antigravity path as the primary workflow.

Store reusable Markdown document templates under `templates/docs/`.
Use the same plan template for CLI generation and agent guidance rather than maintaining independent plan bodies.
The template uses explicit unknown fields where branch names or verification commands have not been checked.
No placeholder command is represented as a verified project command.

## Authority and recovery

Approved product and feature documents define behavior and architecture.
Approved plans define the permitted execution phases.
The handoff points to these authorities and records current execution state; it must not redefine their requirements.
Gemini reports disagreements but follows approved decisions unless affected work is blocked by an actual failure, unsafe operation, missing access, or required decision.
An architecture or scope change invalidates approval for affected work until Len approves the revised documents.
Unrelated approved work may continue only when it does not depend on the blocked decision.

Phase completion requires verification, evidence, updated progress, and a successful commit containing only phase-related changes.
Record the checkpoint identity using the plan's unique phase commit message and verify the resulting commit in Git; the next handoff update may include its hash.
Do not create an endless sequence of commits merely to insert a commit's own hash into that same commit.
Do not push or reset automatically.

## Trade-offs and failure modes

Markdown and agent instructions keep the toolkit small and inspectable, but cannot guarantee agent obedience or interpret the truth of approval text.
Behavioral exercises and real use are needed in addition to installation tests.
Preserving existing files prevents data loss but leaves conflicts for review; startup must report them visibly instead of claiming everything was upgraded.
Stable document paths reduce duplicate creation, while revision identifiers prevent an old approval from silently covering new behavior.
Automatic phase continuation removes routine pauses; verified checkpoints, scope boundaries, and bounded retries provide recovery points.
