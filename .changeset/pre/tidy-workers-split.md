---
"@frontify/app-bridge": patch
---

perf: drop the upload worker from blocks that never upload

Blocks that don't use `useFileUpload` or `useAssetUpload` no longer ship the inline upload worker, which saves about 3 KB minified per block. Blocks that upload are unchanged.
