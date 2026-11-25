---
"@frontify/app-bridge": minor
---

feat(useBlockSettings): read the block settings from the host context

`useBlockSettings` now reads `appBridge.context('settings')` and re-renders when the host updates it, instead of reading `window.blockSettings` and listening to the `AppBridge:BlockSettingsUpdated` event on `window.emitter`. Hosts must provide `settings` in the block context and update it after `updateBlockSettings()` saves.
