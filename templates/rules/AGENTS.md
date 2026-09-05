# Len's personal coding workflow

## Start and resume

At each coding session, run `npx len-toolkit start` if setup has not been checked in that session.
Use the local source command when developing this toolkit before publication.
Inspect reported instruction differences and preserve custom content; setup success is not permission to implement.
Read `docs/SPEC_INDEX.md`, the current root `HANDOFF.md`, and its linked approved documents before implementation.
If no handoff exists, use the spec workflow to create the missing documents and obtain approval first.
Inspect Git status and reconcile files with the handoff rather than trusting prior conversation memory.

## Specification and authority

GPT explores the entire product with Len, then details features individually.
GPT proposes architecture; Len approves the product baseline and architecture in chat, then each feature spec and implementation plan.
Record approval against exact document revisions or a Git commit; never invent an approval record.
Gemini follows the approved architecture and scope, reports disagreements, and does not silently redesign or add features.
Changes to behavior, acceptance criteria, or architecture require new approval for affected work.
Editorial corrections do not expand authorized behavior.
Search current specs before creating documents, update overlapping specs, and archive superseded documents with replacement links.
Keep stable filenames, feature and requirement IDs, and Philippine-time ISO 8601 timestamps inside documents.
Keep behavior in specs, execution tasks in plans, actual results in evidence, and one current handoff pointing to them.
Choose the Flutter or web stack per project.

## Phase execution and commits

Execute every approved phase without routine approval stops.
For each phase: implement, run required checks, review correctness and scope, record evidence and progress, and commit only reviewed phase-related paths.
Inspect the staged diff and preserve unrelated staged or unstaged work; never use blanket staging.
A phase is complete only when its checks pass and Git confirms a successful commit.
Use a unique conventional phase commit message as the checkpoint reference; verify its hash from Git after committing.
Do not make extra commits just to insert a commit's own hash into that same commit.
Continue to the next approved phase after the checkpoint succeeds.
A failed check or commit leaves the phase incomplete; interrupted or failing work stays uncommitted.
Update the current handoff with completed work, unfinished work, actual checks, attempts, and the next action before ending a session.
Never push, reset, discard edits, or overwrite working features without explicit authorization.

## Failure recovery

Reproduce bugs through the real user flow where possible, then trace shared callers before editing.
Investigate and fix within the approved design.
Allow at most three unsuccessful fix-and-check attempts for the same unresolved problem after its initial observed failure.
Persist counts and attempted fixes in the handoff across sessions; renaming a problem does not reset its count.
After the third unsuccessful attempt, stop affected work and report evidence, attempted fixes, outstanding edits, and what is needed to proceed.
Stop affected work immediately for a required user decision, unavailable access or hardware, or necessary scope/architecture changes.
Continue independent approved work only when it does not rely on the blocked decision.
Fix failures caused by or blocking the approved work; report other issues separately rather than expanding scope.

## Evidence and engineering

Use existing code, the standard library, and native platform features before adding custom machinery.
No new dependency without Len's authorization.
Preserve input validation, error handling, security, accessibility, existing working features, and tests.
Record actual verification commands or scenarios, results, conditions, timestamps, and limitations.
Never describe an unrun check as passing or implementation as proof of real-world effectiveness.
Emulator checks establish emulator behavior; Len handles physical-device validation.
Keep emulator, physical-device, hardware-bench, and field evidence separate and pending until actual results exist.
Attach screenshots for meaningful UI checks when capture is available.
Do not put credentials or secrets in specs, handoffs, examples, or evidence.
Use plain dashes, not em dashes, and one full sentence per line in long Markdown.
Do not manually edit CHANGELOG.md or generated files, and do not add an agent co-author to commits.
