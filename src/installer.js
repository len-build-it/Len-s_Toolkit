import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { RECORD_FILE, hashContent, planSkillSync, serializeRecord } from './skill-sync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates');
const BUNDLED_SKILLS_DIR = path.join(TEMPLATES_DIR, 'skills');
const { version: TOOLKIT_VERSION } = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));

/**
 * Ensures directory exists
 */
export function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    throw new Error(`Failed to create directory "${dirPath}": ${err.message}`, { cause: err });
  }
}

/**
 * Recursively copies directory contents
 */
export function copyDir(src, dest, overwrite = false) {
  try {
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
  } catch (err) {
    throw new Error(`Failed to copy directory from "${src}" to "${dest}": ${err.message}`, { cause: err });
  }
}

/**
 * Safely copies a single file
 */
export function copyFile(src, dest, overwrite = false) {
  try {
    ensureDir(path.dirname(dest));
    if (!fs.existsSync(dest) || overwrite) {
      fs.copyFileSync(src, dest);
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(`Failed to copy file from "${src}" to "${dest}": ${err.message}`, { cause: err });
  }
}

/**
 * Returns where Claude Code discovers skills: targetDir/.claude/skills/ (or ~/.claude/skills/ if global)
 */
export function claudeSkillsDir(targetDir, isGlobal = false) {
  return path.join(isGlobal ? os.homedir() : targetDir, '.claude', 'skills');
}

/**
 * Skills roots in install order: targetDir/.agents/skills/ and targetDir/.claude/skills/
 * (or ~/.gemini/config/skills/ and ~/.claude/skills/ if global)
 */
export function skillRoots(targetDir, isGlobal = false) {
  const agentsDir = isGlobal
    ? path.join(os.homedir(), '.gemini', 'config', 'skills')
    : path.join(targetDir, '.agents', 'skills');
  return [agentsDir, claudeSkillsDir(targetDir, isGlobal)];
}

/** Refuses symlinks, junctions, and wrong entry kinds from dest up to (not including) root. */
function assertOrdinaryPath(root, dest, destKind) {
  for (let current = dest; current !== root; current = path.dirname(current)) {
    const stat = fs.lstatSync(current, { throwIfNoEntry: false });
    const kind = current === dest ? destKind : 'directory';
    if (stat?.isSymbolicLink() || (stat && (kind === 'file' ? !stat.isFile() : !stat.isDirectory()))) {
      throw new Error(`Cannot install through "${current}": expected an ordinary ${kind}. Review this path and rerun.`);
    }
    if (current === path.dirname(current)) break;
  }
}

/** Hashes every file under dir by relative POSIX path, or returns null if it contains a link or special file. */
function hashTree(dir) {
  const files = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isFile()) {
      files[entry.name] = hashContent(fs.readFileSync(full));
    } else if (entry.isDirectory()) {
      const nested = hashTree(full);
      if (!nested) return null;
      for (const [file, hash] of Object.entries(nested)) files[`${entry.name}/${file}`] = hash;
    } else {
      return null;
    }
  }
  return files;
}

function bundledSkills() {
  return Object.fromEntries(fs.readdirSync(BUNDLED_SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [entry.name, hashTree(path.join(BUNDLED_SKILLS_DIR, entry.name))]));
}

// One plain path segment: no separators, drive colons, or "." and "..", so a record cannot point outside its root.
const PLAIN_SEGMENT = /^(?!\.\.?$)[^/\\:]+$/;

function readRecord(skillsDir) {
  const file = path.join(skillsDir, RECORD_FILE);
  const stat = fs.lstatSync(file, { throwIfNoEntry: false });
  if (!stat) return null;
  if (!stat.isFile()) {
    throw new Error(`Cannot use "${file}": expected an ordinary file. Review this path and rerun.`);
  }
  try {
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    const valid = record && typeof record.skills === 'object' && Object.entries(record.skills).every(
      ([skill, entry]) => PLAIN_SEGMENT.test(skill) && entry && typeof entry.files === 'object'
        && Object.entries(entry.files).every(([relative, hash]) => typeof hash === 'string'
          && relative.split('/').every((segment) => PLAIN_SEGMENT.test(segment)))
    );
    if (valid) return record;
  } catch {
    // Reported below with the recovery step.
  }
  throw new Error(`Ownership record "${file}" is not valid. Fix it, or delete it to treat existing skills as project-owned, then rerun.`);
}

function readSkillsRoot(skillsDir, names) {
  const installed = {};
  for (const name of names) {
    const stat = fs.lstatSync(path.join(skillsDir, name), { throwIfNoEntry: false });
    if (!stat) continue;
    const files = stat.isDirectory() && !stat.isSymbolicLink() ? hashTree(path.join(skillsDir, name)) : null;
    installed[name] = files ? { kind: 'dir', files } : { kind: 'other' };
  }
  return installed;
}

