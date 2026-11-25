---
"@frontify/app-bridge": major
---

refactor(EmitterEvents): remove the `AppBridge:BlockSettingsUpdated` event

The event, its `BlockSettingsUpdateEvent` type and the `blockSettings` declaration on `Window` are removed. Read the block settings from `appBridge.context('settings')` instead, or use the `useBlockSettings` hook to re-render when they change.

`getAppBridgeBlockStub` no longer writes `window.blockSettings`, and its `getBlockSettings()` now resolves the stubbed block's settings.
