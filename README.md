# 🛠️ Len's Toolkit (`len-toolkit`)

> **Council Ideation • Phased Planning • Ponytail Anti-Bloat Execution**

A zero-dependency toolkit and CLI that primes any workspace for elite AI pair programming in a single command. Say goodbye to re-explaining your coding philosophy, manually setting up `.agents/` skills, or copying rule files between projects.

---

## 🚀 Quick Start

Run in **any** project directory (new or existing):

```bash
npx len-toolkit
```

### Non-Interactive / Instant Setup
```bash
npx len-toolkit --yes
```

### Install Skills Globally (Applies to all workspaces)
```bash
npx len-toolkit --global
```

---

## 🏛️ The Three Pillars

Len's Toolkit is built around a three-stage pair programming workflow:

```
[1. IDEATION]            →            [2. PLANNING]             →            [3. EXECUTION]
   /council                              /plan                                  /ponytail
Multi-perspective debate        Phased roadmap, test gates,             Standard library first,
& blind-spot detection          Ponytail reviews & git commits          zero bloat, minimal diffs
```

### 1. The Council (`/council`)
*Inspired by [hex/claude-council](https://github.com/hex/claude-council)*
* Convenes a multi-perspective advisory board before you write speculative code.
* **Roles:**
  * 😈 **Devil's Advocate (`devil`):** Identifies worst failure modes, unstated constraints, and scaling traps.
  * ✂️ **Simplicity Champion (`simplicity`):** Challenges whether the feature needs to exist at all (YAGNI).
  * 🛡️ **Security Auditor (`security`):** Reviews trust boundaries, input validation, and auth integrity.
  * 🛠️ **Architecture / DX (`architecture`):** Balances ergonomic clarity against 2 AM maintenance.
* Separates **OBSERVED** facts from **UNVERIFIED** assumptions to prevent unanimous blind spots.

### 2. Phased Implementation Planner (`/plan`)
* Generates an actionable, phased `IMPLEMENTATION_PLAN.md` with strict gates.
* **Non-Negotiable Gates for Every Phase:**
  1. `[ ]` Atomic task checklist.
  2. 🧪 **Verification Gate:** Required test & lint commands (`npm test`, etc.) must exit with code 0.
  3. 🔍 **Review Gate:** Ponytail check ensuring zero unrequested dependencies and minimal diffs.
  4. 📦 **Git Checkpoint:** Conventional git commit (e.g. `feat(auth): phase 1 - define session contracts`).
  5. 🛑 **HARD STOP:** The agent **must pause** and obtain user confirmation before touching the next phase.

### 3. Ponytail Anti-Bloat Suite (`/ponytail`)
*By [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)*
* Enforces the senior-dev ladder:
  ```
  1. Does this need to exist?   → YAGNI (skip it)
  2. Already in this codebase?  → Reuse it
  3. Stdlib does it?            → Use it
  4. Native platform feature?   → Use it (<input type="date">, CSS, DB constraint)
  5. Installed dependency?      → Use it
  6. One line?                  → One line
  7. Only then:                 → Minimum code that works
  ```
* **Included Skills:**
  * `ponytail` — Core anti-bloat ladder (`lite`, `full`, `ultra`).
  * `ponytail-review` — Diff review focused exclusively on cutting dead abstractions.
  * `ponytail-audit` — Repo-wide scan for bloat and over-engineering.
  * `ponytail-debt` — Ledger harvesting `# ponytail:` shortcut comments.
  * `ponytail-gain` — Measured impact scoreboard (~54% less code, ~20% cheaper, ~27% faster).
  * `ponytail-help` — Quick reference guide.

---

## 💻 CLI Commands & Options

```bash
# Interactive setup wizard
npx len-toolkit

# Directly create a phased IMPLEMENTATION_PLAN.md
npx len-toolkit plan "User Authentication"

# Install only the skills library into .agents/skills/
npx len-toolkit skills

# Install only agent rules (GEMINI.md, AGENTS.md, .cursorrules)
npx len-toolkit rules

# Skip prompts and apply all defaults
npx len-toolkit -y

# Install skills globally to ~/.gemini/config/skills/
npx len-toolkit -g

# Force overwrite existing configs
npx len-toolkit -f
```

> **Note:** `--force` (`-f`) overwrites all existing files including `.gitignore` and `IMPLEMENTATION_PLAN.md`.

---

## 📦 What Gets Installed

```text
your-project/
├── .agents/
│   ├── rules/
│   │   └── GEMINI.md            # Agent rules (Council + Plan + Ponytail)
│   └── skills/
│       ├── council/             # Ideation & stress-testing
│       ├── implementation-plan/ # Phased roadmaps with git checkpoints
│       ├── ponytail/            # The anti-bloat ladder
│       ├── ponytail-audit/      # Repo bloat scanner
│       ├── ponytail-debt/       # Shortcut ledger tracker
│       ├── ponytail-review/     # Diff over-engineering review
│       ├── ponytail-gain/       # Scoreboard
│       └── ponytail-help/       # Quick reference
├── GEMINI.md                    # Root instructions for Google Antigravity
├── AGENTS.md                    # Multi-agent standard instructions
├── .cursorrules                 # Cursor & Copilot guidelines
├── .editorconfig                # Clean whitespace & formatting
└── .gitignore                   # Standard ignore rules
```

---

## 🔧 Local Development & Publishing

### Test Locally on Your Machine
Inside this toolkit directory:
```bash
npm link
```
Now you can run `len-toolkit` anywhere in your terminal!

To unlink:
```bash
npm unlink -g len-toolkit
```

### Run Tests
```bash
npm test
```

### Publish to npm
```bash
npm publish --access public
```

Or run directly from a GitHub repository without publishing to npm:
```bash
npx github:yourusername/len-toolkit
```

---

## 📄 License & Attributions

Released under the [MIT License](LICENSE).

- **Ponytail:** MIT License © Dietrich Gebert ([DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail))
- **Claude Council concept:** Inspired by [hex/claude-council](https://github.com/hex/claude-council)
- **Len's Toolkit:** MIT License © 2026 Len
