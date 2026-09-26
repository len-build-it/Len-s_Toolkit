import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RECORD_FILE } from '../src/skill-sync.js';

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const ROOTS = ['.agents/skills', '.claude/skills'];

function workspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'len-existing-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function run(dir, ...args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8', timeout: 30000 });
}

// Snapshot of every file under dir, so "unchanged" also means "nothing added".
function snapshot(dir) {
  return Object.fromEntries(fs.readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const file = path.join(entry.parentPath ?? entry.path, entry.name);
      return [path.relative(dir, file), fs.readFileSync(file, 'utf8')];
    }));
}

function writeSkill(dir, root, name, body) {
  fs.mkdirSync(path.join(dir, root, name), { recursive: true });
  fs.writeFileSync(path.join(dir, root, name, 'SKILL.md'), `---\nname: ${name}\ndescription: ${body}\n---\n${body}\n`);
}

function teamRepository(t) {
  const dir = workspace(t);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  for (const root of ROOTS) {
    writeSkill(dir, root, 'refactoring', 'Team refactoring rules.');
    writeSkill(dir, root, 'deploy', 'Team deploy steps.');
  }
  return dir;
}

const teamSkills = (dir) => ROOTS.flatMap((root) => ['refactoring', 'deploy'].map((name) => path.join(dir, root, name)));

test('project skills survive every install and update command unchanged', (t) => {
  const dir = teamRepository(t);
  const before = teamSkills(dir).map(snapshot);
  for (const args of [['start'], ['skills'], ['--yes'], ['update'], ['update', '--force'], ['skills', '--force']]) {
    const result = run(dir, ...args);
    assert.equal(result.status, 0, `${args.join(' ')}: ${result.stderr}`);
    assert.deepEqual(teamSkills(dir).map(snapshot), before, `after ${args.join(' ')}`);
    if (args[0] !== 'start') continue;
    assert.match(result.stdout, /PROJECT SKILL: refactoring kept/);
    assert.match(result.stdout, /update --adopt/);
    assert.doesNotMatch(result.stdout, /deploy/);
  }
  for (const root of ROOTS) {
    const record = JSON.parse(fs.readFileSync(path.join(dir, root, RECORD_FILE), 'utf8'));
    assert.equal('refactoring' in record.skills, false);
    assert.equal('deploy' in record.skills, false);
    assert(fs.existsSync(path.join(dir, root, 'clean-code', 'SKILL.md')));
  }
});

test('update --adopt takes over same-named skills from an earlier toolkit install', (t) => {
  const dir = teamRepository(t);
  assert.equal(run(dir, 'update').status, 0);
  const result = run(dir, 'update', '--adopt');
  assert.equal(result.status, 0, result.stderr);
  const bundled = fs.readFileSync(new URL('../templates/skills/refactoring/SKILL.md', import.meta.url), 'utf8');
  for (const root of ROOTS) {
    assert.equal(fs.readFileSync(path.join(dir, root, 'refactoring', 'SKILL.md'), 'utf8'), bundled);
    assert(fs.existsSync(path.join(dir, root, 'refactoring', 'refactoring.mini.md')));
    assert.equal(fs.readFileSync(path.join(dir, root, 'deploy', 'SKILL.md'), 'utf8'), '---\nname: deploy\ndescription: Team deploy steps.\n---\nTeam deploy steps.\n');
    const record = JSON.parse(fs.readFileSync(path.join(dir, root, RECORD_FILE), 'utf8'));
    assert('refactoring' in record.skills);
  }
});

test('update removes a retired toolkit skill only when it has no local edits', (t) => {
  const dir = workspace(t);
  assert.equal(run(dir, 'skills').status, 0);
  const [agents, claude] = ROOTS.map((root) => path.join(dir, root));
  for (const root of [agents, claude]) {
    // Pretend an earlier release shipped "old-skill" by copying an owned entry under a new name.
    fs.cpSync(path.join(root, 'ponytail-help'), path.join(root, 'old-skill'), { recursive: true });
    const recordPath = path.join(root, RECORD_FILE);
    const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
    record.skills['old-skill'] = record.skills['ponytail-help'];
    fs.writeFileSync(recordPath, JSON.stringify(record));
  }
  fs.appendFileSync(path.join(claude, 'old-skill', 'SKILL.md'), '\nlocal note\n');

  const result = run(dir, 'update');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(agents, 'old-skill')), false);
  assert.match(fs.readFileSync(path.join(claude, 'old-skill', 'SKILL.md'), 'utf8'), /local note/);
  assert.match(result.stdout, /REMOVED: old-skill/);
  assert.match(result.stdout, /old-skill is no longer bundled and has local edits/);
  const record = JSON.parse(fs.readFileSync(path.join(claude, RECORD_FILE), 'utf8'));
  assert.equal('old-skill' in record.skills, false);
});

test('skills and update refuse a linked skills root and never write through a linked skill', (t) => {
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  for (const args of [['skills'], ['update']]) {
    const dir = workspace(t);
    const outside = workspace(t);
    fs.mkdirSync(path.join(dir, '.claude'));
    fs.symlinkSync(outside, path.join(dir, '.claude', 'skills'), type);
    const result = run(dir, ...args);
    assert.notEqual(result.status, 0, args.join(' '));
    assert.match(result.stderr, /Cannot install through/);
    assert.deepEqual(fs.readdirSync(outside), []);
    assert.equal(fs.existsSync(path.join(dir, '.agents', 'skills')), false, 'no partial install before the refusal');
  }

  const dir = workspace(t);
  const outside = workspace(t);
  fs.mkdirSync(path.join(dir, '.claude', 'skills'), { recursive: true });
  fs.symlinkSync(outside, path.join(dir, '.claude', 'skills', 'refactoring'), type);
  const result = run(dir, 'update', '--force', '--adopt');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PROJECT SKILL: refactoring kept/);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('a tampered ownership record cannot remove files outside the skills root', (t) => {
  const dir = workspace(t);
  assert.equal(run(dir, 'skills').status, 0);
  const victim = path.join(dir, 'keep.txt');
  fs.writeFileSync(victim, 'keep me');
  const recordPath = path.join(dir, '.claude', 'skills', RECORD_FILE);
  for (const [skill, file] of [['..', '../keep.txt'], ['x', '../../../keep.txt'], ['C:', 'keep.txt']]) {
    const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
    record.skills[skill] = { files: { [file]: 'f1a5bd6d0b2b7b5b8b3c9f8f7a4b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b' } };
    const original = fs.readFileSync(recordPath);
    fs.writeFileSync(recordPath, JSON.stringify(record));
    const result = run(dir, 'update');
    assert.notEqual(result.status, 0, `${skill}/${file}`);
    assert.match(result.stderr, /Ownership record .* is not valid/);
    assert.equal(fs.readFileSync(victim, 'utf8'), 'keep me');
    fs.writeFileSync(recordPath, original);
  }
});

test('a second start run is quiet and leaves the ownership record untouched', (t) => {
  const dir = workspace(t);
  assert.equal(run(dir, 'start').status, 0);
  const records = ROOTS.map((root) => fs.statSync(path.join(dir, root, RECORD_FILE)).mtimeMs);
  const again = run(dir, 'start');
  assert.equal(again.status, 0, again.stderr);
  assert.match(again.stdout, /0 installed, 0 updated, 24 unchanged/);
  assert.doesNotMatch(again.stdout, /PROJECT SKILL|LOCAL EDITS|UPDATES AVAILABLE/);
  assert.deepEqual(ROOTS.map((root) => fs.statSync(path.join(dir, root, RECORD_FILE)).mtimeMs), records);
});
