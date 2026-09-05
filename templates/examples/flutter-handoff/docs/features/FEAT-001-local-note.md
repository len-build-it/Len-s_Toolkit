# FEAT-001: Create a local note

Created: 2026-09-05T15:29:25+08:00
Updated: 2026-09-05T15:29:25+08:00
Revision: 1
Status: Draft example

## Purpose and success

Capture a short note offline and find it when reopening the app.

## Scope and non-goals

Includes creation and newest-first listing.
Deletion, editing an existing note, search, and sharing are outside this feature.

## User flow

The empty list invites the user to enter a note.
Save validates the text, indicates a pending write, and adds the saved result to the list only after success.
An error leaves the draft visible with a retry action.

## Requirements

| ID | Behavior | Acceptance criterion |
| --- | --- | --- |
| REQ-001 | Validate text | Whitespace-only text and more than 200 Unicode scalar values show an error and create no record; valid trimmed text can be saved. |
| REQ-002 | Prevent duplicate writes | Repeated Save taps while the same write is pending create at most one note. |
| REQ-003 | Preserve failed drafts | A failed write leaves the entered text intact, shows an accessible error, and permits retry. |
| REQ-004 | Persist offline | With connectivity disabled, a successful save appears first in the list and is still present after restarting the app. |

## Data and quality

Use the shared [data model](../product/DATA_MODEL.md), [architecture](../product/ARCHITECTURE.md), and [constraints](../product/CONSTRAINTS.md).

## Decisions and readiness

The storage API and Android support remain unverified assumptions.
Resolve these before Len approves this feature and its [plan](../plans/FEAT-001-implementation.md).
No implementation tasks or test results are implied by this specification.
