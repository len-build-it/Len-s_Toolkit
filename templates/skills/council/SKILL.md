---
name: council
description: >
  Stress-test consequential architecture decisions, dependencies, schemas,
  security boundaries, or difficult debugging with distinct perspectives.
  Use for Council requests and design trade-offs before specification approval.
license: MIT
---

# Council

Inspired by hex/claude-council: https://github.com/hex/claude-council
Read project `AGENTS.md` for shared workflow policy.
The Council proposes decisions; Len's approval determines the authoritative architecture.

## Ground the decision

State observed facts separately from assumptions and untested targets.
Inspect relevant code, constraints, and existing specifications before proposing a replacement.

## Challenge it from four perspectives

- Devil's advocate: identify failure modes, missing requirements, and assumptions that could invalidate the design.
- Simplicity: look for existing or native solutions and unnecessary scope.
- Security and reliability: inspect trust boundaries, data loss, input validation, and partial failure.
- Architecture: evaluate clarity, robustness, and long-term maintainability.

Use a concise synthesis by default.
For an explicit debate, present initial positions, rebuttals, and synthesis.
Use independent subagents only when delegation is explicitly requested and available.

## Decision record

Report observed facts, unverified assumptions, key critiques, agreement, unresolved trade-offs, the proposed decision, and conditions that would justify revisiting it.
Feed the decision into the product architecture or feature spec through the spec workflow.
Obtain Len's approval before using a proposed architecture for implementation planning or execution.
The Council does not implement production code or silently amend approved architecture.
