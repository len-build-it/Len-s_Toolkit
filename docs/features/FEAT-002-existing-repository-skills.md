# FEAT-002: Coexist with existing repository skills

Created: 2026-09-26T14:23:14+08:00
Updated: 2026-09-26T14:23:14+08:00
Revision: 1
Status: Approved by Len in chat (revision 1)

## Purpose and success

Teams adopting the toolkit in an existing repository often already have their own Claude Code or agent skills and a `CLAUDE.md`.
The toolkit must add its skills and policy without altering, polluting, or silently shadowing what the repository already owns.
Success means every requirement below passes in automated tests and in an end-to-end run against a repository that has its own skills.

## Observed problem

Reproduced on 2026-09-26 with toolkit commit `fd737a1` in a temporary Git repository that already had `.claude/skills/refactoring/` (team-owned, same name as a bundled skill), `.claude/skills/deploy/`, and a team `CLAUDE.md`.

- `start` added `refactoring.md`, `refactoring.mini.md`, and `refactoring.nano.md` into the team's own `refactoring` skill directory.
- `update` then overwrote the team's `refactoring/SKILL.md` with the toolkit version, which is data loss recoverable only from Git.
- The team `CLAUDE.md` was preserved, but because it exists, Claude Code does not read `AGENTS.md` by default, so the toolkit policy never reached Claude.
  Startup only printed a generic "differs" line that does not explain this.
- The unrelated `deploy` skill was untouched, and Git showed no other changes.

Root cause: installation copies file by file with no record of which skills the toolkit owns, so it cannot tell a toolkit skill from a same-named project skill.

## Scope and non-goals

Includes skill ownership tracking, collision handling, safe updates, legacy adoption, link safety across all skill-writing commands, and clearer `CLAUDE.md` reporting.
Applies equally to `.agents/skills/`, `.claude/skills/`, and the global skill roots.

Excludes choosing a subset of skills to install, renaming or prefixing toolkit skills on collision, distributing the toolkit as a Claude Code plugin, editing a project's own `CLAUDE.md` or `AGENTS.md`, and ownership tracking for `.agents/templates/docs/`.

## User flows

- Fresh repository: `start` installs all bundled skills in both roots and records them as toolkit-owned.
- Existing repository with its own skills: `start` installs only bundled skills whose names are free, and reports each name already taken by a project skill.
- Routine upgrade: `update` refreshes toolkit-owned skills, keeps local edits to them, and never touches project skills.
- Upgrade from toolkit 1.2.0 or earlier (no ownership record yet): `update` reports same-named untracked skills and how to adopt them; `update --adopt` claims them.
- Existing `CLAUDE.md`: `start` states whether Claude Code will load the toolkit policy and, if not, the one line to add.

## Requirements and acceptance criteria

| ID | Required behavior | Observable pass/fail criterion |
| --- | --- | --- |
| REQ-001 | Project skills with unbundled names are never touched | After `start`, `skills`, `--yes`, `update`, and `update --force`, a project skill such as `deploy/` is byte-for-byte unchanged and no file is added to it. |
| REQ-002 | Same-named project skills are preserved and reported | A project-owned `refactoring/` stays byte-for-byte unchanged with no added files under every command except `update --adopt`; output names the collision and the proposed source path; the toolkit copy is not installed in that root. |
| REQ-003 | Ownership record per skills root | Every skills root the toolkit writes contains `.len-toolkit.json` listing each toolkit-installed skill with a SHA-256 hash per file, computed after normalizing CRLF to LF; a CRLF checkout of an unmodified skill is not reported as modified; the file has stable key order and ends with a newline. |
| REQ-004 | Safe update of toolkit-owned skills | `update` installs missing bundled skills, refreshes unmodified owned skills, removes unmodified owned skills no longer bundled, and preserves and reports locally modified owned skills; `update --force` also replaces locally modified owned skills; neither changes project skills. |
| REQ-005 | Explicit legacy adoption | A same-named skill the record does not own is treated as a collision and reported with an `update --adopt` hint; `update --adopt` replaces it with the bundled version and records it as owned; a copy already identical to the bundled version is recorded as owned without being rewritten. |
| REQ-006 | No writes through links | No skill-writing command writes through a symlink or junction inside the project; a linked skill directory is reported as a collision; a global root may itself be a link, but links at or below a skill directory are never written through. |
| REQ-007 | Honest Claude Code policy reporting | When `CLAUDE.md` exists and does not import `@AGENTS.md`, `start` prints that Claude Code will not load the toolkit policy and the exact line to add; the file is never edited. |
| REQ-008 | Readable reporting | Skill outcomes are summarized per skill, not per file: counts for installed, updated, and unchanged, plus named lists for collisions, locally modified, and removed skills. |

