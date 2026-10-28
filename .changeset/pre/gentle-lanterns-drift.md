---
"@frontify/app-bridge": minor
---

feat(usePrivacySettings): read the privacy settings from the host context

`usePrivacySettings` now reads `appBridge.context('privacySettings')` and re-renders when the host updates it, instead of listening to the `AppBridge:PrivacySettingsChanged` event on `window.emitter`. Hosts must provide `privacySettings` in the block context.
