# Implementation Plan: Automatic Claude Code Support

Created: 2026-09-26T14:15:25+08:00
Updated: 2026-09-26T14:15:25+08:00
Revision: 1
Status: Completed; Len approved both phases in chat
Target branch: master

## Overview

Make every toolkit install path prepare a project for Claude Code with no manual steps.
Claude Code auto-loads a root `CLAUDE.md` and discovers project skills only from `.claude/skills/`.
The previous plan (book skills) is archived at [docs/archive/BOOKS-001-implementation.md](../archive/BOOKS-001-implementation.md).

## Decisions

- `CLAUDE.md` starts with `@AGENTS.md` instead of duplicating policy, so `AGENTS.md` stays the single shared source.
  The import works on every Claude Code version, and Claude Code never loads an imported `AGENTS.md` twice.
- A symlinked `CLAUDE.md` was rejected because Windows clones check committed symlinks out as plain text files.
- Skills are copied into `.claude/skills/` because Claude Code has no configurable project skills path.
  The cost is a second copy per project; `update` refreshes both copies together.
- `--global` also targets `~/.claude/skills/`, matching the existing `~/.gemini/config/skills/` behavior.
- No new dependencies.

---

## Phase 1: Installer, CLI, and tests

Requirements: CLAUDE-001/INSTALL
State: Completed

### Tasks
- [x] Add `templates/rules/CLAUDE.md` importing `AGENTS.md` and mapping the implementer role to Claude Code.
- [x] `start` installs `CLAUDE.md` and mirrors skills into `.claude/skills/`, with the existing preservation, difference, and symlink checks.
- [x] `init`, `--yes`, `skills`, `rules`, and `update` install or refresh the Claude Code files.
- [x] Sample `.gitignore` excludes `CLAUDE.local.md` and `.claude/settings.local.json`.
- [x] CLI help and prompts mention the Claude Code paths.
- [x] Tests cover installation, preservation, update, junction refusal, and the `@AGENTS.md` import.

### Verification Gate
- Run: `npm test`, `node --check bin/cli.js`, `node --check src/installer.js`
- Result: 52 of 52 tests pass and both syntax checks exit 0.
- E2E: `npm exec --offline --package=<checkout> -- len-toolkit start` in a fresh temporary project, then headless Claude Code 2.1.283 in that project.
- Result: Claude Code reported both `CLAUDE.md` and `AGENTS.md` as loaded and listed the project skills; the global `~/.claude/skills/` held none of them.
- A second `start` run installed 0 files and reported no differences.

### Git Checkpoint
- Atomic git commit: `feat(claude): install CLAUDE.md and .claude/skills automatically`

🛑 **HARD STOP:** Present the phase summary to Len and wait for explicit confirmation before committing and starting Phase 2.

---

## Phase 2: Documentation

Requirements: CLAUDE-001/DOCS
State: Completed

### Tasks
- [x] README documents Claude Code support, updated startup and update behavior, and the document tree.
- [x] `package.json` description and keywords mention Claude Code.

### Verification Gate
- Run: `git diff --check`, `npm pack --dry-run --ignore-scripts`
- Result: no whitespace errors; the package includes `templates/rules/CLAUDE.md` (115 files).

### Git Checkpoint
- Atomic git commit: `docs: document automatic Claude Code support`

🛑 **HARD STOP:** Present the final summary to Len and await review.
