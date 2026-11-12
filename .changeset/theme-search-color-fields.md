---
"@frontify/app-bridge-theme": patch
---

chore: deprecate `colorHex` and `projectColorId` of `GuidelineSearchResult`

Frontify retired color search results, so these fields are never set anymore and no result has the type `COLOR`. They will be removed in the next major version.
