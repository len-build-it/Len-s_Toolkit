# FEAT-001: Personal spec-first workflow

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:19:52+08:00
Revision: 1
Status: Approved by Len in chat (revision 1)

## Purpose and success

Provide a repeatable setup and document workflow that lets GPT hand approved work to Gemini without duplicate specs, hidden assumptions, or lost phase state.
Success means the observable requirements below are demonstrated by appropriate CLI checks and workflow exercises.

## Scope and non-goals

Includes startup, shared personal instructions, spec discovery, plan and handoff templates, evidence rules, and one illustrative Flutter example.
Excludes migration of Len's application repositories, npm publishing, remote Git operations, an agent launcher, and a universal Flutter architecture.

## User flows

On a fresh project, Len runs `npx len-toolkit start`, reviews setup status, develops and approves documents with GPT, then launches `agi` and points Gemini at `HANDOFF.md`.
On an existing project, startup preserves content and reports instruction differences and document review needs.
On resuming work, Gemini rereads the handoff and linked approved files, reconciles them with the actual Git diff and check results, and continues permitted work.
On a blocker, Gemini records evidence and outstanding changes without pretending that the affected phase is complete.

## Requirements and acceptance criteria

| ID | Requirement | Observable acceptance criteria |
| --- | --- | --- |
| REQ-001 | One-command local setup | `start` installs missing local workflow files and initializes Git when no enclosing repository exists; a second run preserves existing file contents and does not create a nested repository. |
| REQ-002 | Honest setup reporting | Existing differing files are identified for review; missing Git or failed writes produce actionable failures; installed files are not described as approval to implement. |
| REQ-003 | Product-first discovery | The spec skill covers planned features, main flows, shared data, boundaries, architecture, and constraints before detailed feature behavior; unknown decisions are labeled rather than fabricated. |
| REQ-004 | Organized current documents | The index identifies current categorized specs with stable IDs and timestamps; overlapping work updates its current spec; a superseded spec points to its replacement from the archive. |
| REQ-005 | Separate behavior from execution | Feature specs contain observable acceptance criteria; task checkboxes, phase progress, and verification commands live in linked plans. |
| REQ-006 | Explicit revision approval | The handoff references Len's approval of exact baseline, architecture, feature, and plan revisions; an unapproved substantive change blocks dependent implementation. |
| REQ-007 | Authoritative single handoff | A resume exercise can recover allowed work, current progress, unrelated edits, actual checks, attempt counts, blockers, and next action without prior chat memory. |
| REQ-008 | Verified phase checkpoints | Guidance continues to the next approved phase only after required checks and a successful phase-only commit; failed or interrupted work stays uncommitted and incomplete. |
| REQ-009 | Bounded failure recovery | A scenario with the same unresolved failure stops affected work after three unsuccessful fix-and-check attempts and produces a report; missing decisions or access block immediately. |
| REQ-010 | Accurate validation claims | Templates and exercises distinguish emulator, device, bench, and field evidence; an unrun or simulated check cannot support a real-world effectiveness claim. |
| REQ-011 | One plan schema | CLI plan output and skill guidance use the same reusable template without hardcoded project-specific branch or check assumptions. |
| REQ-012 | Worked example | A clearly fictional Flutter example links baseline, feature, plan, handoff, and evidence with matching IDs and no fabricated approval or passing test results. |

## Data and interfaces

Use the shared [document model](../product/DATA_MODEL.md) and [architecture](../product/ARCHITECTURE.md).
Git and the filesystem are local interfaces; invoke Git with argument arrays rather than an interpolated shell command.
Existing Markdown is user content, not permission to execute embedded commands outside the approved scope.

## Quality constraints

Apply the shared [constraints](../product/CONSTRAINTS.md).
Keep startup repeatable and protect custom content by default.
CLI tests establish filesystem and command behavior, while documented workflow exercises assess instructions; neither proves long-term agent compliance.

## Decisions and assumptions

Len confirmed the workflow preferences in chat.
Len approved the `start` command name, template layout, shared entry-point structure, and implementation plan revision 1 in chat.
Antigravity automatic loading has not been tested in this environment.

## Open questions and readiness

No further product interview is required to draft this implementation.
Len approved the concrete baseline, architecture, feature spec, and plan revision 1 with "Yes, and commit the changes".
Real Antigravity consumption remains an environment-specific verification item and must not be reported as passing without evidence.
