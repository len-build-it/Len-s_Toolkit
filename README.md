# Foreword

Day by day AI keeps improving especially in the coding sector, I believe instead of hating it we should learn how to harness it.
Believe me that I'd rather learn from "scratch" and the "basics" but this is the world we live in.
Billions are invested in this sector and it will only keep on progressing no matter how much you hate it and as a software engineer it is essential for us to learn it in order to survive in this field.
And if you disagree with me, well you can **** off.

## Len's Toolkit

![Len's Toolkit](assets/ChatGPT%20Image%20Sep%2020,%202026,%2009_45_22%20PM.png)

[![npm version](https://img.shields.io/npm/v/@lenardangeloolajay/len-toolkit.svg)](https://www.npmjs.com/package/@lenardangeloolajay/len-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> [!NOTE]
> **Collection Disclaimer and Attribution:**
> This repository is strictly a curated collection of tools, skills, and engineering rulesets sourced from experienced engineers across the software industry.
> I am not the author of these files, and I do not claim 100% ownership over them.
> I gathered and adapted these tools from other people to build a streamlined AI coding workflow, and I credit them fully for their work.

This repository contains my personal guidelines, rulesets, and skills for AI pair programming.
Feel free to copy whatever you want and create PRs!
Technically this is a disciplined ruleset designed to help build solid, high quality code instead of unverified slop.

A personal, dependency-free toolkit for Len's GPT-to-Antigravity workflow.
GPT explores the product and defines architecture with Len.
Len approves the specs and plan.
Gemini or Claude Code implements approved phases with checks and local commits.

## Start a project session

Run this from any project directory to initialize the toolkit:

```powershell
npx @lenardangeloolajay/len-toolkit start
```

## Update an existing project

Run this from your project directory to refresh installed skills and document templates to the latest version:

```powershell
npx @lenardangeloolajay/len-toolkit update
```

Options:
- `npx @lenardangeloolajay/len-toolkit update --force`: Also replaces toolkit skills you edited locally and refreshes root agent rules (`GEMINI.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`) with the latest defaults.
- `npx @lenardangeloolajay/len-toolkit update --adopt`: Takes over same-named skills installed by len-toolkit 1.2.0 or earlier, before ownership was recorded.
- `npx @lenardangeloolajay/len-toolkit update --global`: Refreshes skills in your global agent directories (`~/.gemini/config/skills/` and `~/.claude/skills/`).

## Local offline development

Alternatively, to run directly from a local checkout without using the npm registry, substitute its absolute path:

```powershell
npm exec --offline --package="C:\path\to\Len's_Toolkit" -- len-toolkit start
```

The local-package form was exercised with npm in a temporary project on Windows.
It does not require a global install.
Then launch your usual Antigravity CLI or Claude Code:

```powershell
agi
claude
```

Tell the receiving agent: "Read project AGENTS.md and HANDOFF.md, follow their approved references, and execute the approved plan."
If the project has no approved handoff yet, work with GPT on the specs first.
Automatic Antigravity instruction discovery has not been verified here; explicitly point it to the files.

## Claude Code support

Startup installs a root `CLAUDE.md` whose first line, `@AGENTS.md`, imports the shared workflow policy.
Claude Code loads `CLAUDE.md` automatically at session start, so no manual pointing is needed for the policy itself.
The import works on every Claude Code version and never loads `AGENTS.md` twice, even on versions that also read `AGENTS.md` directly.
`CLAUDE.md` also assigns Claude Code the implementing role that `AGENTS.md` describes for Gemini.
All 24 skills are mirrored into `.claude/skills/`, the only project directory Claude Code discovers skills from.
The `.agents/skills/` copy stays for other agents, and `update` refreshes both copies together.
The sample `.gitignore` excludes personal `CLAUDE.local.md` and `.claude/settings.local.json` files.
Discovery was verified with Claude Code 2.1.283 on Windows in a fresh project prepared by `start`.
If the project already has its own `CLAUDE.md` without an `@AGENTS.md` import, Claude Code does not read `AGENTS.md`; `start` says so and shows the line to add, but never edits your file.

## Existing repositories with their own skills

The toolkit records the skills it installs in a `.len-toolkit.json` file in each skills directory, with a fingerprint of every file.
Commit it with the skills so teammates get the same update behavior.
Fingerprints ignore CRLF and LF differences, so Git line-ending conversion does not count as an edit.

- Skills the toolkit does not ship are never changed or removed.
- A project skill that shares a name with a toolkit skill is kept as is, and the toolkit copy is not installed beside it; output lists it as `PROJECT SKILL`.
- A toolkit skill you edited is kept by `start` and `update` and listed as `LOCAL EDITS`; `update --force` replaces it.
- A toolkit skill retired in a newer release is removed by `update` only if you never edited it; an edited one stays as a project skill.
- A project installed by len-toolkit 1.2.0 or earlier has no record yet: copies identical to the current release are recorded automatically, and older copies are reported until you run `update --adopt`.
- No command writes through a symlink or junction inside the project, and a record naming paths outside its directory is rejected.

## What startup does

- Initializes Git only when there is no enclosing repository, reporting the branch and existing edits.
- Installs missing personal rules, 24 skills for both `.agents/skills/` and `.claude/skills/`, reusable document templates, and basic development configs.
- Reports project skills it kept, toolkit skills with local edits, and toolkit skills with updates available.
- Preserves existing files and reports differences with paths to the proposed versions.
- Checks whether Git can resolve author and committer identity without changing your configuration.
- Reports whether the index, handoff, and root plan exist, leaving content and approval review to the agent.

Startup does not approve work, create a second spec tree, launch an agent, stage files, commit, or push.
It refuses `--force` and `--global`; use the legacy commands only when their broader behavior is intended.
A successful exit means setup checks finished, not that differences are resolved or the project is approved for implementation.
A failed setup may have created a repository or installed some missing files before the error; address the reported issue and rerun safely.
Existing custom instructions require review, not an automatic overwrite disguised as an upgrade.

## What update does

- Refreshes the toolkit's own skills in `.agents/skills/` and `.claude/skills/` to the latest versions, keeping local edits and project skills.
- Updates reusable document templates in `.agents/templates/docs/`.
- Preserves project-specific rules (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`), specs, and Git configuration by default.
- Adding `--force` (`-f`) also replaces locally edited toolkit skills and updates root agent rules to the latest templates.
- Adding `--adopt` takes over same-named skills left by len-toolkit 1.2.0 or earlier.
- Adding `--global` (`-g`) updates skills in `~/.gemini/config/skills/` and `~/.claude/skills/`.

## The personal workflow

1. Explore the whole product with GPT in focused question rounds, including proposed defaults and unresolved requirements.
2. Settle planned features, main user flows, shared data, boundaries, architecture, and major constraints.
3. Approve the product baseline and architecture in chat.
4. Detail one feature's observable requirements, then its implementation plan; approve both in chat.
5. Maintain one current handoff with exact approved revisions, allowed phases, progress, checks, attempts, and next action.
6. Gemini implements each approved phase, verifies it, updates the records, reviews the staged diff, and commits only related changes.
7. Gemini continues automatically until the last approved phase or a real blocker.

A phase is complete only after passing required checks and a successful commit.
Interrupted or failing work remains uncommitted.
For the same unresolved problem, Gemini gets three unsuccessful fix-and-check attempts after the initial observed failure, then reports a blocker without resetting the count on resume.
Missing decisions, unavailable access or hardware, and necessary architecture changes block affected work immediately.
Gemini can report a disagreement but cannot silently replace approved architecture or add features.
Len's approval applies to specific revisions, not future substantive changes.

## Documents that stay organized

```text
project/
  AGENTS.md                         Shared personal workflow
  GEMINI.md                         Gemini entry point
  CLAUDE.md                         Claude Code entry point, imports AGENTS.md
  HANDOFF.md                        One current handoff
  IMPLEMENTATION_PLAN.md            Optional pointer to the active plan
  .agents/
    skills/                         Spec, Council, plan, and Ponytail suite
    templates/docs/                 Reusable templates, not active specs
  .claude/
    skills/                         Same skills, discovered by Claude Code
  docs/
    SPEC_INDEX.md                   Current documents, revisions, and status
    product/
      OVERVIEW.md
      ARCHITECTURE.md
      DATA_MODEL.md
      CONSTRAINTS.md
    features/FEAT-001-name.md        Behavior and acceptance criteria
    plans/FEAT-001-implementation.md Tasks, checks, and phase progress
    evidence/FEAT-001-verification.md
    archive/                        Superseded documents with replacement links
```

Create categories only when needed and adopt an existing project convention rather than duplicating it.
Search the index and current specs before creating a file.
Refinements update the existing feature spec; superseded documents move to the archive with replacement links and updated references.
Active filenames are stable, while creation and substantive-update timestamps inside documents use ISO 8601 with `+08:00`.
Requirements have stable IDs, and plans and evidence reference them.
Specs describe behavior; plans contain task checkboxes and commands.

Use [the fictional Flutter handoff](templates/examples/flutter-handoff/docs/SPEC_INDEX.md) to inspect a complete example.
Its approvals, implementation, and verification are deliberately pending.
[Inspection exercises](templates/examples/flutter-handoff/EXERCISES.md) cover reuse, supersession, interruption, retries, and evidence boundaries.
No fictional project has been tested on an emulator or device.

## Skills and templates

Len's Toolkit includes 24 curated skills across core workflow, security, and software engineering book principles:

### Core Workflow and Optimization Skills

- `spec`: product discovery, organized requirements, document reuse, and revision approval.
- `council`: consequential architecture trade-offs and failure modes before approval.
- `implementation-plan`: approved phases, verification, commits, and recovery.
- `ponytail`: reuse, standard-library-first implementation, and minimal necessary code.
- `ponytail-review` and `ponytail-audit`: complexity findings without automatic fixes.
- `ponytail-debt`: recorded deliberate shortcuts.
- `ponytail-gain`: attributable evidence only; no unsupported savings figures.
- `ponytail-help`: the Ponytail reference card.
- `security-audit`: security guidance, vulnerability review, and structured audit harness.

### Software Engineering Book Skills

Distilled rules from classic software engineering literature, adapted from [Maciej Ciemborowicz's agent-rules-books](https://github.com/ciembor/agent-rules-books):

- `a-philosophy-of-software-design`: complexity reduction and deep module boundaries (John Ousterhout).
- `clean-architecture`: separation of business policy from frameworks and details (Robert C. Martin).
- `clean-code`: readability, naming, small functions, and clean code hygiene (Robert C. Martin).
- `code-complete`: software construction, routine design, and defensive programming (Steve McConnell).
- `designing-data-intensive-applications`: reliability, scalability, and consistency in data systems (Martin Kleppmann).
- `domain-driven-design`: domain modeling, bounded contexts, and ubiquitous language (Eric Evans).
- `domain-driven-design-distilled`: lightweight domain modeling and subdomains (Vaughn Vernon).
- `implementing-domain-driven-design`: tactical DDD patterns, aggregates, and domain events (Vaughn Vernon).
- `patterns-of-enterprise-application-architecture`: enterprise layers, repositories, and mappers (Martin Fowler).
- `refactoring`: systematic code refactoring and mechanics (Martin Fowler).
- `refactoring-guru`: code smell diagnosis and refactoring technique catalogs (Refactoring.Guru).
- `release-it`: production stability, circuit breakers, and resilience (Michael T. Nygard).
- `the-pragmatic-programmer`: pragmatic judgment, orthogonality, and DRY principles (David Thomas and Andrew Hunt).
- `working-effectively-with-legacy-code`: safely modifying legacy systems with characterization tests and seams (Michael Feathers).

The shared policy lives in [the AGENTS template](templates/rules/AGENTS.md).
The [plan template](templates/docs/IMPLEMENTATION_PLAN.md) is used by both CLI plan generation and agent guidance.
Templates contain unresolved fields until the agent inspects the actual project; they are not ready-to-execute commands.

## Evidence, not promises

Record the requirement, actual command or scenario, environment, result, timestamp, and limitations.
Attach meaningful UI screenshots when available.
Emulator results establish emulator behavior only; Len performs physical-device checks.
Keep hardware-bench and field validation separate, with unrun checks explicitly pending.
Implementation, simulation, or an attractive spec does not prove effectiveness in the intended environment.

## Available CLI commands

```powershell
# Core commands
npx @lenardangeloolajay/len-toolkit start                # Safe workspace setup
npx @lenardangeloolajay/len-toolkit update               # Update skills & templates to latest

# Selective installation & templates
npx @lenardangeloolajay/len-toolkit skills               # Install only the skills library
npx @lenardangeloolajay/len-toolkit rules                # Install only the agent rules
npx @lenardangeloolajay/len-toolkit plan "Feature name"  # Generate IMPLEMENTATION_PLAN.md

# Flags and utilities
npx @lenardangeloolajay/len-toolkit update --force       # Also replace edited toolkit skills and rules
npx @lenardangeloolajay/len-toolkit update --adopt       # Take over skills from len-toolkit 1.2.0 or earlier
npx @lenardangeloolajay/len-toolkit update --global      # Update global skills (~/.gemini/config/skills/, ~/.claude/skills/)
npx @lenardangeloolajay/len-toolkit --yes                # Non-interactive full install
npx @lenardangeloolajay/len-toolkit --help               # Show CLI usage and options
npx @lenardangeloolajay/len-toolkit --version            # Show installed version
```

The `update` command keeps your project skills and templates synchronized with new releases.
The legacy default remains an interactive installer.
Local skill installation also supplies document templates.
The legacy global skill destinations remain `~/.gemini/config/skills/` and `~/.claude/skills/`; they are not the recommended personal setup and do not replace local startup.
The `plan` command writes a draft root `IMPLEMENTATION_PLAN.md` and preserves an existing file by default.
For categorized feature plans, use the spec/plan workflow and a root pointer instead of generating a second active plan.
Legacy `--force` overwrites existing selected files, including `.gitignore` and a root plan; it is never used by `start`.
For skills, `--force` replaces only toolkit-owned skills; project skills are never overwritten.
Cursor-related compatibility files remain available but are not installed by personal startup.

## Local verification

The package advertises Node 18 or newer and uses no npm dependencies.
This change was exercised on Windows with Node 24.14.0; other supported runtime versions remain unverified here.

```powershell
npm test
node --check bin/cli.js
node --check src/installer.js
npm pack --dry-run --ignore-scripts
```

The automated suite exercises file preservation, CLI behavior, startup failure cases, enclosing repositories, and shared plan rendering.
Workflow exercises are instruction inspections, not proof that Gemini will always comply.
Publishing or pushing remains a separate explicit action.

## License and attribution

[MIT](LICENSE).

This repository is strictly a curated collection of tools and guidelines.
I am not the author of these files, and I do not claim 100% ownership over them.
I gathered these tools from other experienced engineers and credit them fully for their contributions:

- Ponytail derives from [Dietrich Gebert's Ponytail](https://github.com/DietrichGebert/ponytail).
- Council is inspired by [hex/claude-council](https://github.com/hex/claude-council).
- Security audit skill derives from [Cloudflare's security-audit-skill](https://github.com/cloudflare/security-audit-skill).
- Software engineering book skills derive from [Maciej Ciemborowicz's agent-rules-books](https://github.com/ciembor/agent-rules-books).
- Book summaries and architectural patterns are based on the published works of John Ousterhout, Robert C. Martin, Steve McConnell, Martin Kleppmann, Eric Evans, Vaughn Vernon, Martin Fowler, Michael T. Nygard, David Thomas, Andrew Hunt, Michael Feathers, and the authors of Refactoring.Guru.
All upstream authors retain copyright to their respective original works.
