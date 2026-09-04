---
'@frontify/app-bridge': minor
---

feat: add `openBrandCheck` command

A content block can dispatch `openBrandCheck` to open the Brand Check dialog on a guideline page. The payload `{ tab?: 'check' | 'configuration' }` is optional. The host opens the check tab when the payload is missing.
