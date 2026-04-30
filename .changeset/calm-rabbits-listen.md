---
"@frontify/app-bridge": minor
---

refactor(useBlockAssets): drive state from `Context.assets` instead of `BlockAssetsUpdated`

- The hook now subscribes to `appBridge.context('assets')` for updates and no longer listens to or emits `AppBridge:BlockAssetsUpdated`.
- Mutation helpers (`addAssetIdsToKey`, `deleteAssetIdsFromKey`, `updateAssetIdsFromKey`) just call the AppBridge API; the host is responsible for refreshing `context('assets')` after each mutation.
