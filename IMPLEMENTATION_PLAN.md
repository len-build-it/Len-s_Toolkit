# Implementation Plan: Integrate Cloudflare Security Audit Skill

Created: 2026-09-20T21:25:00+08:00
Updated: 2026-09-20T21:28:00+08:00
Revision: 2
Status: Awaiting approval
Target branch: master

## Overview

Integrate Cloudflare's open-source `security-audit` skill from https://github.com/cloudflare/security-audit-skill.git into Len's Toolkit.
This adds defensive security guidance, vulnerability discovery patterns, attack classes, validation tools, and structured reporting to the toolkit.
All imported skill files and documentation will adhere to workspace guidelines: zero em dashes (plain dash only), sentence-per-line formatting, zero additional npm dependencies, and explicit attribution in the README.

## User Rules & Guidelines Adherence

- Zero Bloat (Ponytail): 0 new npm packages or external dependencies.
- No em dashes: All em dashes are replaced with plain dashes ("-").
- Sentence-per-line: Every sentence in Markdown files is placed on its own line.
- Git checkpoints: Conventional commits without co-author tags.
- Verification gates: Automated test suite and syntax verification at each phase.

---

## Phase 1: Skill Files Import, Encoding Sanitization & Test Suite Alignment

Requirements: SEC-001/SKILLS-AND-TESTS
State: Completed

### Tasks
- [x] Create `templates/skills/security-audit` and `.agents/skills/security-audit` directories.
- [x] Copy all 20 skill files from the cloned repository into `templates/skills/security-audit/`.
- [x] Copy all 20 skill files into `.agents/skills/security-audit/`.
- [x] Sanitize all em dashes across imported Markdown files, replacing them with plain dashes ("-").
- [x] Update `test/installer.test.js` to expect 10 skills (including `security-audit`) and verify `security-audit/SKILL.md`.
- [x] Update `test/cli.test.js` to include `security-audit` in the `skills` command expectation.

### Verification Gate
- Run: `node -e "const fs = require('fs'); const check = (dir) => fs.readdirSync(dir).forEach(f => { const p = dir + '/' + f; if (fs.statSync(p).isDirectory()) check(p); else if (fs.readFileSync(p, 'utf8').includes('\u2014')) throw new Error('Em dash found in ' + p); }); check('templates/skills/security-audit'); check('.agents/skills/security-audit'); console.log('Zero em dashes verified.');"`
- Run: `npm test`
- Expected result: Output "Zero em dashes verified.", 46+ tests pass with 0 failures.

### Review Gate
- [x] Verify 0 unrequested dependencies added (Ponytail check).

### Git Checkpoint
- Atomic git commit: `feat(skills): add Cloudflare security-audit skill and update test suite`

🛑 **HARD STOP:** Pause execution, present the phase summary to Len, and wait for explicit confirmation before starting Phase 2.

---

## Phase 2: CLI Interface Integration

Requirements: SEC-001/CLI
State: Completed

### Tasks
- [x] Update `bin/cli.js` `printHelp()` to include `security-audit` in `SKILLS INCLUDED:`.
- [x] Update `bin/cli.js` interactive prompt to mention `security-audit`.

### Verification Gate
- Run: `npm test`
- Run: `node --check bin/cli.js`
- Run: `node --check src/installer.js`
- Expected result: All tests pass, CLI syntax check passes with code 0.

### Review Gate
- [x] Verify 0 unrequested dependencies added (Ponytail check).

### Git Checkpoint
- Atomic git commit: `feat(cli): display security-audit in CLI help and interactive setup`

🛑 **HARD STOP:** Pause execution, present the phase summary to Len, and wait for explicit confirmation before starting Phase 3.

---

## Phase 3: Documentation and Attribution

Requirements: SEC-001/DOCS
State: Awaiting approval

### Tasks
- [ ] Update `README.md` to reference ten skills instead of nine.
- [ ] Add `security-audit` description to `## Skills and templates` in `README.md`.
- [ ] Add proper attribution under `## License and attribution` in `README.md` crediting Cloudflare's repository (`https://github.com/cloudflare/security-audit-skill.git`).
- [ ] Ensure `README.md` follows sentence-per-line structure and contains no em dashes.

### Verification Gate
- Run: `npm test`
- Run: `git diff --check`
- Run: `npm pack --dry-run`
- Expected result: All tests pass, no trailing whitespace or whitespace errors, dry-run packaging confirms tarball contents.

### Review Gate
- [ ] Verify 0 unrequested dependencies added (Ponytail check).

### Git Checkpoint
- Atomic git commit: `docs: document security-audit skill and credit Cloudflare in README`

🛑 **HARD STOP:** Pause execution, present final summary to Len, and await review.
