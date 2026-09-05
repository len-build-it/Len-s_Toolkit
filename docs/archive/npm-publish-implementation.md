# Implementation Plan: Harden Len's Toolkit for npm Publish

> **Status:** Completed
> **Target Branch:** main
> **Test Command:** `node --test test/`
> **Lint/Check Command:** `node --check bin/cli.js && node --check src/installer.js`
> **Node Version:** >=18.0.0 (ESM required)

---

## Context for the Receiving Assistant

This plan was generated from a full project evaluation. Read this entire document
before touching any code. The project is a **zero-dependency** Node.js CLI — that
constraint is sacred. Do NOT add npm packages. Use only `node:*` built-in modules.

### Project Structure Reference

```
Len's_Toolkit/
├── bin/cli.js              ← CLI entrypoint (argument parsing, interactive prompts, command routing)
├── src/installer.js        ← Core logic (file copy, install skills/rules/configs, plan generation)
├── test/installer.test.js  ← Tests (currently 1 smoke test)
├── templates/
│   ├── configs/            ← .editorconfig, sample.gitignore
│   ├── rules/              ← GEMINI.md, AGENTS.md, .cursorrules
│   └── skills/             ← 8 skill directories, each containing SKILL.md
├── package.json            ← Zero deps, ESM ("type": "module"), bin entry
├── README.md
└── LICENSE
```

### Key Files You Will Modify

