---
"@frontify/app-bridge": minor
---

feat(BlockContext): add `privacySettings`

The block context now declares the guideline's `privacySettings`, and `getAppBridgeBlockStub` answers `context('privacySettings')` from its `privacySettings` option:

```ts
const appBridge = getAppBridgeBlockStub({
    privacySettings: { assetViewerEnabled: true, assetDownloadEnabled: false },
});

appBridge.context('privacySettings').get(); // { assetViewerEnabled: true, assetDownloadEnabled: false }
```
