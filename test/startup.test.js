import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));

function workspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'len-start-test-'));
  const absolute = path.resolve(dir);
  assert.equal(path.dirname(absolute), path.resolve(os.tmpdir()));
  assert(path.basename(absolute).startsWith('len-start-test-'));
  t.after(() => fs.rmSync(absolute, { recursive: true, force: true }));
  return dir;
}

function run(dir, args = ['start'], env = process.env) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8', env, timeout: 15000 });
}

function git(dir, ...args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

test('start prepares a fresh project, supplies templates, and stays idempotent', (t) => {
  const dir = workspace(t);
  const first = run(dir);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(git(dir, 'rev-parse', '--is-inside-work-tree'), 'true');
  for (const file of ['AGENTS.md', 'GEMINI.md', '.editorconfig', '.gitignore', '.agents/skills/spec/SKILL.md', '.agents/templates/docs/IMPLEMENTATION_PLAN.md']) {
    assert(fs.statSync(path.join(dir, file)).isFile(), file);
  }
  assert.equal(fs.existsSync(path.join(dir, 'HANDOFF.md')), false);
  assert.equal(fs.existsSync(path.join(dir, 'docs')), false);
  assert.match(first.stdout, /does not approve implementation/);
  assert.match(first.stdout, /DOCUMENT REVIEW: HANDOFF.md: missing/);
  assert.equal(git(dir, 'diff', '--cached', '--name-only'), '');
  const head = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: dir });
  assert.notEqual(head.status, 0, 'startup must not make a commit');

  const policy = fs.readFileSync(path.join(dir, 'AGENTS.md'));
  const second = run(dir);
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, /Installed 0 missing files/);
  assert.doesNotMatch(second.stdout, /REVIEW: AGENTS.md differs/);
  assert.deepEqual(fs.readFileSync(path.join(dir, 'AGENTS.md')), policy);
});

test('start preserves custom rules, templates, specs, handoff, and staged work', (t) => {
  const dir = workspace(t);
  assert.equal(run(dir).status, 0);
  const custom = ['AGENTS.md', 'GEMINI.md', '.gitignore', '.agents/skills/spec/SKILL.md', '.agents/templates/docs/FEATURE.md', 'HANDOFF.md', 'docs/SPEC_INDEX.md'];
  for (const file of custom) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), `custom content: ${file}`);
  }
  git(dir, 'add', '--', 'HANDOFF.md');
  const staged = git(dir, 'diff', '--cached');
  const result = run(dir);
  assert.equal(result.status, 0, result.stderr);
  for (const file of custom) assert.equal(fs.readFileSync(path.join(dir, file), 'utf8'), `custom content: ${file}`);
  assert.match(result.stdout, /REVIEW: AGENTS.md differs; preserved/);
  assert.match(result.stdout, /Proposed version:/);
  assert.match(result.stdout, /HANDOFF.md: present; agent must verify currency and approval/);
  assert.equal(git(dir, 'diff', '--cached'), staged);
});

test('start finds an enclosing repository instead of creating a nested one', (t) => {
  const dir = workspace(t);
  git(dir, 'init', '-q');
  const child = path.join(dir, 'app');
  fs.mkdirSync(child);
  const result = run(child);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(child, '.git')), false);
  assert.equal(git(child, 'rev-parse', '--show-toplevel'), git(dir, 'rev-parse', '--show-toplevel'));
});

test('start reports missing commit identity without configuring it', (t) => {
  const dir = workspace(t);
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: path.join(dir, 'absent-config'), GIT_AUTHOR_NAME: '', GIT_AUTHOR_EMAIL: '', GIT_COMMITTER_NAME: '', GIT_COMMITTER_EMAIL: '' };
  const result = run(dir, ['start'], env);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /COMMIT CHECK:/);
  assert.notEqual(spawnSync('git', ['config', '--local', '--get', 'user.email'], { cwd: dir }).status, 0);
});

test('missing Git produces an actionable failure before any setup writes', (t) => {
  const dir = workspace(t);
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toLowerCase() !== 'path'));
  env.PATH = '';
  const result = run(dir, ['start'], env);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Git is unavailable/);
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('start refuses an obstructed destination without replacing user content', (t) => {
  const dir = workspace(t);
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), 'preserve me');
  fs.writeFileSync(path.join(dir, '.agents'), 'not a directory');
  const result = run(dir);
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, '.agents'), 'utf8'), 'not a directory');
  assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), 'preserve me');
});

test('start refuses a directory junction instead of writing outside the project', (t) => {
  const dir = workspace(t);
  const outside = workspace(t);
  fs.symlinkSync(outside, path.join(dir, '.agents'), process.platform === 'win32' ? 'junction' : 'dir');
  const result = run(dir);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Cannot install through/);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('start does not reinterpret a corrupt repository as an absent repository', (t) => {
  const dir = workspace(t);
  fs.writeFileSync(path.join(dir, '.git'), 'invalid metadata');
  const result = run(dir);
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, '.git'), 'utf8'), 'invalid metadata');
  assert.equal(fs.existsSync(path.join(dir, '.agents')), false);
});

test('start preserves a corrupt repository directory in an ancestor', (t) => {
  const dir = workspace(t);
  fs.mkdirSync(path.join(dir, '.git'));
  fs.writeFileSync(path.join(dir, '.git', 'keep'), 'existing metadata');
  const child = path.join(dir, 'app');
  fs.mkdirSync(child);
  const result = run(child);
  assert.notEqual(result.status, 0);
  assert.equal(fs.existsSync(path.join(child, '.git')), false);
  assert.deepEqual(fs.readdirSync(path.join(dir, '.git')), ['keep']);
});

test('start rejects destructive/global options and unknown arguments before writes', (t) => {
  const dir = workspace(t);
  for (const arg of ['--force', '--global', '--typo']) {
    const result = run(dir, ['start', arg]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /start is local and preserves existing files/);
  }
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('plan uses the shared template with literal names and Philippine timestamps', (t) => {
  const dir = workspace(t);
  const name = 'Example $& {{TIMESTAMP}}';
  const result = run(dir, ['plan', name]);
  assert.equal(result.status, 0, result.stderr);
  const content = fs.readFileSync(path.join(dir, 'IMPLEMENTATION_PLAN.md'), 'utf8');
  const timestamp = content.match(/^Created: (.+)$/m)[1];
  const source = fs.readFileSync(new URL('../templates/docs/IMPLEMENTATION_PLAN.md', import.meta.url), 'utf8');
  assert.equal(content, source.replaceAll('{{TIMESTAMP}}', timestamp).replaceAll('{{FEATURE_NAME}}', () => name));
  assert.match(timestamp, /\+08:00$/);
  assert(Math.abs(Date.parse(timestamp) - Date.now()) < 15000);
});
