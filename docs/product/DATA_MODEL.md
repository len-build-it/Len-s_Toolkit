# Len's Toolkit document model

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:19:52+08:00
Revision: 1
Status: Approved by Len in chat (revision 1)

The toolkit stores workflow state in readable Markdown and local Git history, not a database.

| Document | Owns | Links to |
| --- | --- | --- |
| `docs/SPEC_INDEX.md` | Current paths, categories, document statuses, replacements | Product documents, feature specs, plans, evidence, archive |
| `docs/product/OVERVIEW.md` | Users, problem, planned capabilities, main flows, non-goals | Feature specs |
| `docs/product/ARCHITECTURE.md` | Approved system design and boundaries, decisions and assumptions | Data model, constraints |
| `docs/product/DATA_MODEL.md` | Shared entities, interfaces, validation, ownership | Relevant features |
| `docs/product/CONSTRAINTS.md` | Shared platform, security, privacy, reliability, and evidence rules | Feature-specific exceptions |
| `docs/features/FEAT-NNN-name.md` | Feature behavior and stable requirement IDs | Shared baseline and verification criteria |
| `docs/plans/FEAT-NNN-implementation.md` | Tasks, phases, exact checks, progress | Requirement IDs and evidence |
| `HANDOFF.md` | One current scope, approval references, progress, blockers, next action | Authoritative files and Git checkpoints |
| `docs/evidence/FEAT-NNN-verification.md` | Checks actually run, results, conditions, limitations | Requirement IDs and phase |
| `docs/archive/` | Superseded historical documents and replacement references | Current replacement |

Use ISO 8601 creation and substantive-update timestamps with Philippine offset `+08:00`.
Use stable active filenames rather than a new dated filename for each session.
Use sequential feature IDs allocated after checking the index; requirement IDs are unique within a feature and referenced as `FEAT-001/REQ-001` across documents.
Product and feature documents record a revision and status of Draft, Approved, or Superseded.
Approval records identify Len's explicit chat approval and the exact approved document revisions or Git commit.
Never invent approval dates, quotations, commit hashes, or test outcomes.
Editorial corrections retain approval only when they do not change requirements, acceptance criteria, or architecture.
Substantive changes create a new revision requiring approval for affected work.

The handoff records the active feature, approved revisions, allowed phases, current phase, existing unrelated edits, checks performed, unresolved issues, per-problem attempt counts, and next action.
Verification records distinguish Not run, Passed under stated conditions, Failed, and Blocked.
Emulator, physical-device, hardware-bench, and field results are separate evidence categories.
Plan state distinguishes Awaiting approval, Ready, In progress, Blocked, and Completed.
A drafted or approved spec is not evidence that a feature is implemented or works.
