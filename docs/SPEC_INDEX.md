# Len's Toolkit specification index

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:31:32+08:00
Status: Approved baseline; implementation verified, subject to final checkpoint

Len approved the baseline, architecture, feature, and plan revision 1 in chat with "Yes, and commit the changes".

| Category | Current document | Status |
| --- | --- | --- |
| Product | [Overview](product/OVERVIEW.md) | Approved revision 1 |
| Architecture | [Architecture](product/ARCHITECTURE.md) | Approved revision 1 |
| Data | [Document model](product/DATA_MODEL.md) | Approved revision 1 |
| Constraints | [Constraints](product/CONSTRAINTS.md) | Approved revision 1 |
| Feature FEAT-001 | [Personal spec-first workflow](features/FEAT-001-spec-first-workflow.md) | Approved revision 1 |
| Plan FEAT-001 | [Implementation](plans/FEAT-001-implementation.md) | Verified; see handoff checkpoint |
| Current handoff | [HANDOFF.md](../HANDOFF.md) | FEAT-002, executing |
| FEAT-001 handoff | [Archived handoff](archive/FEAT-001-handoff.md) | Historical |
| Plan CLAUDE-001 | [Automatic Claude Code support](plans/CLAUDE-001-implementation.md) | Completed; approved by Len in chat |
| Feature FEAT-002 | [Coexist with existing repository skills](features/FEAT-002-existing-repository-skills.md) | Approved revision 1 |
| Plan FEAT-002 | [Implementation](plans/FEAT-002-implementation.md) | Approved revision 1; executing |

## Cancelled migration planning (historical archive)

Updated: 2026-09-20T21:40:00+08:00
Status: Discontinued and cancelled

The proposed migration to a modified Superpowers fork (MIG-001) has been discontinued.
Len decided not to proceed with that migration plan and will continue maintaining and improving Len's Toolkit directly.
The migration handoff ([plans/MIG-001-gemini-handoff.md](plans/MIG-001-gemini-handoff.md)) and verification evidence ([evidence/MIG-001-verification.md](evidence/MIG-001-verification.md)) are retained solely for historical reference.
Active implementation planning is maintained in the root [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md).
The FEAT-001 handoff is archived and is not an active migration entry point.
The [completed banner plan](plans/BUG-001-responsive-banner.md) remains available for history.

The [earlier plan](archive/npm-publish-implementation.md) is archived historical context, not current instructions.
[Verification evidence](evidence/FEAT-001-verification.md) records actual checks and limitations.
Active documents use stable filenames; timestamps belong inside documents.
Update an existing document when its scope already covers the change.
Archive superseded documents with links to their replacements and update this index.
