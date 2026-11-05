---
"@frontify/app-bridge": patch
---

chore: deprecate the bulk download token and polling methods

`appBridge.getBulkDownloadByToken()`, `appBridge.getBulkDownloadBySignature()` and the `getAssetBulkDownloadToken` API method are deprecated and will be removed in version 5.0.0. Use the `useAssetBulkDownload` hook, or the `createAssetBulkDownload` API method, which resolves once the download is ready:

```ts
const { downloadUrl } = await appBridge.api({
    name: 'createAssetBulkDownload',
    payload: { blockAssets, signal },
});
```
