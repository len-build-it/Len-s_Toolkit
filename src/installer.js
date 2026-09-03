import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates');

/**
 * Ensures directory exists
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Recursively copies directory contents
 */
export function copyDir(src, dest, overwrite = false) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, overwrite);
    } else {
      if (!fs.existsSync(destPath) || overwrite) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * Safely copies a single file
 */
export function copyFile(src, dest, overwrite = false) {
  ensureDir(path.dirname(dest));
  if (!fs.existsSync(dest) || overwrite) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

/**
 * Installs skills into target directory
 * Destination will be: targetDir/.agents/skills/ (or targetDir directly if global)
 */
export function installSkills(targetDir, isGlobal = false, overwrite = false) {
  const srcSkillsDir = path.join(TEMPLATES_DIR, 'skills');
  const destDir = isGlobal
    ? path.join(os.homedir(), '.gemini', 'config', 'skills')
    : path.join(targetDir, '.agents', 'skills');

  copyDir(srcSkillsDir, destDir, overwrite);
  return destDir;
}

/**
 * Installs project agent rules (GEMINI.md, AGENTS.md, .cursorrules)
 */
export function installRules(targetDir, overwrite = false) {
  const srcRulesDir = path.join(TEMPLATES_DIR, 'rules');
  const installed = [];

  const files = ['GEMINI.md', 'AGENTS.md', '.cursorrules'];
  for (const file of files) {
    const src = path.join(srcRulesDir, file);
    const dest = path.join(targetDir, file);
    if (copyFile(src, dest, overwrite)) {
      installed.push(file);
    }
  }

  // Also copy GEMINI.md into .agents/rules/ if .agents directory exists
  const agentsRulesDir = path.join(targetDir, '.agents', 'rules');
  ensureDir(agentsRulesDir);
  copyFile(path.join(srcRulesDir, 'GEMINI.md'), path.join(agentsRulesDir, 'GEMINI.md'), overwrite);

  return installed;
}

/**
 * Installs standard dev configs (.editorconfig, .gitignore if not present)
 */
export function installConfigs(targetDir, overwrite = false) {
  const installed = [];
  const srcConfigsDir = path.join(TEMPLATES_DIR, 'configs');

  // .editorconfig
  const editorConfigSrc = path.join(srcConfigsDir, '.editorconfig');
  const editorConfigDest = path.join(targetDir, '.editorconfig');
  if (copyFile(editorConfigSrc, editorConfigDest, overwrite)) {
    installed.push('.editorconfig');
  }

  // .gitignore (don't overwrite if already exists)
  const gitignoreSrc = path.join(srcConfigsDir, 'sample.gitignore');
  const gitignoreDest = path.join(targetDir, '.gitignore');
  if (!fs.existsSync(gitignoreDest)) {
    copyFile(gitignoreSrc, gitignoreDest, false);
    installed.push('.gitignore');
  }

  return installed;
}

/**
 * Generates a starter IMPLEMENTATION_PLAN.md in target directory
 */
export function createPlanTemplate(targetDir, featureName = 'New Feature') {
  const planPath = path.join(targetDir, 'IMPLEMENTATION_PLAN.md');
  if (fs.existsSync(planPath)) {
    return { created: false, path: planPath };
  }

  const content = `# Implementation Plan: ${featureName}

> **Status:** Phase 1 Ready to Start  
> **Target Branch:** main  
> **Test Command:** npm test  
> **Lint/Check Command:** npm run check

---

## 1. Grounding & Decisions (Council)
- **Goal:** Clear summary of what is being built.
- **Observed Constraints:** Known constraints in this codebase.
- **Key Tradeoffs:** Decisions made during ideation.

---

## Phase 1: Foundation & Contracts
**Goal:** Establish interfaces, models, types, and configurations.

### Tasks
- [ ] Task 1.1: Define types / schema
- [ ] Task 1.2: Set up baseline configuration

### 🧪 Verification Gate
- [ ] Run typecheck / test suite (must exit code 0)
- [ ] Verify 0 unrequested dependencies added (Ponytail check)

### 📦 Git Checkpoint
\`\`\`bash
git add .
git commit -m "feat(init): phase 1 - foundation and contracts"
\`\`\`

### 🛑 HARD STOP
> **PAUSE HERE.** Review Phase 1 results and test outputs. Wait for user confirmation before proceeding to Phase 2.

---

## Phase 2: Core Implementation
**Goal:** Implement core logic and handlers.

### Tasks
- [ ] Task 2.1: Implement core functions
- [ ] Task 2.2: Add unit tests

### 🧪 Verification Gate
- [ ] Run test suite (all tests passing)
- [ ] Ponytail review on git diff (minimal diff, stdlib first)

### 📦 Git Checkpoint
\`\`\`bash
git add .
git commit -m "feat(core): phase 2 - core implementation"
\`\`\`

### 🛑 HARD STOP
> **PAUSE HERE.** Obtain user confirmation before proceeding to Phase 3.

---

## Phase 3: Integration & Polish
**Goal:** Connect to UI/API, handle edge cases, error boundaries, and documentation.

### Tasks
- [ ] Task 3.1: Connect to caller / UI
- [ ] Task 3.2: Verify end-to-end flow

### 🧪 Verification Gate
- [ ] Full test suite and lint passes

### 📦 Git Checkpoint
\`\`\`bash
git add .
git commit -m "feat(integration): phase 3 - wiring and integration"
\`\`\`

### 🛑 HARD STOP
> Final check with user before closing task.
`;

  fs.writeFileSync(planPath, content, 'utf-8');
  return { created: true, path: planPath };
}
