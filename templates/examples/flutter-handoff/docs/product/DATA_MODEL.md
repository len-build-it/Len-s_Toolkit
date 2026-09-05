# Pocket Notes data model

Created: 2026-09-05T15:29:25+08:00
Updated: 2026-09-05T15:29:25+08:00
Revision: 1
Status: Draft example

## Note

| Field | Definition |
| --- | --- |
| id | Unique identifier supplied by the existing local storage API |
| text | Trimmed, nonempty text; maximum 200 Unicode scalar values |
| createdAt | UTC creation timestamp |

The device's local store owns the saved record.
An unsaved draft belongs to the editor until successful persistence.
The storage operation returns the saved record or an error; no result is inferred from merely starting a write.
No data is sent off-device.
The actual storage API must be inspected before this draft can be approved.
