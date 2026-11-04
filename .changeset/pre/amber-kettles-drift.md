---
"@frontify/app-bridge": patch
---

feat(useBlockTemplates): read the block templates from the host context

`useBlockTemplates` now reads `appBridge.context('templates')` and re-renders when the host updates it, instead of loading the templates with `getBlockTemplates()` and listening to the `AppBridge:BlockTemplatesUpdated` event on `window.emitter`. Every `useBlockTemplates` on the same app bridge re-renders when the templates change. Hosts must provide `templates` in the block context and update it after `addTemplateIdsToBlockTemplateKey()` and `deleteTemplateIdsFromBlockTemplateKey()` save.

`getBlockTemplates()` is deprecated. Read the block templates from the block context instead, or use the hook to re-render when they change:

```ts
const blockTemplates = appBridge.context('templates').get();
```

With that, nothing in app-bridge uses `window.emitter` anymore. The `AppBridge:BlockTemplatesUpdated` event, the `EmitterEvents` type and the `emitter` declaration on `Window` are removed, `getAppBridgeBlockStub` no longer sets `window.emitter`, and app-bridge no longer depends on `mitt`.
