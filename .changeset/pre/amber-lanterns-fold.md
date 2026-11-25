---
"@frontify/app-bridge": major
---

refactor(EmitterEvents): remove the `AppBridge:BlockAssetsUpdated` and `AppBridge:ViewerOpened` events

Read the block assets from `appBridge.context('assets')` instead, or use the `useBlockAssets` hook to re-render when they change.
