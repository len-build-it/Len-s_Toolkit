import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates');

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
 * Installs skills into target directory
 * Destination will be: targetDir/.agents/skills/ (or targetDir directly if global)
 */
export function installSkills(targetDir, isGlobal = false, overwrite = false) {
  const srcSkillsDir = path.join(TEMPLATES_DIR, 'skills');
  const destDir = isGlobal
    ? path.join(os.homedir(), '.gemini', 'config', 'skills')
    : path.join(targetDir, '.agents', 'skills');

  copyDir(srcSkillsDir, destDir, overwrite);
  if (!isGlobal) {
    copyDir(path.join(TEMPLATES_DIR, 'docs'), path.join(targetDir, '.agents', 'templates', 'docs'), overwrite);
  }
  return destDir;
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
    ...['AGENTS.md', 'GEMINI.md'].map((file) => ({ src: path.join(TEMPLATES_DIR, 'rules', file), dest: path.join(root, file) })),
    { src: path.join(TEMPLATES_DIR, 'rules', 'GEMINI.md'), dest: path.join(root, '.agents', 'rules', 'GEMINI.md') },
    ...templateFiles(path.join(TEMPLATES_DIR, 'skills'), path.join(root, '.agents', 'skills')),
    ...templateFiles(path.join(TEMPLATES_DIR, 'docs'), path.join(root, '.agents', 'templates', 'docs')),
    { src: path.join(TEMPLATES_DIR, 'configs', '.editorconfig'), dest: path.join(root, '.editorconfig') },
    { src: path.join(TEMPLATES_DIR, 'configs', 'sample.gitignore'), dest: path.join(root, '.gitignore') },
  ];
  // Refuse symlinks/junctions before copying anything, including links in parents.
  for (const { dest } of entries) {
    for (let current = dest; current !== root; current = path.dirname(current)) {
      const stat = fs.lstatSync(current, { throwIfNoEntry: false });
      if (stat?.isSymbolicLink() || (stat && (current === dest ? !stat.isFile() : !stat.isDirectory()))) {
        throw new Error(`Cannot install through "${current}": expected an ordinary ${current === dest ? 'file' : 'directory'}. Review this path and rerun start.`);
      }
    }
  }

  const installed = [];
  const differences = [];
  for (const { src, dest } of entries) {
    if (copyFile(src, dest)) installed.push(path.relative(root, dest));
    else if (fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n') !== fs.readFileSync(dest, 'utf8').replace(/\r\n/g, '\n')) {
      differences.push({ path: path.relative(root, dest), proposed: src });
    }
  }

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
    installed, differences, identityWarnings,
    documents: ['docs/SPEC_INDEX.md', 'HANDOFF.md', 'IMPLEMENTATION_PLAN.md'].map((file) => ({
      path: file, exists: fs.statSync(path.join(root, file), { throwIfNoEntry: false })?.isFile() === true,
    })),
  };
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
