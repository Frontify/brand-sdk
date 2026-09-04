---
"@frontify/app-bridge": minor
---

feat: add `openBrandChecker` command

A content block can dispatch `openBrandChecker` to open the Brand Check dialog on a guideline page. The payload uses `OpenBrandCheckerPayload` (`{ tab?: BrandCheckerTab }`). `tab` is optional. The host opens the check tab when the payload is missing.
