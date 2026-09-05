# Len's Toolkit product overview

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:19:52+08:00
Revision: 1
Status: Approved by Len in chat (revision 1)

## Purpose

Make Len's personal GPT-to-Antigravity workflow repeatable without forgotten initialization, duplicate specs, mixed planning documents, or unsupported claims.
Len usually builds Flutter Android apps, sometimes websites, and sometimes systems involving hardware and field deployments.
GPT develops requirements and architecture with Len; Len approves them in chat; Gemini implements approved work through Antigravity CLI, which Len launches as `agi` in WezTerm.

## Product workflow

1. Run `npx len-toolkit start` in the project before the coding session.
2. GPT explores the entire product with Len using focused questions and clearly labeled sensible defaults.
3. GPT records all planned features, main flows, shared data, system boundaries, architecture, and major constraints.
4. Len approves the product baseline and architecture in chat.
5. GPT details a feature's behavior and acceptance criteria, then creates its implementation plan.
6. Len approves the feature spec and plan in chat.
7. GPT prepares the single current `HANDOFF.md`; Len launches `agi` and directs Gemini to it.
8. Gemini implements, verifies, records evidence, and commits each phase, continuing through the approved plan without routine approval stops.
9. Gemini updates the handoff on completion, interruption, or a blocker.

## Success criteria

- A fresh project can be prepared with one npm-compatible terminal command.
- Repeating startup preserves custom instructions and project content.
- Each feature has one current spec with testable requirements and an identifiable approval revision.
- Implementation tasks live in plans rather than product or feature specs.
- A receiving agent can identify scope, approvals, progress, actual evidence, and the next action from the current handoff and linked documents.
- A completed phase has passing required checks and a successful local commit.
- Unsupported hardware, field, or real-device claims remain explicitly unverified.

## Scope boundaries

This iteration changes Len's Toolkit only.
It does not reorganize AqOne, Warang, or BantAI, publish an npm release, push commits, launch an agent, or install a Flutter application.
Framework, state-management, storage, and UI architecture are selected per project.
The illustrative Flutter example is documentation, not a working or validated application.
