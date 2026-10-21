---
"@frontify/app-bridge": patch
---

perf(useFileUpload): start the upload worker on the first upload

`useFileUpload` and `useAssetUpload` no longer start a Web Worker when the component mounts. The worker starts with the first upload and is reused for later ones. Blocks that render an uploader per item, such as one per thumbnail, no longer keep an idle worker thread running for every item.
