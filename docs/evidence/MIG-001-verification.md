# MIG-001 Verification Evidence: Phase 1 Baseline

Created: 2026-09-11T10:07:00+08:00
Environment: Windows 11, PowerShell, Node.js v20+, Git 2.45+

## 1. Repository State and Policy Integrity

- Scenario: Inspect legacy repository remote, active branch, head commit, and working tree state.
- Command: `git status; git remote -v; git log -1 --oneline`
- Result: Clean on `master` tracking `origin/master`.
  Head commit: `c85e261923ab56a00e8fac9395c6f767aff4b2c9` (`fix(cli): restore startup wordmark`).
  Remote: `https://github.com/len-build-it/Len-s_Toolkit.git`.
- Policy hash command: `Get-FileHash AGENTS.md -Algorithm SHA256`
- Result:
  SHA-256: `86EE90450B7032F2CC0AED01DE32F069D81E555F6BBAEE08B286528861433463`.
  Exact byte-for-byte match with pre-plan recorded checksum.

## 2. Legacy Product Baseline Checks

- Scenario: Verify legacy test suite and script syntax.
- Commands:
  - `node --check bin/cli.js` (Result: Exit 0, syntax valid)
  - `node --check src/installer.js` (Result: Exit 0, syntax valid)
  - `npm test` (Result: 46 passed across 8 test suites, 0 failed, duration 2757ms)
- Failures: None.

## 3. Tooling and Authentication Availability

- Scenario: Check git configuration and GitHub CLI availability.
- Commands:
  - `git config --list --show-origin`
    Result: Git Credential Manager configured with user Lenard Angelo Olajay (`olajaylenardangelo@gmail.com`).
  - `gh --version`
    Result: Command not found (`gh` CLI is absent in PATH).
    GitHub interactions must rely on git remote authentication or manual web fork creation.

## 4. Upstream Repository Inspection

- Scenario: Identify upstream Superpowers revision, release tags, and architecture.
- Commands:
  - `git ls-remote https://github.com/obra/superpowers.git HEAD`
    Result: Commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.
  - `git ls-remote --tags https://github.com/obra/superpowers.git`
    Result: Tag `v6.3.0` resolves to `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.
  - Upstream manifest inspection:
    - `.codex-plugin/plugin.json`: version 6.3.0, skills path `./skills/`, empty hooks object `{}`.
    - `gemini-extension.json`: version 6.3.0, `contextFileName: "GEMINI.md"`.
    - `hooks/hooks.json`: SessionStart hook running `hooks/session-start` for Claude/Cursor/Copilot.
    - `package.json`: zero dependencies, no native `npm test` script.
      Tests are located in `tests/` (subdirectories: `hooks/`, `systematic-debugging/`, `shell-lint/`, etc.).

## 5. Ignored and Untracked Files Check

- Scenario: Ensure no untracked user data or secrets are lost or exposed.
- Command: `git status --ignored`
- Result: No ignored files or uncommitted user data present beyond the active migration planning documents.

## 6. Approved Configuration and Architecture Decisions

- Fork repository target: `len-build-it/superpowers`.
- Fork local checkout destination: `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\superpowers`.
- Durable backup destination: `C:\Users\User\Desktop\PersonalProjects\04-FUN-STUFF\backups\Len-s_Toolkit_backup_2026-09-11`.
- Primary validation client: Antigravity / Gemini CLI.
- Pinned upstream revision: `obra/superpowers` tag `v6.3.0` at commit `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`.
- Mode contract & interpretations: Approved per MIG-REQ-02 and MIG-REQ-03.
