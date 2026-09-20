# Implementation Plan: Integrate Software Engineering Book Skills

Created: 2026-09-20T21:38:00+08:00
Updated: 2026-09-20T21:38:00+08:00
Revision: 1
Status: Awaiting approval
Target branch: master

## Overview

Integrate 14 software engineering book skills from https://github.com/ciembor/agent-rules-books.git into Len's Toolkit.
These skills provide distilled rules for software design, architecture, refactoring, legacy code, data systems, and reliability from classic software engineering literature.
All imported skills and updated documentation adhere to workspace directives: zero em dashes (plain dash only), sentence-per-line Markdown formatting, zero new npm dependencies, and explicit attribution in the README.

## User Rules & Guidelines Adherence

- Zero Bloat (Ponytail): 0 new npm packages or external dependencies.
- No em dashes: All em dashes are replaced with plain dashes ("-").
- Sentence-per-line: Every sentence in Markdown files is placed on its own line.
- Git checkpoints: Conventional commits without co-author tags.
- Verification gates: Automated test suite and syntax verification at each phase.

---

## Phase 1: Import Book Skills and Test Suite Alignment

Requirements: BOOKS-001/IMPORT-AND-TESTS
State: Completed

### Tasks
- [x] Copy all 14 book skill directories from `agent-rules-books` into `templates/skills/`.
- [x] Copy all 14 book skill directories into `.agents/skills/`.
- [x] Verify zero em dashes exist in all imported files.
- [x] Update `test/installer.test.js` to expect 24 total skills and verify all `SKILL.md` files.
- [x] Update `test/cli.test.js` to include the 14 new skill names in the `skills` command expectation.

### Verification Gate
- Run: `npm test`
- Expected result: 46+ tests pass with 0 failures.

### Review Gate
- [x] Verify 0 unrequested dependencies added (Ponytail check).

### Git Checkpoint
- Atomic git commit: `feat(skills): add 14 software engineering book skills from agent-rules-books`

🛑 **HARD STOP:** Pause execution, present the phase summary to Len, and wait for explicit confirmation before starting Phase 2.

---

## Phase 2: CLI Interface Integration

Requirements: BOOKS-001/CLI
State: Completed

### Tasks
- [x] Update `bin/cli.js` `printHelp()` to mention book skills under `SKILLS INCLUDED:`.
- [x] Update `bin/cli.js` interactive prompt to reference the extended skill library.

### Verification Gate
- Run: `npm test`
- Run: `node --check bin/cli.js`
- Run: `node --check src/installer.js`
- Expected result: All tests pass, syntax checks exit with code 0.

### Review Gate
- [x] Verify 0 unrequested dependencies added (Ponytail check).

### Git Checkpoint
- Atomic git commit: `feat(cli): add book skills to CLI help and interactive prompts`

🛑 **HARD STOP:** Pause execution, present the phase summary to Len, and wait for explicit confirmation before starting Phase 3.

---

## Phase 3: Documentation and Attribution

Requirements: BOOKS-001/DOCS
State: Awaiting approval

### Tasks
- [ ] Update `README.md` to reference 24 skills instead of ten.
- [ ] Add the book skills collection under `## Skills and templates` in `README.md`.
- [ ] Add proper attribution under `## License and attribution` in `README.md` crediting Maciej Ciemborowicz and https://github.com/ciembor/agent-rules-books.
- [ ] Ensure `README.md` follows sentence-per-line structure and contains zero em dashes.

### Verification Gate
- Run: `npm test`
- Run: `git diff --check`
- Run: `npm pack --dry-run`
- Expected result: All tests pass, no trailing whitespace, dry-run packaging confirms all skills included.

### Review Gate
- [ ] Verify 0 unrequested dependencies added (Ponytail check).

### Git Checkpoint
- Atomic git commit: `docs: document book skills and credit agent-rules-books in README`

🛑 **HARD STOP:** Pause execution, present final summary to Len, and await review.
