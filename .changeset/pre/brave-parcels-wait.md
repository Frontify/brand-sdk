---
"@frontify/app-bridge": minor
---

feat: add the `createAssetBulkDownload` API method

It prepares an archive with the given assets and resolves with its download URL once the archive is ready. It rejects when preparing the archive fails or when the signal is aborted. `getAppBridgeBlockStub` resolves it with a dummy URL.

```ts
const controller = new AbortController();

const { downloadUrl } = await appBridge.api({
    name: 'createAssetBulkDownload',
    payload: { blockAssets, signal: controller.signal },
});
```
