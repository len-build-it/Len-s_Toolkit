import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  ensureDir,
  copyDir,
  copyFile,
  installSkills,
  updateSkills,
  claudeSkillsDir,
  installRules,
  installConfigs,
  createPlanTemplate
} from '../src/installer.js';

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'len-toolkit-test-'));
}

function cleanup(dir) {
  if (dir && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe('ensureDir', () => {
  test('creates directory when it does not exist', () => {
    const tempDir = createTempDir();
    try {
      const target = path.join(tempDir, 'new-dir');
      assert.strictEqual(fs.existsSync(target), false);
      ensureDir(target);
      assert.strictEqual(fs.existsSync(target), true);
      assert.strictEqual(fs.statSync(target).isDirectory(), true);
    } finally {
      cleanup(tempDir);
    }
  });

  test('does nothing when directory already exists (idempotent)', () => {
    const tempDir = createTempDir();
    try {
      const target = path.join(tempDir, 'existing-dir');
      fs.mkdirSync(target);
      assert.doesNotThrow(() => ensureDir(target));
      assert.strictEqual(fs.existsSync(target), true);
    } finally {
      cleanup(tempDir);
    }
  });

  test('creates nested directories recursively', () => {
    const tempDir = createTempDir();
    try {
      const target = path.join(tempDir, 'nested', 'sub', 'dir');
      ensureDir(target);
      assert.strictEqual(fs.existsSync(target), true);
    } finally {
      cleanup(tempDir);
    }
  });
});

describe('copyFile', () => {
  test('copies file when destination does not exist', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'source.txt');
      const dest = path.join(tempDir, 'dest.txt');
      fs.writeFileSync(src, 'hello world', 'utf-8');
      const result = copyFile(src, dest, false);
      assert.strictEqual(result, true);
      assert.strictEqual(fs.existsSync(dest), true);
      assert.strictEqual(fs.readFileSync(dest, 'utf-8'), 'hello world');
    } finally {
      cleanup(tempDir);
    }
  });

  test('skips copy when destination exists and overwrite = false', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'source.txt');
      const dest = path.join(tempDir, 'dest.txt');
      fs.writeFileSync(src, 'new content', 'utf-8');
      fs.writeFileSync(dest, 'original content', 'utf-8');
      const result = copyFile(src, dest, false);
      assert.strictEqual(result, false);
      assert.strictEqual(fs.readFileSync(dest, 'utf-8'), 'original content');
    } finally {
      cleanup(tempDir);
    }
  });

  test('overwrites when destination exists and overwrite = true', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'source.txt');
      const dest = path.join(tempDir, 'dest.txt');
      fs.writeFileSync(src, 'new content', 'utf-8');
      fs.writeFileSync(dest, 'original content', 'utf-8');
      const result = copyFile(src, dest, true);
      assert.strictEqual(result, true);
      assert.strictEqual(fs.readFileSync(dest, 'utf-8'), 'new content');
    } finally {
      cleanup(tempDir);
    }
  });

  test('creates parent directories if they do not exist', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'source.txt');
      const dest = path.join(tempDir, 'nested', 'deep', 'dest.txt');
      fs.writeFileSync(src, 'nested content', 'utf-8');
      const result = copyFile(src, dest, false);
      assert.strictEqual(result, true);
      assert.strictEqual(fs.existsSync(dest), true);
      assert.strictEqual(fs.readFileSync(dest, 'utf-8'), 'nested content');
    } finally {
      cleanup(tempDir);
    }
  });

  test('returns true when copied, false when skipped', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'source.txt');
      const dest = path.join(tempDir, 'dest.txt');
      fs.writeFileSync(src, 'content', 'utf-8');
      assert.strictEqual(copyFile(src, dest, false), true);
      assert.strictEqual(copyFile(src, dest, false), false);
    } finally {
      cleanup(tempDir);
    }
  });
});

