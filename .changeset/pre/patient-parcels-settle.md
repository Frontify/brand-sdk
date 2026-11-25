---
"@frontify/app-bridge": patch
---

refactor(useAssetBulkDownload): let the host wait for the download

`useAssetBulkDownload` now asks the host for the download with the `createAssetBulkDownload` API method instead of polling for it itself. `status` is `Pending` while the host prepares the download, and `generateBulkDownload`, `status` and `downloadUrl` work as before. Starting a new download or unmounting still aborts the previous one.

Blocks built with this version need a Frontify version that supports `createAssetBulkDownload`.
