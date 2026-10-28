---
"@frontify/app-bridge": patch
---

refactor(AppBridgeBlock): deprecate `getPrivacySettings`

Read the privacy settings from the block context instead, or use the `usePrivacySettings` hook to re-render when they change:

```ts
const { assetViewerEnabled, assetDownloadEnabled } = appBridge.context('privacySettings').get();
```