describe('copyDir', () => {
  test('recursively copies a directory tree', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'src-dir');
      const dest = path.join(tempDir, 'dest-dir');
      fs.mkdirSync(path.join(src, 'nested'), { recursive: true });
      fs.writeFileSync(path.join(src, 'file1.txt'), 'file1');
      fs.writeFileSync(path.join(src, 'nested', 'file2.txt'), 'file2');

      copyDir(src, dest, false);
      assert.strictEqual(fs.existsSync(path.join(dest, 'file1.txt')), true);
      assert.strictEqual(fs.existsSync(path.join(dest, 'nested', 'file2.txt')), true);
      assert.strictEqual(fs.readFileSync(path.join(dest, 'nested', 'file2.txt'), 'utf-8'), 'file2');
    } finally {
      cleanup(tempDir);
    }
  });

  test('does not overwrite existing files when overwrite = false', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'src-dir');
      const dest = path.join(tempDir, 'dest-dir');
      fs.mkdirSync(src, { recursive: true });
      fs.mkdirSync(dest, { recursive: true });
      fs.writeFileSync(path.join(src, 'file.txt'), 'new');
      fs.writeFileSync(path.join(dest, 'file.txt'), 'existing');

      copyDir(src, dest, false);
      assert.strictEqual(fs.readFileSync(path.join(dest, 'file.txt'), 'utf-8'), 'existing');
    } finally {
      cleanup(tempDir);
    }
  });

  test('does overwrite existing files when overwrite = true', () => {
    const tempDir = createTempDir();
    try {
      const src = path.join(tempDir, 'src-dir');
      const dest = path.join(tempDir, 'dest-dir');
      fs.mkdirSync(src, { recursive: true });
      fs.mkdirSync(dest, { recursive: true });
      fs.writeFileSync(path.join(src, 'file.txt'), 'new');
      fs.writeFileSync(path.join(dest, 'file.txt'), 'existing');

      copyDir(src, dest, true);
      assert.strictEqual(fs.readFileSync(path.join(dest, 'file.txt'), 'utf-8'), 'new');
    } finally {
      cleanup(tempDir);
    }
  });
});

