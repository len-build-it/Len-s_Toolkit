#!/usr/bin/env node

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error('len-toolkit requires Node.js >= 18.0.0. Current: ' + process.version);
  process.exit(1);
}

import readline from 'node:readline';
import process from 'node:process';
import { readFileSync } from 'node:fs';
import {
  installSkills,
  installRules,
  installConfigs,
  createPlanTemplate,
  startWorkspace
} from '../src/installer.js';

const { version: VERSION } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
);

const ASCII_ART_LEFT = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡔⣿⣿⣻⡿⢶⣄⣐⣢⡄⢀⡀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢞⢃⢰⣿⣿⣿⣿⡿⣾⣭⣳⣟⣶⣶⣷⣺⠭⣭⠟⠋⢉⠇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣶⠃⠋⡀⣾⣿⣿⣿⣿⣿⣷⣿⣷⣿⣿⣷⣽⡻⣿⢡⣜⣠⠏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⠟⡌⡀⠁⠀⣽⣿⢻⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣻⣶⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⡟⢸⣸⢁⠄⣇⢿⣿⠻⣼⢻⣿⣳⣿⡿⣾⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣸⠡⡇⢹⠎⢸⢳⣸⣿⢷⣯⣟⣿⡿⣾⣿⣿⣿⣿⢿⢿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢹⢰⡏⢼⡃⣼⣦⣧⣿⣿⣿⣿⡟⣷⣿⣷⣿⣿⣿⡏⢼⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡼⢸⠁⣿⡷⣿⣟⣿⣿⣿⣿⢿⠐⣿⣿⡿⣿⣿⡿⠀⢸⣿⣿⣿⢹⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡇⣼⢸⣿⣿⣿⣿⣸⣿⣿⣿⣿⣿⣿⣿⠿⣿⢟⣣⣼⣿⣿⣿⡿⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠀⢹⢸⣿⣿⣿⢿⣯⣿⢿⡏⠘⠛⠘⠻⠌⠙⠈⢟⣱⣿⣿⣿⠃⡸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠀⣸⣾⣯⣿⣿⢯⡟⣿⡌⢻⡄⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⡃⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⡇⣇⣿⣿⣽⣿⣿⡿⣿⣿⣶⣝⡂⠀⠀⠤⢀⣤⣿⣿⣿⣿⣷⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡼⣸⣿⣿⣿⣿⡿⠁⢳⣻⡜⣿⣿⣶⣤⣶⣿⣿⣿⢸⣿⡎⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⢳⣿⣿⣿⣿⡿⣷⡀⠘⣾⣇⠹⣟⣿⡳⢯⡪⣙⢻⣴⣿⣧⠈⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⢣⣯⢿⣿⣿⠛⠀⠹⣿⣆⢻⣯⠀⠈⠉⠀⠀⠱⣩⡙⠻⣹⣻⣆⠘⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⢯⡟⣾⣿⡿⢧⡉⠁⠐⠂⠻⣿⣟⠀⠀⠀⠀⠀⠀⠲⣧⠀⣙⣧⢿⡄⠘⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣿⣿⣹⣿⡏⠁⠀⠻⣄⣀⣀⣼⠏⢿⣿⡄⠀⠀⠀⠀⢸⢹⠓⢽⣭⢟⣾⡀⠘⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢾⣿⣳⣿⣿⡇⠀⠀⠀⠀⠈⠉⠀⠀⠀⠻⣿⡄⠀⠀⠀⣇⠘⠀⠀⠹⡜⣾⣡⠀⢹⡀⠀⠀⠀⠀⠀⠀
⠀⢀⣿⢯⣿⣿⣿⣇⠀⢀⠤⣒⡉⠈⠉⠉⠉⠑⠻⣿⣦⣄⣰⠳⠀⠀⠀⠀⠘⣿⣟⡇⠈⡇⠀⠀⠀⠀⠀⠀
⠀⣾⠏⣾⣿⣿⣿⣞⣢⡿⠷⣶⡤⣄⡐⠢⠤⣀⠀⢹⡿⡈⠹⣖⠀⠀⠀⠀⢀⣯⣿⣷⠀⡧⠀⠀⠀⠀⠀⠀
⢸⡟⢰⣻⣿⣿⣯⣏⡇⠀⠀⠀⠈⠳⣵⠨⡑⠒⠧⠀⣯⣗⠀⠈⠓⣄⠀⠀⠘⣸⢹⡿⢀⠇⠀⠀⠀⠀⠀⠀
⣿⠓⣻⣿⣿⢺⡿⣿⣼⡀⠀⠀⠀⠀⠹⣇⠙⣆⠀⠀⣾⡏⠀⠀⠀⠈⢣⣄⢂⡿⢸⣧⠞⠀⠀⠀⠀⠀⠀⠀
⡟⡄⣿⢸⣿⣠⢿⣟⣷⣷⠀⠀⠀⠀⠀⢻⡄⠈⢦⣠⠟⠀⠀⠀⢀⣼⡈⢋⠸⢧⣻⣿⠀⠀⠀⠀⠀⠀⠀⠀
⠸⢱⣿⡏⢿⣧⡳⣹⢿⣿⡷⡀⠀⠀⠀⠀⢧⠀⠆⠀⠂⣤⠀⢀⣡⢻⠃⡔⡸⣰⡟⡏⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠡⢿⣿⢎⠿⣷⡈⠑⠻⢿⣟⠠⠒⠁⠀⠘⡆⣏⠀⢠⡏⠐⢁⠆⣸⠸⠁⡎⢸⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠈⣿⡈⢶⢍⣻⣶⣀⡀⠃⢃⠀⠀⠀⠀⢧⢻⢀⣿⠁⢠⠃⢀⣧⠇⢠⢇⢸⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠘⣷⠈⢳⡌⠛⢩⠙⠛⡏⠀⠀⠀⠀⠘⣿⢸⡏⠀⠀⠀⣼⢺⠀⡞⡞⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣄⠉⠢⢄⡀⠀⢹⡀⠀⠀⠀⠀⣿⣹⠇⠀⠀⢰⠃⠎⢰⣷⠃⠊⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠓⠤⣀⣈⡽⠋⣧⡀⠀⠀⠀⣿⣼⠀⠀⢠⠇⡬⠃⣼⡟⠀⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠀⠀⠀⠘⡇⠀⠀⢀⡍⢻⡄⢠⢏⡜⠁⢠⣿⠃⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣴⠁⠀⠀⠀⠀⠀⢹⡄⠀⡸⢀⢺⡌⣏⡞⠀⢀⣾⡏⠀⠀⠠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡞⠀⠀⠀⠀⠀⠀⠀⠈⢧⠘⡇⠄⢂⣧⠀⡇⠀⢠⠏⣷⠀⠀⢸⡍⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⠎⠀⠀⠰⠀⠀⠀⠀⠀⠀⠸⣆⠑⡈⠄⣸⡆⡐⢰⡏⢰⣿⠀⠀⢹⠄⣷⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡞⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⢿⡆⠐⠂⠌⣷⠈⡌⠰⡘⣿⣸⠐⠸⠀⣿⣹⠲⣄⠀⠀⠀⠀⠀
⠀⠀⠀⣼⠇⠀⠈⡄⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠠⠁⠂⣿⣒⢌⡱⢌⣷⣿⠈⠄⡁⢿⣽⠂⠈⠳⣤⠀⠀⠀
⠀⠀⠀⣿⡄⠀⠀⠈⠤⠀⠀⠀⠀⠀⠀⠀⠀⡆⠁⠌⢰⣿⠥⣊⠔⡢⢺⣿⡌⠐⡀⣿⣾⠀⠀⠀⠈⢳⣤⡀`;

const LOGO_LINES = String.raw` _      _____ _   _' ____
| |    | ____| \ | | / ___|
| |    |  _| |  \| | \___ \
| |___ | |___| |\  |  ___) |
|_____||_____|_| \_| |____/
 _____ ___   ___  _     _  _____