function pruneEmptyDirs(dir) {
  const stat = fs.lstatSync(dir, { throwIfNoEntry: false });
  if (!stat?.isDirectory() || stat.isSymbolicLink()) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) pruneEmptyDirs(path.join(dir, entry.name));
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

/**
 * Reads every skills root and plans the sync without writing anything, so failures leave no partial install.
 * Options: refresh (update owned skills), force (also replace locally edited owned skills), adopt (claim same-named skills).
 */
export function prepareSkillSync(targetDir, { isGlobal = false, refresh = false, force = false, adopt = false } = {}) {
  const bundled = bundledSkills();
  const projectRoot = path.resolve(targetDir);
  return skillRoots(projectRoot, isGlobal).map((dir) => {
    // A global root may itself be a link (dotfile managers); links inside it are still refused per skill.
    if (!isGlobal) assertOrdinaryPath(projectRoot, dir, 'directory');
    const record = readRecord(dir);
    const names = [...new Set([...Object.keys(bundled), ...Object.keys(record?.skills ?? {})])];
    const installed = readSkillsRoot(dir, names);
    return { dir, ...planSkillSync({ bundled, installed, record, refresh, force, adopt }) };
  });
}

/** Applies prepared plans and writes each ownership record. Returns per-root reports of skill names by action. */
export function applySkillSync(prepared) {
  return prepared.map(({ dir, actions, owned }) => {
    const report = { dir, bundledDir: BUNDLED_SKILLS_DIR, actions: {} };
    for (const { skill, action, write, remove } of actions) {
      const skillDir = path.join(dir, skill);
      for (const file of remove) fs.rmSync(path.join(skillDir, file), { force: true });
      for (const file of write) copyFile(path.join(BUNDLED_SKILLS_DIR, skill, file), path.join(skillDir, file), true);
      if (remove.length) pruneEmptyDirs(skillDir);
      (report.actions[action] ??= []).push(skill);
    }
    ensureDir(dir);
    const recordFile = path.join(dir, RECORD_FILE);
    const content = serializeRecord(owned, TOOLKIT_VERSION);
    const current = fs.existsSync(recordFile) ? fs.readFileSync(recordFile, 'utf8').replace(/\r\n/g, '\n') : null;
    if (current !== content) fs.writeFileSync(recordFile, content, 'utf8');
    return report;
  });
}

/**
 * Syncs bundled skills into both skills roots, preserving project-owned skills.
 * Local installs also supply document templates. Returns per-root reports.
 */
export function syncSkills(targetDir, options = {}) {
  const prepared = prepareSkillSync(targetDir, options);
  let docsDir;
  if (!options.isGlobal) {
    docsDir = path.join(targetDir, '.agents', 'templates', 'docs');
    assertOrdinaryPath(path.resolve(targetDir), path.resolve(docsDir), 'directory');
  }
  const reports = applySkillSync(prepared);
  if (docsDir) copyDir(path.join(TEMPLATES_DIR, 'docs'), docsDir, Boolean(options.refresh || options.force));
  return reports;
}

/**
 * Installs skills; overwrite also replaces toolkit-owned skills with local edits.
 * Returns the .agents (or global Gemini) destination.
 */
export function installSkills(targetDir, isGlobal = false, overwrite = false) {
  syncSkills(targetDir, { isGlobal, force: overwrite });
  return skillRoots(targetDir, isGlobal)[0];
}

/**
 * Updates toolkit-owned skills to the bundled version. Options: force, adopt.
 */
export function updateSkills(targetDir, isGlobal = false, options = {}) {
  syncSkills(targetDir, { ...options, isGlobal, refresh: true });
  return skillRoots(targetDir, isGlobal)[0];
}

function templateFiles(source, destination) {
  return fs.readdirSync(source, { withFileTypes: true }).flatMap((entry) => {
    const src = path.join(source, entry.name);
    const dest = path.join(destination, entry.name);
    return entry.isDirectory() ? templateFiles(src, dest) : [{ src, dest }];
  });
}