describe('installSkills', () => {
  test('local install creates .agents/skills/ with all 24 skill directories', () => {
    const tempDir = createTempDir();
    try {
      const dest = installSkills(tempDir, false, false);
      assert.strictEqual(dest, path.join(tempDir, '.agents', 'skills'));
      const skills = [
        'spec',
        'council',
        'implementation-plan',
        'ponytail',
        'ponytail-audit',
        'ponytail-debt',
        'ponytail-gain',
        'ponytail-help',
        'ponytail-review',
        'security-audit',
        'a-philosophy-of-software-design',
        'clean-architecture',
        'clean-code',
        'code-complete',
        'designing-data-intensive-applications',
        'domain-driven-design',
        'domain-driven-design-distilled',
        'implementing-domain-driven-design',
        'patterns-of-enterprise-application-architecture',
        'refactoring',
        'refactoring-guru',
        'release-it',
        'the-pragmatic-programmer',
        'working-effectively-with-legacy-code'
      ];
      for (const skill of skills) {
        assert.strictEqual(fs.existsSync(path.join(dest, skill)), true, `Skill dir ${skill} should exist`);
      }
    } finally {
      cleanup(tempDir);
    }
  });

  test('each skill directory contains a SKILL.md file', () => {
    const tempDir = createTempDir();
    try {
      const dest = installSkills(tempDir, false, false);
      const skills = [
        'spec',
        'council',
        'implementation-plan',
        'ponytail',
        'ponytail-audit',
        'ponytail-debt',
        'ponytail-gain',
        'ponytail-help',
        'ponytail-review',
        'security-audit',
        'a-philosophy-of-software-design',
        'clean-architecture',
        'clean-code',
        'code-complete',
        'designing-data-intensive-applications',
        'domain-driven-design',
        'domain-driven-design-distilled',
        'implementing-domain-driven-design',
        'patterns-of-enterprise-application-architecture',
        'refactoring',
        'refactoring-guru',
        'release-it',
        'the-pragmatic-programmer',
        'working-effectively-with-legacy-code'
      ];
      for (const skill of skills) {
        const skillMd = path.join(dest, skill, 'SKILL.md');
        assert.strictEqual(fs.existsSync(skillMd), true, `${skill}/SKILL.md should exist`);
        assert(fs.statSync(skillMd).size > 0, `${skill}/SKILL.md should not be empty`);
      }
    } finally {
      cleanup(tempDir);
    }
  });

  test('verify all expected skill names are present', () => {
    const tempDir = createTempDir();
    try {
      const dest = installSkills(tempDir, false, false);
      const expectedSkills = [
        'spec',
        'council',
        'implementation-plan',
        'ponytail',
        'ponytail-audit',
        'ponytail-debt',
        'ponytail-gain',
        'ponytail-help',
        'ponytail-review',
        'security-audit',
        'a-philosophy-of-software-design',
        'clean-architecture',
        'clean-code',
        'code-complete',
        'designing-data-intensive-applications',
        'domain-driven-design',
        'domain-driven-design-distilled',
        'implementing-domain-driven-design',
        'patterns-of-enterprise-application-architecture',
        'refactoring',
        'refactoring-guru',
        'release-it',
        'the-pragmatic-programmer',
        'working-effectively-with-legacy-code'
      ];
      const entries = fs.readdirSync(dest, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort();
      assert.deepStrictEqual(entries, expectedSkills.slice().sort());
    } finally {
      cleanup(tempDir);
    }
  });

  test('local install returns path to target .agents/skills', () => {
    const tempDir = createTempDir();
    try {
      const dest = installSkills(tempDir, false, false);
      assert.strictEqual(dest, path.join(tempDir, '.agents', 'skills'));
    } finally {
      cleanup(tempDir);
    }
  });

  test('local install mirrors every skill into .claude/skills for Claude Code', () => {
    const tempDir = createTempDir();
    try {
      const dest = installSkills(tempDir, false, false);
      const claudeDest = claudeSkillsDir(tempDir);
      assert.strictEqual(claudeDest, path.join(tempDir, '.claude', 'skills'));
      const skills = fs.readdirSync(dest);
      assert.deepStrictEqual(fs.readdirSync(claudeDest).sort(), skills.sort());
      for (const skill of skills) {
        assert.deepStrictEqual(
          fs.readFileSync(path.join(claudeDest, skill, 'SKILL.md')),
          fs.readFileSync(path.join(dest, skill, 'SKILL.md')),
          `${skill}/SKILL.md should match in .claude/skills`
        );
      }
    } finally {
      cleanup(tempDir);
    }
  });

  test('global Claude Code skills go to ~/.claude/skills', () => {
    assert.strictEqual(claudeSkillsDir('ignored', true), path.join(os.homedir(), '.claude', 'skills'));
  });
});

describe('updateSkills', () => {
  test('overwrites existing skill files with bundled templates', () => {
    const tempDir = createTempDir();
    try {
      const dest = installSkills(tempDir, false, false);
      const skillPath = path.join(dest, 'spec', 'SKILL.md');
      fs.writeFileSync(skillPath, 'modified content', 'utf-8');
      assert.strictEqual(fs.readFileSync(skillPath, 'utf-8'), 'modified content');

      const updatedDest = updateSkills(tempDir);
      assert.strictEqual(updatedDest, dest);
      assert.notStrictEqual(fs.readFileSync(skillPath, 'utf-8'), 'modified content');
    } finally {
      cleanup(tempDir);
    }
  });

  test('overwrites outdated Claude Code skill files too', () => {
    const tempDir = createTempDir();
    try {
      installSkills(tempDir, false, false);
      const skillPath = path.join(claudeSkillsDir(tempDir), 'spec', 'SKILL.md');
      fs.writeFileSync(skillPath, 'modified content', 'utf-8');

      updateSkills(tempDir);
      assert.notStrictEqual(fs.readFileSync(skillPath, 'utf-8'), 'modified content');
    } finally {
      cleanup(tempDir);
    }
  });
});

describe('installRules', () => {
  test('installs GEMINI.md, AGENTS.md, CLAUDE.md, .cursorrules to target root', () => {
    const tempDir = createTempDir();
    try {
      const installed = installRules(tempDir, false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'GEMINI.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'AGENTS.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'CLAUDE.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.cursorrules')), true);
    } finally {
      cleanup(tempDir);
    }
  });

  test('CLAUDE.md imports AGENTS.md on its first line so Claude Code loads the shared policy', () => {
    const tempDir = createTempDir();
    try {
      installRules(tempDir, false);
      const firstLine = fs.readFileSync(path.join(tempDir, 'CLAUDE.md'), 'utf-8').split(/\r?\n/)[0];
      assert.strictEqual(firstLine, '@AGENTS.md');
    } finally {
      cleanup(tempDir);
    }
  });

  test('does NOT create .agents/rules/ when .agents/ does not exist', () => {
    const tempDir = createTempDir();
    try {
      installRules(tempDir, false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.agents')), false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.agents', 'rules')), false);
    } finally {
      cleanup(tempDir);
    }
  });

  test('DOES copy GEMINI.md into .agents/rules/ when .agents/ already exists', () => {
    const tempDir = createTempDir();
    try {
      fs.mkdirSync(path.join(tempDir, '.agents'));
      installRules(tempDir, false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.agents', 'rules', 'GEMINI.md')), true);
    } finally {
      cleanup(tempDir);
    }
  });

  test('respects overwrite = false and does not clobber existing files', () => {
    const tempDir = createTempDir();
    try {
      fs.writeFileSync(path.join(tempDir, 'GEMINI.md'), 'custom gemini');
      const installed = installRules(tempDir, false);
      assert.strictEqual(fs.readFileSync(path.join(tempDir, 'GEMINI.md'), 'utf-8'), 'custom gemini');
      assert.strictEqual(installed.includes('GEMINI.md'), false);
    } finally {
      cleanup(tempDir);
    }
  });

  test('returns array of actually installed file names', () => {
    const tempDir = createTempDir();
    try {
      const installed = installRules(tempDir, false);
      assert.deepStrictEqual(installed.sort(), ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules'].sort());
    } finally {
      cleanup(tempDir);
    }
  });
});

