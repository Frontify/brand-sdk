---
"@frontify/app-bridge": minor
---

refactor(useBlockAssets): source state from `Context.assets`

The hook now seeds and updates `blockAssets` from `appBridge.context('assets')` and no longer fetches via `getBlockAssets()` on mount. It also no longer listens to or emits `AppBridge:BlockAssetsUpdated`; mutation helpers (`addAssetIdsToKey`, `deleteAssetIdsFromKey`, `updateAssetIdsFromKey`) just call the AppBridge API, and the host is responsible for refreshing `context('assets')` after each mutation.
