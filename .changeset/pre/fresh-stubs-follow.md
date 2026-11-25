---
"@frontify/app-bridge": patch
---

fix(getAppBridgeBlockStub): return the current assets from `context('assets').get()`

After `addAssetIdsToBlockAssetKey` or `deleteAssetIdsFromBlockAssetKey`, `get()` still returned the assets the stub was created with, while subscribers received the updated ones. A component that mounted after such a change started with stale assets.
