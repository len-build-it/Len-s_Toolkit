import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  installSkills,
  installRules,
  installConfigs,
  createPlanTemplate
} from '../src/installer.js';

test('installer correctly copies skills and rules to target directory', (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'len-toolkit-test-'));

  try {
    // 1. Install skills
    const skillsDest = installSkills(tempDir, false, true);
    assert(fs.existsSync(path.join(skillsDest, 'council', 'SKILL.md')), 'Council skill should exist');
    assert(fs.existsSync(path.join(skillsDest, 'implementation-plan', 'SKILL.md')), 'Implementation plan skill should exist');
    assert(fs.existsSync(path.join(skillsDest, 'ponytail', 'SKILL.md')), 'Ponytail skill should exist');

    // 2. Install rules
    const rules = installRules(tempDir, true);
    assert(fs.existsSync(path.join(tempDir, 'GEMINI.md')), 'GEMINI.md should exist');
    assert(fs.existsSync(path.join(tempDir, 'AGENTS.md')), 'AGENTS.md should exist');
    assert(fs.existsSync(path.join(tempDir, '.cursorrules')), '.cursorrules should exist');

    // 3. Install configs
    const configs = installConfigs(tempDir, true);
    assert(fs.existsSync(path.join(tempDir, '.editorconfig')), '.editorconfig should exist');
    assert(fs.existsSync(path.join(tempDir, '.gitignore')), '.gitignore should exist');

    // 4. Create plan template
    const planRes = createPlanTemplate(tempDir, 'Test Feature');
    assert(planRes.created, 'Plan should be created');
    assert(fs.existsSync(planRes.path), 'IMPLEMENTATION_PLAN.md should exist');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
