# Workflow inspection exercises

This is a fictional documentation fixture, not a working Flutter app.
Use its [index](docs/SPEC_INDEX.md) to inspect the complete handoff chain.
The situations below are hypothetical inspection prompts, not evidence that an agent executed them.

| Situation | Expected decision |
| --- | --- |
| Tomorrow Len clarifies the note length requirement | Revise FEAT-001, its affected criteria and plan, and timestamps; do not create a new daily spec. |
| Len replaces local note creation with a different capability | Preserve the superseded spec in `docs/archive/`, link its replacement, update the index and incoming references, and obtain approval for new scope. |
| Gemini resumes with no earlier chat | Read the handoff and authorities, inspect Git, and stop because the example has no actual approval. |
| An approved phase was interrupted after edits but before tests | Reconcile the diff, preserve the edits, run remaining approved checks, and leave the phase incomplete until its commit succeeds. |
| The same failure survives three corrections and checks | Record all attempts, remaining edits, affected requirements, and needed decision; stop affected work. |
| Gemini prefers a new storage library | Report the preference, continue the approved design if feasible, and do not introduce the library. |
| The actual storage API cannot persist records | Report an architecture blocker immediately rather than fake persistence or silently change the design. |
| An emulator scenario passes | Record the emulator configuration and actual result; physical-device verification is still pending. |
