import { createHash } from 'node:crypto';

/**
 * Skill ownership policy. Decides what the toolkit may write in a skills root.
 * Pure: plain data in, plain data out. Filesystem access belongs to the installer.
 */

export const RECORD_FILE = '.len-toolkit.json';

/** SHA-256 of file content with CRLF normalized to LF, so Git line-ending conversion is not an edit. */
export function hashContent(content) {
  const bytes = Buffer.isBuffer(content) ? content.toString('latin1') : Buffer.from(content, 'utf8').toString('latin1');
  return createHash('sha256').update(bytes.replace(/\r\n/g, '\n'), 'latin1').digest('hex');
}

// True when every file in `expected` is present in `actual` with the same hash; extra files are ignored.
function contains(actual, expected) {
  return Object.entries(expected).every(([file, hash]) => actual[file] === hash);
}

function pathsOnlyIn(from, other) {
  return Object.keys(from).filter((file) => !(file in other));
}

/**
 * Plans a sync of bundled skills into one skills root.
 *
 * @param {object} input
 * @param {Record<string, Record<string, string>>} input.bundled skill -> relative file -> hash
 * @param {Record<string, {kind: 'dir', files: Record<string, string>} | {kind: 'other'}>} input.installed
 *   state of each relevant skill name present in the root; absent names are not installed
 * @param {{skills: Record<string, {files: Record<string, string>}>} | null} input.record ownership record
 * @param {boolean} [input.refresh] update unmodified owned skills and remove retired ones
 * @param {boolean} [input.force] also replace owned skills with local edits (implies refresh)
 * @param {boolean} [input.adopt] claim same-named skills that the record does not own
 * @returns {{actions: Array<{skill: string, action: string, write: string[], remove: string[]}>,
 *   owned: Record<string, {files: Record<string, string>}>}}
 */
export function planSkillSync({ bundled, installed, record, refresh = false, force = false, adopt = false }) {
  const owned = record?.skills ?? {};
  const nextOwned = {};
  const actions = [];
  const refreshing = refresh || force;
  const act = (skill, action, write = [], remove = []) => actions.push({ skill, action, write, remove });

  const names = [...new Set([...Object.keys(bundled), ...Object.keys(owned)])].sort();
  for (const skill of names) {
    const target = bundled[skill];
    const state = installed[skill];
    const ownedFiles = owned[skill]?.files;

    if (state?.kind === 'other') {
      act(skill, 'collision');
      continue;
    }

    if (!target) {
      // Retired from the toolkit: only an unmodified owned copy may be removed.
      if (!state) continue;
      if (!contains(state.files, ownedFiles)) {
        act(skill, 'retired-modified');
      } else if (refreshing) {
        act(skill, 'remove', [], Object.keys(ownedFiles));
      } else {
        nextOwned[skill] = { files: ownedFiles };
        act(skill, 'retired');
      }
      continue;
    }

    const all = Object.keys(target);
    if (!state) {
      nextOwned[skill] = { files: target };
      act(skill, 'install', all);
      continue;
    }

    if (contains(state.files, target)) {
      nextOwned[skill] = { files: target };
      act(skill, 'unchanged');
      continue;
    }

    if (!ownedFiles) {
      if (adopt) {
        nextOwned[skill] = { files: target };
        act(skill, 'adopt', all);
      } else {
        act(skill, 'collision');
      }
      continue;
    }

    const modified = !contains(state.files, ownedFiles);
    if (modified ? force : refreshing) {
      nextOwned[skill] = { files: target };
      act(skill, modified ? 'replace' : 'update', all, pathsOnlyIn(ownedFiles, target));
    } else {
      nextOwned[skill] = { files: ownedFiles };
      act(skill, modified ? 'modified' : 'outdated');
    }
  }

  return { actions, owned: nextOwned };
}

/** Serializes an ownership record with stable key order and a trailing newline. */
export function serializeRecord(owned, toolkitVersion) {
  const sorted = (object) => Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]));
  const skills = sorted(Object.fromEntries(
    Object.entries(owned).map(([skill, { files }]) => [skill, { files: sorted(files) }])
  ));
  return `${JSON.stringify({ skills, toolkitVersion }, null, 2)}\n`;
}
