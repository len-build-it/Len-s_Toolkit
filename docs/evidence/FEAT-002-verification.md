# FEAT-002 verification evidence

Created: 2026-09-26T14:28:12+08:00
Updated: 2026-09-26T14:38:58+08:00
Environment: Windows 11, Node 24.14.0, Git for Windows, Claude Code 2.1.283

## Baseline reproduction

Recorded in [the FEAT-002 spec](../features/FEAT-002-existing-repository-skills.md) under "Observed problem", against commit `fd737a1`.

## Phase 1: Pure skill sync policy

| Requirement | Check | Result |
| --- | --- | --- |
| FEAT-002/REQ-001 to REQ-005 | `node --test test/skill-sync.test.js` (table-driven states and modes) | 23 of 23 pass |
| FEAT-002/REQ-003 | CRLF and LF content hash equally (same test file) | Pass |
| Boundary | Test asserts `src/skill-sync.js` imports only `node:crypto` and uses no `process` or dynamic imports | Pass |
| No regressions | `npm test` | 75 of 75 pass |
| Syntax | `node --check src/skill-sync.js` | Exit 0 |

Limitation: Phase 1 exercises policy decisions only; no command uses them until Phase 2.

## Phase 2: Wire the policy into every install path

Recorded: 2026-09-26T14:37:10+08:00

| Requirement | Check | Result |
| --- | --- | --- |
| REQ-001, REQ-002 | `test/existing-repo.test.js`: team `refactoring/` and `deploy/` in both roots snapshot-compared after `start`, `skills`, `--yes`, `update`, `update --force`, `skills --force` | Pass; no file changed or added |
| REQ-003 | Installer test: sorted record with 24 skills and SHA-256 hashes in both roots; second `start` leaves record mtime unchanged | Pass |
| REQ-004 | Installer and CLI tests: outdated owned skill refreshed; local edits kept by `update`, replaced by `update --force`; retired skill removed only when unmodified | Pass |
| REQ-005 | `update` reports then `update --adopt` claims team `refactoring/`; `deploy/` untouched | Pass |
| REQ-006 | Junction `.claude/skills` refused by `skills` and `update` with no partial install; junction skill directory reported as a project skill with nothing written through it | Pass |
| REQ-006 (hardening) | A committed record naming `..`, `../../../keep.txt`, or `C:` is rejected as invalid before any write; the outside file survives | Pass |
| REQ-008 | Per-root summary counts plus named project-skill, local-edit, update, and retirement lines | Pass (asserted in tests above) |
| Regression proof | New integration tests run against the pre-Phase-2 `bin/cli.js` and `src/installer.js` (via `git stash`) | 5 of 5 fail, confirming they reproduce the problem |
| All | `npm test` | 82 of 82 pass |
| Syntax | `node --check` on `bin/cli.js`, `src/installer.js`, `src/skill-sync.js`; `git diff --check` | Exit 0 |

End-to-end on the FEAT-002 reproduction repository (team `refactoring`, `deploy`, and `CLAUDE.md`, committed):

- `npm exec --offline --package=<checkout> -- len-toolkit start` installed 24 skills in `.agents/skills` and 23 in `.claude/skills`, and reported `refactoring` as a kept project skill with the `update --adopt` hint.
  `update` then reported 24 and 23 unchanged.
  `git status --short` showed no change in `refactoring/`, `deploy/`, or `CLAUDE.md`.
- Headless Claude Code 2.1.283 (`claude -p --model sonnet`) in that repository listed `refactoring: Our team refactoring rules...` (the team description), `deploy`, and toolkit skills such as `clean-code`.
  A Haiku run also confirmed `.len-toolkit.json` is not listed as a skill.
- Limitation: a first headless run with the Skill tool disallowed had no skill listing in context and answered from a partial directory view; runs with the Skill tool available are the valid check.

## Phase 3: Claude Code policy reporting and documentation

Recorded: 2026-09-26T14:38:58+08:00

| Requirement | Check | Result |
| --- | --- | --- |
| REQ-007 | Startup test: custom `CLAUDE.md` without an import prints the `CLAUDE CODE:` notice instead of the generic difference line; files with `See @AGENTS.md` or `@./AGENTS.md` get the normal review line and no notice; no `CLAUDE.md` is modified | Pass |
| All | `npm test` | 83 of 83 pass |
| Syntax and whitespace | `node --check` on the three sources; `git diff --check` | Exit 0 |
| Packaging | `npm pack --dry-run --ignore-scripts` | 116 files, including `src/skill-sync.js` |

End-to-end: `start` in the reproduction repository printed "CLAUDE CODE: CLAUDE.md does not import AGENTS.md, so Claude Code will not load the toolkit policy. Add this line to CLAUDE.md: @AGENTS.md".
`git status --short` showed the team `CLAUDE.md`, `refactoring/`, and `deploy/` unchanged.

Limitations: global skill roots were exercised only through planning logic and path selection, not by writing to the real home directory.
Only Windows with Node 24.14.0 was tested.
