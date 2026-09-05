# Len's Toolkit constraints

Created: 2026-09-05T15:06:25+08:00
Updated: 2026-09-05T15:19:52+08:00
Revision: 1
Status: Approved by Len in chat (revision 1)

## Personal workflow

- Design for Len, GPT reasoning, and Gemini execution through Antigravity CLI.
- Explore the whole product before detailing individual features.
- Ask focused question rounds and propose labeled defaults instead of inventing requirements.
- Obtain Len's chat approval for the baseline and architecture, then each feature spec and implementation plan.
- Continue automatically through approved phases after passing checks and committing each phase.
- Do not make framework or Flutter library choices universal across projects.

## Implementation boundaries

- Use the standard library and existing code before adding custom machinery.
- Add no dependency without Len's authorization.
- Preserve custom instructions, unrelated edits, existing features, and existing tests.
- Do not automatically stage all files, overwrite existing documents, push, reset, or discard work.
- Required check failure or commit failure leaves the phase incomplete.
- Investigate failures within the approved design and allow at most three unsuccessful fix-and-check attempts for the same unresolved problem.
- An initial observed failure is the baseline; each attempted correction followed by its check consumes one attempt.
- Persist the attempt count across sessions and do not reset it by renaming the problem.
- Stop affected work immediately when it needs a user decision, missing access or hardware, a scope change, or an architecture change.
- After exhausting attempts, report the problem, evidence, attempted fixes, remaining edits, and the decision or access needed.
- Preserve interrupted or failing work uncommitted and update the current handoff.

## Evidence and communication

- Never claim an unrun check passed or that implementation alone demonstrates effectiveness.
- Report emulator checks as emulator checks; Len performs physical-device validation.
- Keep hardware-bench and intended-environment field validation separate.
- Record requirement, check or scenario, actual result, timestamp, conditions, and limitations.
- Include screenshots for meaningful UI verification when the environment supports capture.
- Keep unvalidated performance, accuracy, safety, or deployment outcomes explicitly unverified.
- Do not include credentials or secrets in handoffs, specifications, examples, or evidence.
- Use plain dashes, no em dashes, and one full sentence per line when writing long Markdown.
- Do not manually modify `CHANGELOG.md` or generated files.
- Do not add an agent co-author to commits.
