---
"@frontify/app-bridge": minor
---

feat(useBlockTemplates): read the block templates from the host context

`useBlockTemplates` now reads `appBridge.context('templates')` and re-renders when the host updates it, instead of loading the templates with `getBlockTemplates()` and listening to the `AppBridge:BlockTemplatesUpdated` event on `window.emitter`. Every `useBlockTemplates` on the same app bridge re-renders when the templates change. Hosts must provide `templates` in the block context and update it after `addTemplateIdsToBlockTemplateKey()` and `deleteTemplateIdsFromBlockTemplateKey()` save.
