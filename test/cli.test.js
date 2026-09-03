import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(__dirname, '..', 'bin', 'cli.js');
const PKG_PATH = path.resolve(__dirname, '..', 'package.json');
const { version: PKG_VERSION } = JSON.parse(fs.readFileSync(PKG_PATH, 'utf-8'));

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'len-toolkit-cli-test-'));
}

function cleanup(dir) {
  if (dir && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function runCli(args, cwd) {
  try {
    const stdout = execFileSync(process.execPath, [CLI_PATH, ...args], {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { status: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      status: err.status ?? 1,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : ''
    };
  }
}

describe('CLI Integration', () => {
  test('--help flag prints usage, commands, and options', () => {
    const tempDir = createTempDir();
    try {
      const res = runCli(['--help'], tempDir);
      assert.strictEqual(res.status, 0);
      assert(res.stdout.includes('USAGE:'), 'Stdout should contain USAGE:');
      assert(res.stdout.includes('COMMANDS:'), 'Stdout should contain COMMANDS:');
      assert(res.stdout.includes('OPTIONS:'), 'Stdout should contain OPTIONS:');
    } finally {
      cleanup(tempDir);
    }
  });

  test('--version flag prints current version from package.json', () => {
    const tempDir = createTempDir();
    try {
      const res = runCli(['--version'], tempDir);
      assert.strictEqual(res.status, 0);
      assert(res.stdout.includes(`len-toolkit v${PKG_VERSION}`), `Stdout should contain len-toolkit v${PKG_VERSION}`);
    } finally {
      cleanup(tempDir);
    }
  });

  test('--yes flag performs full non-interactive install', () => {
    const tempDir = createTempDir();
    try {
      const res = runCli(['--yes'], tempDir);
      assert.strictEqual(res.status, 0);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'GEMINI.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'AGENTS.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.cursorrules')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.editorconfig')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'council', 'SKILL.md')), true);
    } finally {
      cleanup(tempDir);
    }
  });

  test('skills command installs only skills library', () => {
    const tempDir = createTempDir();
    try {
      const res = runCli(['skills'], tempDir);
      assert.strictEqual(res.status, 0);
      assert(res.stdout.includes('Installed skills'), 'Stdout should confirm installed skills');
      const expectedSkills = [
        'council',
        'implementation-plan',
        'ponytail',
        'ponytail-audit',
        'ponytail-debt',
        'ponytail-gain',
        'ponytail-help',
        'ponytail-review'
      ];
      for (const skill of expectedSkills) {
        assert.strictEqual(
          fs.existsSync(path.join(tempDir, '.agents', 'skills', skill, 'SKILL.md')),
          true,
          `Skill ${skill} should exist`
        );
      }
      // Rules and configs should NOT be installed
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'GEMINI.md')), false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.editorconfig')), false);
    } finally {
      cleanup(tempDir);
    }
  });

  test('rules command installs only agent rules', () => {
    const tempDir = createTempDir();
    try {
      const res = runCli(['rules'], tempDir);
      assert.strictEqual(res.status, 0);
      assert(res.stdout.includes('Installed agent rules'), 'Stdout should confirm installed agent rules');
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'GEMINI.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'AGENTS.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.cursorrules')), true);
      // Skills and configs should NOT be installed
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.agents', 'skills')), false);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.editorconfig')), false);
    } finally {
      cleanup(tempDir);
    }
  });

  test('plan command generates, avoids clobbering, and overwrites with --force', () => {
    const tempDir = createTempDir();
    try {
      const planFile = path.join(tempDir, 'IMPLEMENTATION_PLAN.md');

      // 1. Initial generation
      const res1 = runCli(['plan', 'Auth System'], tempDir);
      assert.strictEqual(res1.status, 0);
      assert.strictEqual(fs.existsSync(planFile), true);
      const content1 = fs.readFileSync(planFile, 'utf-8');
      assert(content1.includes('Auth System'), 'Plan should contain feature name Auth System');

      // 2. Run again without --force (should not overwrite)
      const res2 = runCli(['plan', 'Overwritten System'], tempDir);
      assert.strictEqual(res2.status, 0);
      assert(res2.stdout.includes('already exists'), 'Stdout should state already exists');
      const content2 = fs.readFileSync(planFile, 'utf-8');
      assert.strictEqual(content2, content1, 'File content should remain untouched');

      // 3. Run with --force (should overwrite)
      const res3 = runCli(['plan', 'Overwritten System', '--force'], tempDir);
      assert.strictEqual(res3.status, 0);
      assert(res3.stdout.includes('Created'), 'Stdout should confirm plan created');
      const content3 = fs.readFileSync(planFile, 'utf-8');
      assert(content3.includes('Overwritten System'), 'Plan should now contain Overwritten System');
    } finally {
      cleanup(tempDir);
    }
  });

  test('unknown command with --yes falls through to init and installs all components', () => {
    const tempDir = createTempDir();
    try {
      const res = runCli(['notacommand', '--yes'], tempDir);
      assert.strictEqual(res.status, 0);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'GEMINI.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, 'AGENTS.md')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.editorconfig')), true);
      assert.strictEqual(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'council', 'SKILL.md')), true);
    } finally {
      cleanup(tempDir);
    }
  });
});
