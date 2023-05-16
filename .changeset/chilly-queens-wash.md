---
"@frontify/app-bridge": major
---

split useDocumentPages hook into useCategorizedDocumentPages and useUncategorizedDocumentPages hooks

Title: [Breaking Change] Removed useDocumentPages hook

Changeset:
This changeset removes the useDocumentPages hook from our codebase and introduces two new hooks: useCategorizedDocumentPages and useUncategorizedDocumentPages.

Breaking Change:
useDocumentPages, which was previously available, has been removed due to redundant api calls (e.g., it was causing performance issues, it's no longer necessary because two additional hooks are added useCategorizedDocumentPages and useUncategorizedDocumentPages).