| File | What Changes |
|------|-------------|
| `src/installer.js` | Error handling, bug fixes (#4 #5 #6), `createPlanTemplate` force flag |
| `bin/cli.js` | Version dedup, pass `--force` to `plan`, Ctrl+C handling, Node version guard |
| `test/installer.test.js` | Expand from 1 test → full unit test suite |
| `test/cli.test.js` | **New file.** CLI integration tests via child_process |
| `templates/skills/council/SKILL.md` | Typo fix ("Renses" → "Lenses") |
| `README.md` | Typo fix ("lens-toolkit" → "len-toolkit"), add --force caveat |
| `CHANGELOG.md` | **New file.** Retroactive changelog |
| `package.json` | Update test script path |

---

## Grounding & Decisions (Council)

- **Goal:** Harden the toolkit's code quality, test coverage, error handling, and
  packaging correctness so it is ready for `npm publish --access public`.
- **Observed Constraints:**
  - Zero-dependency constraint (the project's own Ponytail philosophy).
  - ESM-only (`"type": "module"` in package.json).
  - Node.js `>=18.0.0` (required for `node:test`, `fs.cpSync`, `import.meta.url`).
  - Templates dir must be resolved relative to the package root, not `process.cwd()`.
- **Key Tradeoffs:**
  - We prioritize correctness and test coverage over new features.
  - We do NOT refactor the architecture — it's already clean and minimal.
  - Typo fixes and doc updates are bundled into the final phase to avoid noise.

---

## Phase 1: Fix Bugs in `src/installer.js`

**Goal:** Resolve the three logic bugs discovered in evaluation, add error
handling, and fix the version duplication. No new features, just correctness.

### Tasks

- [x] **Task 1.1: Fix version duplication in `bin/cli.js`**
  - Remove the hardcoded `const VERSION = '1.0.0';` on line 12.
  - Replace it with a dynamic read from `package.json`:
    ```js
    import { readFileSync } from 'node:fs';
    const { version: VERSION } = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
    );
    ```
  - This is a synchronous read at module load time — acceptable for a CLI.

- [x] **Task 1.2: Fix `installRules()` hidden side effect (`src/installer.js` lines 83–86)**
  - The comment says "if .agents directory exists" but the code always creates `.agents/rules/`.
  - Fix: wrap the `.agents/rules/` copy in a conditional:
    ```js
    const agentsDir = path.join(targetDir, '.agents');
    if (fs.existsSync(agentsDir)) {
      const agentsRulesDir = path.join(agentsDir, 'rules');
      ensureDir(agentsRulesDir);
      copyFile(path.join(srcRulesDir, 'GEMINI.md'), path.join(agentsRulesDir, 'GEMINI.md'), overwrite);
    }
    ```

- [x] **Task 1.3: Fix `.gitignore` overwrite inconsistency in `installConfigs()` (lines 105–111)**
  - Currently `--force` is silently ignored for `.gitignore`.
  - Fix: respect the `overwrite` parameter:
    ```js
    const gitignoreSrc = path.join(srcConfigsDir, 'sample.gitignore');
    const gitignoreDest = path.join(targetDir, '.gitignore');
    if (copyFile(gitignoreSrc, gitignoreDest, overwrite)) {
      installed.push('.gitignore');
    }
    ```

- [x] **Task 1.4: Fix `createPlanTemplate()` to accept `overwrite` parameter**
  - Current signature: `createPlanTemplate(targetDir, featureName)`
  - New signature: `createPlanTemplate(targetDir, featureName, overwrite = false)`
  - When `overwrite` is true and the file exists, overwrite it instead of bailing.
  - Update the caller in `bin/cli.js` (line 142) to pass `flags.force`:
    ```js
    const result = createPlanTemplate(targetDir, featureName, flags.force);
    ```

- [x] **Task 1.5: Add try/catch error handling to core fs functions**
  - Wrap `ensureDir()`, `copyDir()`, `copyFile()`, and `createPlanTemplate()` in
    try/catch blocks that throw a new `Error` with a user-friendly message and
    the original error as the `cause`.
  - Example pattern:
    ```js
    export function ensureDir(dirPath) {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      } catch (err) {
        throw new Error(`Failed to create directory "${dirPath}": ${err.message}`, { cause: err });
      }
    }
    ```
  - Apply the same pattern to `copyDir`, `copyFile`, `createPlanTemplate`.
  - The top-level `.catch()` in `cli.js` line 179 already prints `err.message` — so
    these user-friendly messages will surface automatically.

### 🧪 Verification Gate
- [ ] Run `node --check src/installer.js` — must exit 0 (syntax valid)
- [ ] Run `node --check bin/cli.js` — must exit 0
- [ ] Run `node --test test/` — existing smoke test must still pass
- [ ] Manual spot check: run `node bin/cli.js --version` and confirm it prints
      the version from `package.json` (not a hardcoded string)

### 🔍 Review Gate (Ponytail)
- [ ] Zero new dependencies added
- [ ] No new abstractions introduced (no classes, no new files, no wrappers)
- [ ] Every change is a targeted fix to an existing function

### 📦 Git Checkpoint
```bash
git add src/installer.js bin/cli.js
git commit -m "fix: resolve bugs in installer and CLI (version duplication, overwrite logic, error handling)"
```

### 🛑 HARD STOP
> **PAUSE HERE.** Report completed tasks, show the diff, and verify that the
> existing test still passes. Wait for user confirmation before proceeding to Phase 2.
> Prompt: *"Phase 1 complete — bugs fixed, error handling added. Ready for Phase 2 (tests)?"*
> **DO NOT PROCEED UNTIL USER CONFIRMS.**

---

## Phase 2: Expand `installer.test.js` Unit Tests

**Goal:** Go from 1 smoke test to comprehensive unit tests covering every
exported function in `src/installer.js`, including edge cases.

### Tasks

- [x] **Task 2.1: Update `package.json` test script**
  - Change `"test": "node --test"` to `"test": "node --test test/"` for explicit
    test directory targeting.

- [x] **Task 2.2: Refactor existing test into a proper suite structure**
  - Keep using `node:test` and `node:assert` (zero deps).
  - Create a fresh temp directory per test using `fs.mkdtempSync`.
  - Clean up in `finally` blocks with `fs.rmSync(tempDir, { recursive: true, force: true })`.

- [x] **Task 2.3: Add `ensureDir()` tests**
  - Test: creates directory when it doesn't exist.
  - Test: does nothing when directory already exists (idempotent).
  - Test: creates nested directories recursively.

- [x] **Task 2.4: Add `copyFile()` tests**
  - Test: copies file when destination doesn't exist.
  - Test: skips copy when destination exists and `overwrite = false`.
  - Test: overwrites when destination exists and `overwrite = true`.
  - Test: creates parent directories if they don't exist.
  - Test: returns `true` when copied, `false` when skipped.

- [x] **Task 2.5: Add `copyDir()` tests**
  - Test: recursively copies a directory tree.
  - Test: does not overwrite existing files when `overwrite = false`.
  - Test: does overwrite existing files when `overwrite = true`.

- [x] **Task 2.6: Add `installSkills()` tests**
  - Test: local install creates `.agents/skills/` with all 8 skill directories.
  - Test: each skill directory contains a `SKILL.md` file.
  - Test: verify all expected skill names are present: `council`, `implementation-plan`,
    `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`,
    `ponytail-review`.
  - Test: global install targets a mock home directory path (do NOT write to real `~/.gemini/`
    — use a temp directory and verify the path construction logic by calling `installSkills`
    with a temp `targetDir` and `isGlobal = false`, since global writes to `os.homedir()`
    which we should not touch in tests).

- [x] **Task 2.7: Add `installRules()` tests**
  - Test: installs `GEMINI.md`, `AGENTS.md`, `.cursorrules` to target root.
  - Test: does NOT create `.agents/rules/` when `.agents/` doesn't exist (Phase 1 fix).
  - Test: DOES copy `GEMINI.md` into `.agents/rules/` when `.agents/` already exists.
  - Test: respects `overwrite = false` — doesn't clobber existing files.
  - Test: returns array of actually installed file names.

- [x] **Task 2.8: Add `installConfigs()` tests**
  - Test: installs `.editorconfig` and `.gitignore` when neither exists.
  - Test: `.gitignore` IS overwritten when `overwrite = true` (Phase 1 fix).
  - Test: `.gitignore` is NOT overwritten when `overwrite = false`.
  - Test: returns array of actually installed file names.

- [x] **Task 2.9: Add `createPlanTemplate()` tests**
  - Test: creates `IMPLEMENTATION_PLAN.md` with the feature name interpolated.
  - Test: returns `{ created: false }` when file already exists and `overwrite = false`.
  - Test: returns `{ created: true }` when file already exists but `overwrite = true` (Phase 1 fix).
  - Test: default feature name is `'New Feature'`.

### 🧪 Verification Gate
- [ ] Run `node --test test/` — all tests must pass, 0 failures
- [ ] Verify test count is ≥ 20 individual test cases

### 🔍 Review Gate (Ponytail)
- [ ] Zero new dependencies (still using `node:test` + `node:assert` only)
- [ ] No test framework, no mocking library — just stdlib
- [ ] Tests clean up after themselves (no temp files left behind)

### 📦 Git Checkpoint
```bash
git add test/installer.test.js package.json
git commit -m "test: comprehensive unit tests for all installer functions"
```

### 🛑 HARD STOP
> **PAUSE HERE.** Report the test count and pass/fail results. Show the full
> test output. Wait for user confirmation before proceeding to Phase 3.
> Prompt: *"Phase 2 complete — X tests passing. Ready for Phase 3 (CLI tests)?"*
> **DO NOT PROCEED UNTIL USER CONFIRMS.**

---

## Phase 3: Add CLI Integration Tests

**Goal:** Add a new `test/cli.test.js` that tests the CLI entrypoint by spawning
it as a child process and asserting on stdout, exit codes, and filesystem side effects.

### Tasks

- [x] **Task 3.1: Create `test/cli.test.js`**
  - Use `node:child_process` `execFileSync` or `execFile` to spawn `node bin/cli.js`.
  - Run each invocation in a temp directory as the working directory.

- [x] **Task 3.2: Test `--help` flag**
  - Assert exit code 0.
  - Assert stdout contains `"USAGE:"`, `"COMMANDS:"`, and `"OPTIONS:"`.

- [x] **Task 3.3: Test `--version` flag**
  - Assert exit code 0.
  - Assert stdout contains `len-toolkit v` followed by the version from `package.json`.

- [x] **Task 3.4: Test `--yes` (non-interactive full install)**
  - Run `node bin/cli.js --yes` in a temp directory.
  - Assert exit code 0.
  - Assert the temp directory now contains: `GEMINI.md`, `AGENTS.md`, `.cursorrules`,
    `.editorconfig`, `.agents/skills/council/SKILL.md`.

- [x] **Task 3.5: Test `skills` command**
  - Run `node bin/cli.js skills` in a temp directory.
  - Assert `.agents/skills/` exists with all 8 skill directories.
  - Assert stdout contains `"Installed skills"`.

- [x] **Task 3.6: Test `rules` command**
  - Run `node bin/cli.js rules` in a temp directory.
  - Assert `GEMINI.md`, `AGENTS.md`, `.cursorrules` exist.

- [x] **Task 3.7: Test `plan` command**
  - Run `node bin/cli.js plan "Auth System"` in a temp directory.
  - Assert `IMPLEMENTATION_PLAN.md` exists and contains `"Auth System"`.
  - Run again — assert the "already exists" message appears and file is untouched.
  - Run with `--force` — assert the file is overwritten.

- [x] **Task 3.8: Test unknown/invalid commands**
  - Run `node bin/cli.js notacommand --yes` — should fall through to `init`
    (the default command behavior) and exit 0.

### 🧪 Verification Gate
- [ ] Run `node --test test/` — all tests (installer + CLI) must pass
- [ ] Verify combined test count is ≥ 28

### 🔍 Review Gate (Ponytail)
- [ ] Zero new dependencies
- [ ] CLI tests use only `node:child_process`, `node:fs`, `node:path`, `node:os`
- [ ] Tests are independent — each uses its own temp directory

### 📦 Git Checkpoint
```bash
git add test/cli.test.js
git commit -m "test: add CLI integration tests via child_process"
```

### 🛑 HARD STOP
> **PAUSE HERE.** Report full test suite results (installer + CLI). Wait for
> user confirmation before proceeding to Phase 4.
> Prompt: *"Phase 3 complete — full test suite passing (X tests). Ready for Phase 4 (polish)?"*
> **DO NOT PROCEED UNTIL USER CONFIRMS.**

---

## Phase 4: Documentation, Typos, and Packaging Polish

**Goal:** Fix all documentation issues, typos, add a changelog, and add a
runtime Node.js version guard. Also handle Ctrl+C gracefully in interactive mode.

### Tasks

- [x] **Task 4.1: Fix "Renses" typo in `templates/skills/council/SKILL.md` line 37**
  - Change `## 2. The Core Council Renses` → `## 2. The Core Council Lenses`

- [x] **Task 4.2: Fix README.md npx GitHub typo (line 159)**
  - Change `npx github:yourusername/lens-toolkit` → `npx github:yourusername/len-toolkit`

- [x] **Task 4.3: Add `--force` behavior note to README CLI section**
  - Under the `CLI Commands & Options` section, add a note:
    `--force` overwrites all existing files including `.gitignore` and `IMPLEMENTATION_PLAN.md`.

- [x] **Task 4.4: Create `CHANGELOG.md`**
  - Create a retroactive changelog following [Keep a Changelog](https://keepachangelog.com/) format:
    ```markdown
    # Changelog

    ## [1.1.0] - YYYY-MM-DD
    ### Fixed
    - Version no longer hardcoded; reads dynamically from package.json
    - `installRules()` no longer creates `.agents/rules/` when `.agents/` doesn't exist
    - `.gitignore` now respects `--force` flag consistently
    - `plan` command now respects `--force` flag to overwrite existing plans
    - All filesystem operations now throw descriptive errors instead of raw stack traces
    - Typo "Renses" → "Lenses" in council skill

    ### Added
    - Comprehensive unit tests for all installer functions
    - CLI integration tests
    - Runtime Node.js version check (>=18.0.0)
    - CHANGELOG.md

    ## [1.0.0] - 2026-XX-XX
    ### Added
    - Initial release: Council, Implementation Plan, and Ponytail skill suite
    - Interactive and non-interactive CLI (`--yes`, `--global`, `--force`)
    - Agent rules: GEMINI.md, AGENTS.md, .cursorrules
    - Dev configs: .editorconfig, .gitignore
    ```
  - Fill in actual dates from git log.

- [x] **Task 4.5: Add runtime Node.js version guard in `bin/cli.js`**
  - Add at the top of the file (after the shebang, before imports):
    ```js
    const [major] = process.versions.node.split('.').map(Number);
    if (major < 18) {
      console.error('len-toolkit requires Node.js >= 18.0.0. Current: ' + process.version);
      process.exit(1);
    }
    ```

- [x] **Task 4.6: Handle Ctrl+C in interactive mode (`bin/cli.js`)**
  - Add a `'close'` event listener on the readline interface in `runInteractive()`:
    ```js
    rl.on('close', () => {
      console.log('\n\nSetup cancelled.');
      process.exit(0);
    });
    ```
  - Use a flag to distinguish between intentional close and Ctrl+C.

- [x] **Task 4.7: Bump version in `package.json` to `1.1.0`**
  - Since `cli.js` now reads version dynamically (Phase 1), this is the only place
    to update.

### 🧪 Verification Gate
- [ ] Run `node --test test/` — full suite still passes
- [ ] Run `node bin/cli.js --version` — prints `len-toolkit v1.1.0`
- [ ] Run `node bin/cli.js --help` — no visual regressions in banner
- [ ] Manually inspect CHANGELOG.md for formatting

### 🔍 Review Gate (Ponytail)
- [ ] Zero new dependencies added
- [ ] No feature creep — this phase is exclusively typos, docs, and minor UX polish
- [ ] Minimal diff — no refactors, no architecture changes

### 📦 Git Checkpoint
```bash
git add templates/skills/council/SKILL.md README.md CHANGELOG.md bin/cli.js package.json
git commit -m "docs: fix typos, add changelog, runtime version guard, bump to v1.1.0"
```

### 🛑 HARD STOP
> **PAUSE HERE.** Final review with the user before closing the task.
> Prompt: *"Phase 4 complete — all typos fixed, changelog added, version bumped to 1.1.0. Full test suite passing. Ready to publish?"*

---

## Summary of Expected Outcomes

| Metric | Before | After |
|--------|--------|-------|
| Test count | 1 | ≥ 28 |
| Test files | 1 | 2 |
| Bugs fixed | 0 | 5 (version duplication, installRules side effect, .gitignore overwrite, plan --force, error handling) |
| Error handling | Raw stack traces | User-friendly messages |
| Typos | 2 | 0 |
| Changelog | None | CHANGELOG.md |
| Version | 1.0.0 (hardcoded ×2) | 1.1.0 (single source of truth) |
| Node guard | None | Runtime check >=18 |
