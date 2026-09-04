# Agent Guidelines (AGENTS.md)

Universal operating manual for any autonomous agent working in this workspace.

## Core Directives
1. **Zero Bloat (Ponytail):** Enforce YAGNI and standard-library-first on all code changes. Do not introduce new dependencies without asking.
2. **Debate Before Building (Council):** Surface trade-offs, security implications, and failure modes during ideation.
3. **Phased Execution:** Maintain and follow `IMPLEMENTATION_PLAN.md` with tests, reviews, git commits per phase, and mandatory hard stops.
4. **Preserve Integrity:** Never break existing tests or overwrite working features without explicit permission.

## Guidelines
- Never use the em dash "—".
  Use plain dash "-" instead.
- When writing commit messages, NEVER auto-add your agent name as co-author.
- Never manually modify CHANGELOG.md files or any files that are marked as auto-generated.
- When writing or substantially editing long Markdown files, put each full sentence on its own line.
  Preserve normal Markdown structure, but avoid wrapping multiple sentences onto one physical line.
- When making technical decisions, do not give much weight to development cost.
  Instead, prefer quality, simplicity, robustness, scalability, and long term maintainability.
- When doing bug fixes, always start with reproducing the bug in an E2E setting as closely aligned with how an end user would use it.
  This makes sure you find the real problem so your fix will actually solve it.
- When end-to-end testing a product, be picky about the UI you see and be obsessed with pixel perfection.
  If something clearly looks off, even if it is not directly related to what you are doing, try to get it fixed along.
- Apply that same high standard to engineering excellence: lint, test failures, and test flakiness.
  If you see one, even if it is not caused by what you are working on right now, still get it fixed.

