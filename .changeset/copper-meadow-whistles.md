---
"@frontify/app-bridge": major
---

refactor(EmitterEvents): remove the `AppBridge:BlockTemplatesUpdated` event

Read the block templates from `appBridge.context('templates')` instead, or use the `useBlockTemplates` hook to re-render when they change.
