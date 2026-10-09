---
"@frontify/app-bridge": minor
---

feat(AppBridge): expose block assets via `BlockContext`

- Adds `assets` to `BlockContext`, available synchronously via `appBridge.context('assets').get()`.
- `useBlockAssets` now seeds its initial state from the context instead of fetching via `getBlockAssets()` on mount, so assets are available on the first render.
