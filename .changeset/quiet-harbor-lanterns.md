---
"@frontify/app-bridge": patch
---

refactor(AppBridgeBlock): deprecate `getBlockTemplates`

Read the block templates from the block context instead, or use the `useBlockTemplates` hook to re-render when they change:

```ts
const blockTemplates = appBridge.context('templates').get();
```