## Data and interfaces

Ownership record, one per skills root, at `<root>/.len-toolkit.json`:

```json
{
  "skills": {
    "clean-code": {
      "files": {
        "SKILL.md": "sha256-hex",
        "clean-code.md": "sha256-hex"
      }
    }
  },
  "toolkitVersion": "1.3.0"
}
```

Paths inside `files` are relative to the skill directory and use forward slashes.
The record is project content intended to be committed so teammates share update behavior.
New CLI flag: `--adopt` on `update` only.

## Architecture (Clean Architecture review)

The decision "may the toolkit write this skill?" is business policy and must not be tangled with filesystem calls.

- Policy: a new `src/skill-sync.js` exposes a pure `planSkillSync` function.
  Input is plain data: bundled skills with normalized file hashes, the installed state of the root (per skill: absent, directory with file hashes, link, or non-directory), the ownership record, and the mode (`install`, `update`, `force`, `adopt`).
  Output is plain data: per-skill actions (install, replace, remove, keep, skip-collision, skip-modified) and the next ownership record.
  It imports no Node filesystem, process, or child-process module; a test enforces this.
- Adapter: `src/installer.js` reads the filesystem into that plain data, refuses links, applies the planned actions, and writes the ownership record.
- Delivery: `bin/cli.js` parses flags and prints the returned report.

This is the lightest enforceable boundary for a small CLI: one pure module, plain-data contracts, and no interfaces or dependency-injection ceremony.
Policy tests run without touching disk; adapter tests use temporary directories.

## Council decision record

Observed facts: the reproduction above; Claude Code discovers project skills only in `.claude/skills/`; plugin skills are namespaced as `/plugin:skill` and plugins can come from an npm source (Claude Code marketplace docs, read 2026-09-26).

Unverified assumptions: Claude Code ignores a non-directory file such as `.len-toolkit.json` at the skills root; this is checked end to end in the plan before release.

- Devil's advocate: a hash record breaks on Windows line-ending conversion unless hashes are normalized (addressed in REQ-003).
  Legacy 1.2.0 installs have no record, so a strict policy stops updating them (addressed by the explicit `--adopt` in REQ-005, at the cost of one extra command once).
  A teammate who deletes the record makes all skills look foreign; the result is preservation, never data loss, and `--adopt` recovers.
- Simplicity: prefixing toolkit skills (for example `len-clean-code`) avoids collisions without a record, but renames every command users type and still cannot detect local edits or retired skills.
  A frontmatter ownership marker avoids a separate file but edits 24 vendored upstream skills and still needs hashes for edit detection.
  The record is one small JSON file per root and reuses the existing copy helpers.
- Security and reliability: `update` currently deletes user work, and non-`start` commands write through links; both are fixed by REQ-002, REQ-004, and REQ-006.
  Removal of retired skills is limited to owned, unmodified files, so a wrong record can only cause preservation.
- Architecture: the Claude Code plugin route (namespaced `/len-toolkit:council`, nothing written to the repository) removes collisions entirely, but it does not serve Gemini's `.agents/skills/`, changes every skill name, and requires each user to register a marketplace.

Proposed decision: ownership record with a pure sync policy, as specified above.
Revisit toward a plugin if collisions prove common, if teams object to vendored skill copies, or if Len drops the Gemini path.

## Quality constraints

Apply the shared [constraints](../product/CONSTRAINTS.md).
No new dependencies; hashing uses `node:crypto`.
Existing tests keep passing except where they assert the old overwrite-everything behavior, which this feature intentionally changes.

## Open questions and readiness

1. Approve the ownership record over the plugin route? (Recommended: yes.)
2. Approve extending `update --force` to replace locally modified toolkit skills, in addition to its current rule refresh? (Recommended: yes.)
3. Should `start` print a one-line count of owned skills with available updates? (Recommended: yes.)

Readiness: Len approved this revision and the linked plan in chat on 2026-09-26, answering questions 1-3 with yes.