describe('installConfigs', () => {
  test('installs .editorconfig and .gitignore when neither exists', () => {
    const tempDir = createTempDir();
    try {
      const installed = installConfigs(tempDir, false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.editorconfig')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.gitignore')), true);
      assert.deepStrictEqual(installed.sort(), ['.editorconfig', '.gitignore'].sort());
    } finally {
      cleanup(tempDir);
    }
  });

  test('.gitignore IS overwritten when overwrite = true', () => {
    const tempDir = createTempDir();
    try {
      fs.writeFileSync(path.join(tempDir, '.gitignore'), 'custom-ignore');
      const installed = installConfigs(tempDir, true);
      assert.strictEqual(installed.includes('.gitignore'), true);
      assert.notStrictEqual(fs.readFileSync(path.join(tempDir, '.gitignore'), 'utf-8'), 'custom-ignore');
    } finally {
      cleanup(tempDir);
    }
  });

  test('.gitignore is NOT overwritten when overwrite = false', () => {
    const tempDir = createTempDir();
    try {
      fs.writeFileSync(path.join(tempDir, '.gitignore'), 'custom-ignore');
      const installed = installConfigs(tempDir, false);
      assert.strictEqual(installed.includes('.gitignore'), false);
      assert.strictEqual(fs.readFileSync(path.join(tempDir, '.gitignore'), 'utf-8'), 'custom-ignore');
    } finally {
      cleanup(tempDir);
    }
  });

  test('returns array of actually installed file names', () => {
    const tempDir = createTempDir();
    try {
      fs.writeFileSync(path.join(tempDir, '.editorconfig'), 'custom');
      const installed = installConfigs(tempDir, false);
      assert.deepStrictEqual(installed, ['.gitignore']);
    } finally {
      cleanup(tempDir);
    }
  });
});

describe('createPlanTemplate', () => {
  test('creates IMPLEMENTATION_PLAN.md with feature name interpolated', () => {
    const tempDir = createTempDir();
    try {
      const result = createPlanTemplate(tempDir, 'User Authentication');
      assert.strictEqual(result.created, true);
      assert.strictEqual(fs.existsSync(result.path), true);
      const content = fs.readFileSync(result.path, 'utf-8');
      assert(content.includes('# Implementation Plan: User Authentication'));
    } finally {
      cleanup(tempDir);
    }
  });

  test('returns { created: false } when file already exists and overwrite = false', () => {
    const tempDir = createTempDir();
    try {
      const planPath = path.join(tempDir, 'IMPLEMENTATION_PLAN.md');
      fs.writeFileSync(planPath, 'existing plan');
      const result = createPlanTemplate(tempDir, 'Ignored Feature', false);
      assert.strictEqual(result.created, false);
      assert.strictEqual(result.path, planPath);
      assert.strictEqual(fs.readFileSync(planPath, 'utf-8'), 'existing plan');
    } finally {
      cleanup(tempDir);
    }
  });

  test('returns { created: true } when file already exists but overwrite = true', () => {
    const tempDir = createTempDir();
    try {
      const planPath = path.join(tempDir, 'IMPLEMENTATION_PLAN.md');
      fs.writeFileSync(planPath, 'old plan');
      const result = createPlanTemplate(tempDir, 'New Overwritten Feature', true);
      assert.strictEqual(result.created, true);
      assert.strictEqual(result.path, planPath);
      assert(fs.readFileSync(planPath, 'utf-8').includes('# Implementation Plan: New Overwritten Feature'));
    } finally {
      cleanup(tempDir);
    }
  });

  test('default feature name is New Feature', () => {
    const tempDir = createTempDir();
    try {
      const result = createPlanTemplate(tempDir);
      assert.strictEqual(result.created, true);
      const content = fs.readFileSync(result.path, 'utf-8');
      assert(content.includes('# Implementation Plan: New Feature'));
    } finally {
      cleanup(tempDir);
    }
  });
});
