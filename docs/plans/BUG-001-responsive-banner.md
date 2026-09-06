# Implementation Plan: Responsive Startup Banner

> **Status:** Phase 1 complete
> **Target Branch:** `master`
> **Test Command:** `npm test`
> **Lint/Check Command:** `node --check bin/cli.js`

---

## Overview

The startup banner currently combines a tall 48-column Unicode portrait with a logo into lines up to 98 JavaScript characters wide.
The terminal can display Unicode glyphs wider than their JavaScript string length, so the composition wraps and appears fragmented in ordinary windows.
The fix will use the terminal's native column count to choose between a wide composition and a compact, readable wordmark.

## Phase 1: Reproduce and define the boundary

**Goal:** Confirm the failure through the real CLI and define measurable output requirements.

### Tasks

- [x] Run `node bin/cli.js --help` through the user-facing CLI path.
- [x] Confirm that the banner emits a tall 38-row portrait and combined lines that wrap in the reported screenshots.
- [x] Trace every `printBanner` caller before changing shared rendering.

### Verification Gate

- [x] Record the current maximum JavaScript line length and terminal width.
- [x] Confirm existing banner-related integration coverage.

### Review Gate (Ponytail)

- [x] Add no dependency or display-width abstraction.
- [x] Reuse `process.stdout.columns` as the native width signal.

### Git Checkpoint

Commit this plan as `docs(plan): reproduce responsive banner bug`.

### Hard Stop

Pause after the phase checkpoint and obtain confirmation before implementation.

## Phase 2: Implement responsive rendering

**Goal:** Make the banner legible without wrapping on standard terminal widths.

### Tasks

- [ ] Improve the wordmark while keeping it plain ASCII.
- [ ] Select the wide or compact layout from the output width.
- [ ] Preserve plain-text version and workflow labels.
- [ ] Add one focused regression check for narrow output.

### Verification Gate

- [ ] Run `npm test`.
- [ ] Run `node --check bin/cli.js`.

### Review Gate (Ponytail)

- [ ] Confirm the shortest working diff and no new package.

### Git Checkpoint

Commit the explicit banner and test paths as `fix(cli): make startup banner responsive`.

### Hard Stop

Pause after the phase checkpoint and obtain confirmation before visual verification.

## Phase 3: Verify the terminal experience

**Goal:** Verify the corrected banner through the real CLI at representative widths.

### Tasks

- [ ] Exercise the help and startup paths at narrow and wide widths.
- [ ] Inspect alignment, readability, color reset, and surrounding help output.
- [ ] Record final evidence without changing generated release notes.

### Verification Gate

- [ ] Run the full test suite and syntax check again.
- [ ] Confirm no rendered line exceeds the simulated terminal width.

### Review Gate (Ponytail)

- [ ] Confirm no unrelated changes are staged.

### Git Checkpoint

Commit any required evidence update as `test(cli): verify responsive banner output`.

### Hard Stop

Report the final verified result.
