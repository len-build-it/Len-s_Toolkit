import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hashContent, planSkillSync, serializeRecord } from '../src/skill-sync.js';

const V1 = { 'SKILL.md': 'h-skill-1', 'rules.md': 'h-rules-1' };
const V2 = { 'SKILL.md': 'h-skill-2', 'rules.md': 'h-rules-1', 'new.md': 'h-new' };
const EDITED = { 'SKILL.md': 'h-edited', 'rules.md': 'h-rules-1' };
const THEIRS = { 'SKILL.md': 'h-theirs' };

const dir = (files) => ({ kind: 'dir', files });
const owns = (skills) => ({ skills: Object.fromEntries(Object.entries(skills).map(([k, files]) => [k, { files }])) });

function plan(input) {
  const { actions, owned } = planSkillSync({ bundled: { x: V2 }, installed: {}, record: null, ...input });
  const [only] = actions.filter((a) => a.skill === 'x');
  return { ...only, owned: owned.x?.files };
}

describe('hashContent', () => {
  test('treats CRLF and LF checkouts of the same file as identical', () => {
    assert.equal(hashContent(Buffer.from('a\r\nb\r\n')), hashContent(Buffer.from('a\nb\n')));
    assert.equal(hashContent('a\r\nb'), hashContent(Buffer.from('a\nb')));
  });

  test('distinguishes different content', () => {
    assert.notEqual(hashContent('a'), hashContent('b'));
    assert.match(hashContent('a'), /^[0-9a-f]{64}$/);
  });
});

describe('planSkillSync', () => {
  // [description, input overrides, expected action, expected writes, expected removes, expected owned files]
  const cases = [
    ['installs an absent skill', {}, 'install', Object.keys(V2), [], V2],
    ['reinstalls an owned skill the user deleted', { record: owns({ x: V1 }) }, 'install', Object.keys(V2), [], V2],
    ['records an installed copy that already matches', { installed: { x: dir(V2) }, record: owns({ x: V1 }) }, 'unchanged', [], [], V2],
    ['adopts an unowned copy identical to the bundled one', { installed: { x: dir(V2) } }, 'unchanged', [], [], V2],
    ['keeps an outdated owned skill without refresh', { installed: { x: dir(V1) }, record: owns({ x: V1 }) }, 'outdated', [], [], V1],
    ['updates an outdated owned skill on refresh', { installed: { x: dir(V1) }, record: owns({ x: V1 }), refresh: true }, 'update', Object.keys(V2), [], V2],
    ['keeps an owned skill with local edits on refresh', { installed: { x: dir(EDITED) }, record: owns({ x: V1 }), refresh: true }, 'modified', [], [], V1],
    ['replaces an owned skill with local edits on force', { installed: { x: dir(EDITED) }, record: owns({ x: V1 }), force: true }, 'replace', Object.keys(V2), [], V2],
    ['treats a deleted owned file as a local edit', { installed: { x: dir({ 'SKILL.md': 'h-skill-1' }) }, record: owns({ x: V1 }), refresh: true }, 'modified', [], [], V1],
    ['ignores extra user files when judging edits', { installed: { x: dir({ ...V1, 'notes.md': 'h' }) }, record: owns({ x: V1 }), refresh: true }, 'update', Object.keys(V2), [], V2],
    ['never writes an unowned same-named skill', { installed: { x: dir(THEIRS) }, refresh: true, force: true }, 'collision', [], [], undefined],
    ['adopts an unowned same-named skill only on adopt', { installed: { x: dir(THEIRS) }, adopt: true }, 'adopt', Object.keys(V2), [], V2],
    ['never writes through a link or non-directory', { installed: { x: { kind: 'other' } }, record: owns({ x: V1 }), force: true, adopt: true }, 'collision', [], [], undefined],
  ];
  for (const [description, input, action, write, remove, owned] of cases) {
    test(description, () => {
      const result = plan(input);
      assert.equal(result.action, action);
      assert.deepEqual(result.write, write);
      assert.deepEqual(result.remove, remove);
      assert.deepEqual(result.owned, owned);
    });
  }

  test('removes files the toolkit dropped from an updated skill', () => {
    const result = plan({ bundled: { x: V1 }, installed: { x: dir(V2) }, record: owns({ x: V2 }), refresh: true });
    assert.equal(result.action, 'update');
    assert.deepEqual(result.remove, ['new.md']);
  });

  describe('retired skills (owned but no longer bundled)', () => {
    const retired = (input) => plan({ bundled: {}, ...input });
    test('are removed on refresh when unmodified', () => {
      const result = retired({ installed: { x: dir(V1) }, record: owns({ x: V1 }), refresh: true });
      assert.equal(result.action, 'remove');
      assert.deepEqual(result.remove, Object.keys(V1));
      assert.equal(result.owned, undefined);
    });
    test('are kept and still owned without refresh', () => {
      const result = retired({ installed: { x: dir(V1) }, record: owns({ x: V1 }) });
      assert.equal(result.action, 'retired');
      assert.deepEqual(result.owned, V1);
    });
    test('are kept and released to the project when modified', () => {
      const result = retired({ installed: { x: dir(EDITED) }, record: owns({ x: V1 }), force: true });
      assert.equal(result.action, 'retired-modified');
      assert.deepEqual(result.remove, []);
      assert.equal(result.owned, undefined);
    });
    test('are forgotten when already deleted', () => {
      const { actions, owned } = planSkillSync({ bundled: {}, installed: {}, record: owns({ x: V1 }), refresh: true });
      assert.deepEqual(actions, []);
      assert.deepEqual(owned, {});
    });
  });

  test('only plans bundled or owned names, never unrelated project skills', () => {
    const { actions, owned } = planSkillSync({ bundled: { x: V2 }, installed: { deploy: dir(THEIRS) }, record: null, force: true });
    assert.deepEqual(actions.map((a) => a.skill), ['x']);
    assert.deepEqual(Object.keys(owned), ['x']);
  });
});

test('serializeRecord sorts keys and ends with a newline', () => {
  const text = serializeRecord({ b: { files: { 'z.md': '2', 'a.md': '1' } }, a: { files: {} } }, '9.9.9');
  assert.equal(text, `${JSON.stringify({ skills: { a: { files: {} }, b: { files: { 'a.md': '1', 'z.md': '2' } } }, toolkitVersion: '9.9.9' }, null, 2)}\n`);
});

test('policy module stays free of filesystem and process access', () => {
  const source = fs.readFileSync(new URL('../src/skill-sync.js', import.meta.url), 'utf8');
  const imports = [...source.matchAll(/^import .* from '([^']+)';$/gm)].map((m) => m[1]);
  assert.deepEqual(imports, ['node:crypto']);
  assert.doesNotMatch(source, /\bprocess\.|\brequire\(|import\(/);
});