|_   _/ _ \ / _ \| |   | |/ /_ _|
  | || | | | | | | |   | ' / | |
  | || |_| | |_| | |___| . \ | |
  |_| \___/ \___/|_____|_|\_\___|`.split('\n').concat(
  '',
  `\x1b[0m\x1b[1mLen's Toolkit v${VERSION}\x1b[0m`,
  '\x1b[2mSpecify, approve, implement, verify, commit\x1b[0m'
);

function getBanner() {
  const leftLines = ASCII_ART_LEFT.trim().split(/\r?\n/).map((l) => l.replace(/\r$/, ''));
  return `\n${leftLines.join('\n')}\n\n\x1b[1m\x1b[36m${LOGO_LINES.join('\n')}\x1b[0m\n`;
}

function printBanner() {
  console.log(getBanner());
}

function printHelp() {
  printBanner();
  console.log(`
\x1b[1mUSAGE:\x1b[0m
  npx len-toolkit [command] [options]

\x1b[1mCOMMANDS:\x1b[0m
  start                    Prepare local GPT/Antigravity workflow safely (recommended)
  init                     Initialize vibe coding environment in current project (default)
  plan [name]              Generate a phased IMPLEMENTATION_PLAN.md file
  skills                   Install only the skills library (.agents/skills/)
  rules                    Install only the agent rules (GEMINI.md, AGENTS.md, .cursorrules)

\x1b[1mOPTIONS:\x1b[0m
  -y, --yes                Skip interactive prompts and install all components
  -g, --global             Install skills globally to ~/.gemini/config/skills/
  -f, --force              Overwrite existing files
  -h, --help               Show this help message
  -v, --version            Display current version

\x1b[1mSKILLS INCLUDED:\x1b[0m
  spec                    Product discovery and organized feature specifications
  🏛️  council               Multi-perspective ideation & debate (Devil, Simplicity, Security, DX)
  📋 implementation-plan   Approved execution with checks, phase commits & bounded retries
  ✂️  ponytail (suite)      Anti-bloat ladder, ponytail-audit, ponytail-debt, ponytail-review
`);
}

async function askQuestion(rl, query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function runInteractive(targetDir, flags) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let completed = false;
  rl.on('close', () => {
    if (!completed) {
      console.log('\n\nSetup cancelled.');
      process.exit(0);
    }
  });

  printBanner();
  console.log(`Target directory: \x1b[33m${targetDir}\x1b[0m\n`);

  const installAll = await askQuestion(rl, 'Initialize full toolkit (Skills + Rules + Dev configs)? [Y/n]: ');
  const shouldInstallAll = installAll.trim().toLowerCase() !== 'n';

  let doSkills = shouldInstallAll;
  let doRules = shouldInstallAll;
  let doConfigs = shouldInstallAll;

  if (!shouldInstallAll) {
    const ansSkills = await askQuestion(rl, 'Install Skills library (council, implementation-plan, ponytail)? [Y/n]: ');
    doSkills = ansSkills.trim().toLowerCase() !== 'n';

    const ansRules = await askQuestion(rl, 'Install Agent Rules (GEMINI.md, AGENTS.md)? [Y/n]: ');
    doRules = ansRules.trim().toLowerCase() !== 'n';

    const ansConfigs = await askQuestion(rl, 'Install Dev Configs (.editorconfig, .gitignore)? [Y/n]: ');
    doConfigs = ansConfigs.trim().toLowerCase() !== 'n';
  }

  const globalOpt = await askQuestion(rl, 'Also install skills globally to ~/.gemini/config/skills/? [y/N]: ');
  const doGlobal = globalOpt.trim().toLowerCase() === 'y';

  completed = true;
  rl.close();

  console.log('\n\x1b[32mApplying configuration...\x1b[0m');

  if (doSkills) {
    const dest = installSkills(targetDir, false, flags.force);
    console.log(`  ✓ Installed skills to ${dest}`);
  }

  if (doGlobal) {
    const globalDest = installSkills(targetDir, true, flags.force);
    console.log(`  ✓ Installed global skills to ${globalDest}`);
  }

  if (doRules) {
    const rules = installRules(targetDir, flags.force);
    console.log(`  ✓ Installed agent rules: ${rules.join(', ')}`);
  }

  if (doConfigs) {
    const configs = installConfigs(targetDir, flags.force);
    console.log(`  ✓ Installed dev configs: ${configs.join(', ')}`);
  }

  console.log(`
\x1b[32m🎉 Toolkit setup complete!\x1b[0m
Your environment is now primed with:
  • \x1b[36m/council\x1b[0m               for stress-testing architecture and ideation
  • \x1b[36m/plan\x1b[0m                  for phased IMPLEMENTATION_PLAN.md with test gates & commits
  • \x1b[36m/ponytail\x1b[0m              for minimal, zero-bloat standard-library execution
`);
}

async function main() {
  const args = process.argv.slice(2);
  const targetDir = process.cwd();

  const flags = {
    yes: args.includes('-y') || args.includes('--yes'),
    global: args.includes('-g') || args.includes('--global'),
    force: args.includes('-f') || args.includes('--force'),
    help: args.includes('-h') || args.includes('--help'),
    version: args.includes('-v') || args.includes('--version'),
  };

  if (flags.help) {
    printHelp();
    return;
  }

  if (flags.version) {
    console.log(`len-toolkit v${VERSION}`);
    return;
  }

  const command = args[0] && !args[0].startsWith('-') ? args[0] : 'init';

  if (command === 'start') {
    if (args.slice(1).some((arg) => !['-y', '--yes'].includes(arg))) {
      throw new Error('start is local and preserves existing files. Use: len-toolkit start (optionally --yes).');
    }
    printBanner();
    const result = startWorkspace(targetDir);
    console.log(`${result.initialized ? 'Initialized' : 'Using'} Git repository: ${result.repository}`);
    console.log(`Branch: ${result.branch}`);
    console.log(`Installed ${result.installed.length} missing files.`);
    for (const difference of result.differences) {
      console.log(`REVIEW: ${difference.path} differs; preserved. Proposed version: ${difference.proposed}`);
    }
    for (const warning of result.identityWarnings) console.log(`COMMIT CHECK: ${warning}`);
    console.log(`Working tree (preserve unrelated edits):\n${result.changes || '(clean)'}`);
    for (const doc of result.documents) {
      console.log(`DOCUMENT REVIEW: ${doc.path}: ${doc.exists ? 'present; agent must verify currency and approval' : 'missing; inventory existing specs before creating it'}`);
    }
    console.log('Setup check complete. This does not approve implementation or verify Antigravity discovery.');
    console.log('Review differences and specs with GPT, then launch agi and point it to the approved HANDOFF.md.');
    return;
  }

  if (command === 'plan') {
    const featureName = args.slice(1).find((arg) => !arg.startsWith('-')) || 'New Feature';
    const result = createPlanTemplate(targetDir, featureName, flags.force);
    if (result.created) {
      console.log(`\x1b[32m✓ Created ${result.path}\x1b[0m`);
    } else {
      console.log(`\x1b[33m! ${result.path} already exists. Left untouched.\x1b[0m`);
    }
    return;
  }

  if (command === 'skills') {
    const dest = installSkills(targetDir, flags.global, flags.force);
    console.log(`\x1b[32m✓ Installed skills to ${dest}\x1b[0m`);
    return;
  }

  if (command === 'rules') {
    const rules = installRules(targetDir, flags.force);
    console.log(`\x1b[32m✓ Installed agent rules: ${rules.join(', ')}\x1b[0m`);
    return;
  }

  if (flags.yes) {
    printBanner();
    console.log(`Target: \x1b[33m${targetDir}\x1b[0m`);
    const dest = installSkills(targetDir, flags.global, flags.force);
    console.log(`  ✓ Installed skills to ${dest}`);
    const rules = installRules(targetDir, flags.force);
    console.log(`  ✓ Installed agent rules: ${rules.join(', ')}`);
    const configs = installConfigs(targetDir, flags.force);
    console.log(`  ✓ Installed dev configs: ${configs.join(', ')}`);
    console.log('\n\x1b[32m✓ Vibe coding environment initialized successfully!\x1b[0m');
    return;
  }

  await runInteractive(targetDir, flags);
}

main().catch((err) => {
  console.error('\x1b[31mError running len-toolkit:\x1b[0m', err.message);
  process.exit(1);
});
