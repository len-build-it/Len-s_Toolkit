

This is my general guidelines for my AI workflow. 
Feel free to copy whatever you want and create PRs!
and yes this is technically just some ruleset so you could create a good looking slop.

# Len's Toolkit

![Len's Toolkit](assests/slop.jpg)

A personal, dependency-free toolkit for Len's GPT-to-Antigravity workflow.
GPT explores the product and defines architecture with Len; Len approves the specs and plan; Gemini implements approved phases with checks and local commits.

## Start a project session

Run this from the project directory once this revision has been published:

```powershell
npx len-toolkit start
```

This checkout has not been published by this change.
To use the current local checkout from any project now, substitute its absolute path in this one-command equivalent:

```powershell
npm exec --offline --package="C:\path\to\Len's_Toolkit" -- len-toolkit start
```

The local-package form was exercised with npm in a temporary project on Windows.
It does not require a global install.
Then launch your usual Antigravity CLI:

```powershell
agi
```

Tell the receiving agent: "Read project AGENTS.md and HANDOFF.md, follow their approved references, and execute the approved plan."
If the project has no approved handoff yet, work with GPT on the specs first.
Automatic Antigravity instruction discovery has not been verified here; explicitly point it to the files.

## What startup does

- Initializes Git only when there is no enclosing repository, reporting the branch and existing edits.
- Installs missing personal rules, nine skills, reusable document templates, and basic development configs.
- Preserves existing files and reports differences with paths to the proposed versions.
- Checks whether Git can resolve author and committer identity without changing your configuration.
- Reports whether the index, handoff, and root plan exist, leaving content and approval review to the agent.

Startup does not approve work, create a second spec tree, launch an agent, stage files, commit, or push.
It refuses `--force` and `--global`; use the legacy commands only when their broader behavior is intended.
A successful exit means setup checks finished, not that differences are resolved or the project is approved for implementation.
A failed setup may have created a repository or installed some missing files before the error; address the reported issue and rerun safely.
Existing custom instructions require review, not an automatic overwrite disguised as an upgrade.

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
  HANDOFF.md                        One current handoff
  IMPLEMENTATION_PLAN.md            Optional pointer to the active plan
  .agents/
    skills/                         Spec, Council, plan, and Ponytail suite
    templates/docs/                 Reusable templates, not active specs
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

- `spec`: product discovery, organized requirements, document reuse, and revision approval.
- `council`: consequential architecture trade-offs and failure modes before approval.
- `implementation-plan`: approved phases, verification, commits, and recovery.
- `ponytail`: reuse, standard-library-first implementation, and minimal necessary code.
- `ponytail-review` and `ponytail-audit`: complexity findings without automatic fixes.
- `ponytail-debt`: recorded deliberate shortcuts.
- `ponytail-gain`: attributable evidence only; no unsupported savings figures.
- `ponytail-help`: the Ponytail reference card.

The shared policy lives in [the AGENTS template](templates/rules/AGENTS.md).
The [plan template](templates/docs/IMPLEMENTATION_PLAN.md) is used by both CLI plan generation and agent guidance.
Templates contain unresolved fields until the agent inspects the actual project; they are not ready-to-execute commands.

## Evidence, not promises

Record the requirement, actual command or scenario, environment, result, timestamp, and limitations.
Attach meaningful UI screenshots when available.
Emulator results establish emulator behavior only; Len performs physical-device checks.
Keep hardware-bench and field validation separate, with unrun checks explicitly pending.
Implementation, simulation, or an attractive spec does not prove effectiveness in the intended environment.

## Compatibility commands

```powershell
npx len-toolkit --help
npx len-toolkit skills
npx len-toolkit rules
npx len-toolkit plan "Feature name"
npx len-toolkit --yes
npx len-toolkit skills --global
```

The legacy default remains an interactive installer.
Local skill installation also supplies document templates.
The legacy global skill destination remains `~/.gemini/config/skills/`; it is not the recommended personal setup and does not replace local startup.
The `plan` command writes a draft root `IMPLEMENTATION_PLAN.md` and preserves an existing file by default.
For categorized feature plans, use the spec/plan workflow and a root pointer instead of generating a second active plan.
Legacy `--force` overwrites existing selected files, including `.gitignore` and a root plan; it is never used by `start`.
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
Ponytail derives from [Dietrich Gebert's Ponytail](https://github.com/DietrichGebert/ponytail).
Council is inspired by [hex/claude-council](https://github.com/hex/claude-council).
