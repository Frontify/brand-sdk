---
"@frontify/app-bridge": minor
---

feat(BlockContext): add `templates`

The block context now declares the block's `templates`. `getAppBridgeBlockStub` answers `context('templates')` from its `blockTemplates` option and updates it when `addTemplateIdsToBlockTemplateKey()` or `deleteTemplateIdsFromBlockTemplateKey()` is called:

```ts
const appBridge = getAppBridgeBlockStub({ blockTemplates: { templates: [TemplateDummy.with(1)] } });

await appBridge.addTemplateIdsToBlockTemplateKey('templates', [2]);

appBridge.context('templates').get(); // { templates: [TemplateDummy.with(1), TemplateDummy.with(2)] }
```
