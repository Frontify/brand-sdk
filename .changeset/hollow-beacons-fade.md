---
"@frontify/app-bridge": major
---

refactor(EmitterEvents): remove the `AppBridge:PrivacySettingsChanged` event

Read the privacy settings from `appBridge.context('privacySettings')` instead, or use the `usePrivacySettings` hook to re-render when they change.
