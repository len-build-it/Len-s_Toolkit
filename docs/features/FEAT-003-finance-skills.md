# FEAT-003: Integrate Finance Skills

Created: 2026-09-28T10:35:46+08:00
Updated: 2026-09-28T11:00:38+08:00
Revision: 1
Status: Approved revision 1; implemented and verified

## Purpose and success

Len's Toolkit should include the finance and research skills from Alex Yang's Finance Skills repository in its distributable skill catalog.
Success means users can install each skill through the existing toolkit flow, retain its supporting reference files, and see clear source attribution and license information.

## Requirements

- FEAT-003/REQ-001: Bundle all 26 upstream skills as separate skill directories under `templates/skills/`, including README and reference files, with documentation links adapted for the flat layout.
- FEAT-003/REQ-002: Include the upstream MIT license, Alex Yang attribution, and educational-use disclaimer with every separately installed finance skill.
- FEAT-003/REQ-003: Update the README catalog and skill totals, and include a package-level attribution notice.
- FEAT-003/REQ-004: Preserve the toolkit's dependency-free install flow and make no changes to external service configuration.
- FEAT-003/REQ-005: Verify the catalog installs all 50 skills into `.agents/skills/` and mirrors license notices into `.claude/skills/`.

## Source and adaptations

Source repository: [himself65/finance-skills](https://github.com/himself65/finance-skills).
The bundled source snapshot is commit `7fe91853b536304b13bce210ecf8b685cf77ec48` from 2026-09-25.
The upstream copyright holder is Alex Yang, and the upstream license is MIT.
Em dash punctuation was normalized to the toolkit's plain dash style, relative links were adapted for standalone skill folders, and per-skill attribution and disclaimer files were added.
These skills may refer to external APIs, applications, agent tools, or MCP servers that the toolkit does not install or configure.
The upstream opencli adapters and MCP configuration are not bundled.

## Approval

Len authorized this integration in chat on 2026-09-28: "Integrate skills from this repo: https://github.com/himself65/finance-skills.git Make sure to credit the owner in the documentations."
