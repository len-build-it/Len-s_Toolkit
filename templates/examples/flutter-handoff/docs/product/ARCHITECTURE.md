# Pocket Notes architecture

Created: 2026-09-05T15:29:25+08:00
Updated: 2026-09-05T15:29:25+08:00
Revision: 1
Status: Draft example

## Proposed design

Use one Flutter screen with a local notes list and an editor.
Route storage through the host project's existing local-storage API, retaining entered text until a write succeeds.
Reload saved notes through that same API when opening the app.
No new dependency, server, or state-management framework is proposed.

## Assumptions and failure modes

An existing storage API and Flutter project are assumed for illustration; neither is present in this example.
Before approval, inspect the real storage API, its durability guarantees, and failure behavior.
If it cannot meet the data model, return the architecture decision to GPT and Len instead of inventing a replacement during implementation.
Storage errors must preserve the editor contents and must not display a false success message.

## Authority

This proposal is not approved or validated.