/** Prepare local instructions without replacing user files or approving work. */
export function startWorkspace(targetDir) {
  const root = path.resolve(targetDir);
  const git = (...args) => execFileSync('git', args, {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, LC_ALL: 'C' },
  }).trim();
  try {
    git('--version');
  } catch (err) {
    throw new Error('Git is unavailable. Install Git and ensure it is on PATH, then rerun start.', { cause: err });
  }

  let initialized = false;
  try {
    if (git('rev-parse', '--is-inside-work-tree') !== 'true') {
      throw new Error('Run start in a working tree, not a bare repository or Git metadata directory.');
    }
  } catch (err) {
    // Do not initialize over a broken or untrusted repository.
    if (!String(err.stderr).includes('not a git repository')) throw err;
    for (let directory = root; ; directory = path.dirname(directory)) {
      if (fs.lstatSync(path.join(directory, '.git'), { throwIfNoEntry: false })) {
        throw new Error(`Existing Git metadata at "${directory}" is not usable. Repair it before rerunning start.`, { cause: err });
      }
      if (directory === path.dirname(directory)) break;
    }
    git('init');
    initialized = true;
  }

  const entries = [
    ...['AGENTS.md', 'GEMINI.md', 'CLAUDE.md'].map((file) => ({ src: path.join(TEMPLATES_DIR, 'rules', file), dest: path.join(root, file) })),
    { src: path.join(TEMPLATES_DIR, 'rules', 'GEMINI.md'), dest: path.join(root, '.agents', 'rules', 'GEMINI.md') },
    ...templateFiles(path.join(TEMPLATES_DIR, 'docs'), path.join(root, '.agents', 'templates', 'docs')),
    { src: path.join(TEMPLATES_DIR, 'configs', '.editorconfig'), dest: path.join(root, '.editorconfig') },
    { src: path.join(TEMPLATES_DIR, 'configs', 'sample.gitignore'), dest: path.join(root, '.gitignore') },
  ];
  // Refuse symlinks/junctions and read existing skills before copying anything, including links in parents.
  for (const { dest } of entries) assertOrdinaryPath(root, dest, 'file');
  const skillSync = prepareSkillSync(root);

  const installed = [];
  const differences = [];
  for (const { src, dest } of entries) {
    if (copyFile(src, dest)) installed.push(path.relative(root, dest));
    else if (fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n') !== fs.readFileSync(dest, 'utf8').replace(/\r\n/g, '\n')) {
      differences.push({ path: path.relative(root, dest), proposed: src });
    }
  }
  const skills = applySkillSync(skillSync);

  // An existing CLAUDE.md stops Claude Code from reading AGENTS.md unless it imports it.
  const claudeImportMissing = !/(^|\s)@(\.\/)?AGENTS\.md(\s|$)/m.test(fs.readFileSync(path.join(root, 'CLAUDE.md'), 'utf8'));
  const reported = claudeImportMissing ? differences.filter((difference) => difference.path !== 'CLAUDE.md') : differences;

  const identityWarnings = [];
  for (const identity of ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT']) {
    try { git('var', identity); }
    catch { identityWarnings.push(`${identity} is unavailable. Configure your Git name/email before phase commits.`); }
  }
  return {
    initialized,
    repository: git('rev-parse', '--show-toplevel'),
    branch: git('branch', '--show-current') || '(detached HEAD)',
    changes: git('status', '--short'),
    installed, differences: reported, claudeImportMissing, skills, identityWarnings,
    documents: ['docs/SPEC_INDEX.md', 'HANDOFF.md', 'IMPLEMENTATION_PLAN.md'].map((file) => ({
      path: file, exists: fs.statSync(path.join(root, file), { throwIfNoEntry: false })?.isFile() === true,
    })),
  };
}

/**
 * Installs project agent rules (GEMINI.md, AGENTS.md, CLAUDE.md, .cursorrules)
 */
export function installRules(targetDir, overwrite = false) {
  const srcRulesDir = path.join(TEMPLATES_DIR, 'rules');
  const installed = [];

  const files = ['GEMINI.md', 'AGENTS.md', 'CLAUDE.md', '.cursorrules'];
  for (const file of files) {
    const src = path.join(srcRulesDir, file);
    const dest = path.join(targetDir, file);
    if (copyFile(src, dest, overwrite)) {
      installed.push(file);
    }
  }

  // Also copy GEMINI.md into .agents/rules/ if .agents directory exists
  const agentsDir = path.join(targetDir, '.agents');
  if (fs.existsSync(agentsDir)) {
    const agentsRulesDir = path.join(agentsDir, 'rules');
    ensureDir(agentsRulesDir);
    copyFile(path.join(srcRulesDir, 'GEMINI.md'), path.join(agentsRulesDir, 'GEMINI.md'), overwrite);
  }

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

  // .gitignore
  const gitignoreSrc = path.join(srcConfigsDir, 'sample.gitignore');
  const gitignoreDest = path.join(targetDir, '.gitignore');
  if (copyFile(gitignoreSrc, gitignoreDest, overwrite)) {
    installed.push('.gitignore');
  }

  return installed;
}

/**
 * Generates a starter IMPLEMENTATION_PLAN.md in target directory
 */
export function createPlanTemplate(targetDir, featureName = 'New Feature', overwrite = false) {
  try {
    const planPath = path.join(targetDir, 'IMPLEMENTATION_PLAN.md');
    if (fs.existsSync(planPath) && !overwrite) {
      return { created: false, path: planPath };
    }

    const timestamp = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('Z', '+08:00');
    const content = fs.readFileSync(path.join(TEMPLATES_DIR, 'docs', 'IMPLEMENTATION_PLAN.md'), 'utf8')
      .replaceAll('{{TIMESTAMP}}', timestamp)
      .replaceAll('{{FEATURE_NAME}}', () => featureName);
    fs.writeFileSync(planPath, content, 'utf-8');
    return { created: true, path: planPath };
  } catch (err) {
    throw new Error(`Failed to create plan template at "${targetDir}": ${err.message}`, { cause: err });
  }
}
