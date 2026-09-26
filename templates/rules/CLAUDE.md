@AGENTS.md

# Len's Claude Code entry point

The import above loads the shared workflow policy from the project-root `AGENTS.md`.
Where that policy names Gemini as the implementing agent, the same role, limits, and approval rules apply to Claude Code.
Read `docs/SPEC_INDEX.md`, root `HANDOFF.md`, and every approved document it links before implementing.
Project skills live in `.claude/skills/` and load automatically; they mirror `.agents/skills/`, which other agents use.
Reusable document templates stay in `.agents/templates/docs/`.
Execute only the approved handoff and use the shared phase, recovery, and evidence rules.
