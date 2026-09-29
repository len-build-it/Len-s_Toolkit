# FEAT-004: Integrate UI/UX Pro Max Skills

Created: 2026-09-29T12:38:30+08:00
Updated: 2026-09-29T12:38:30+08:00
Revision: 1
Status: Draft revision 1

## Purpose and success

Len's Toolkit should bundle and distribute the UI/UX skills from Next Level Builder's UI/UX Pro Max repository.
Success means users can install each UI/UX skill through the existing toolkit workflow, retain supporting data catalogs and scripts, and receive clear author attribution and MIT licensing.

## Requirements

- FEAT-004/REQ-001: Bundle the 7 upstream UI/UX skills (`ui-ux-pro-max`, `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`) under `templates/skills/`.
- FEAT-004/REQ-002: Exclude heavy binary font files (`canvas-fonts/*.ttf`), test coverage, and build cache artifacts to keep the package lightweight and text-focused.
- FEAT-004/REQ-003: Normalize all em dash punctuation to plain dashes across all bundled skill files.
- FEAT-004/REQ-004: Ensure script execution paths in `SKILL.md` files point to relative local paths compatible with both `.agents/skills/` and `.claude/skills/`.
- FEAT-004/REQ-005: Include the upstream MIT license, Next Level Builder attribution, and notices (`THIRD-PARTY-NOTICE.md` and `LICENSE`) with every separately installed UI/UX skill.
- FEAT-004/REQ-006: Update the README catalog, skill totals (increasing from 50 to 57 skills), and include a package-level attribution notice in `UI-UX-SKILLS-NOTICE.md`.
- FEAT-004/REQ-007: Update test assertions in `test/installer.test.js` and `test/existing-repo.test.js` to verify all 57 skills install and mirror cleanly into both `.agents/skills/` and `.claude/skills/`.

## Source and adaptations

Source repository: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).
The bundled source snapshot is commit `09170eec67eefd46a7ae85de61b40c194020f997` from 2026-09-27.
The upstream copyright holder is Next Level Builder, and the upstream license is MIT.
Em dash punctuation is normalized to the toolkit's plain dash style.
Binary font assets are excluded in favor of standard system and web font recommendations.
Per-skill attribution and license notices are provided in each skill folder.

## Approval

Len requested this integration in chat on 2026-09-29: "I'd like you to integrate ui ux skills from here too: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git".
