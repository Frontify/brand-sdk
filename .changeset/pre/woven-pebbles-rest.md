---
"@frontify/app-bridge": patch
---

refactor(AppBridgeBlock): deprecate `getBlockSettings`

Read the block settings from the block context instead, or use the `useBlockSettings` hook to re-render when they change:

```ts
const blockSettings = appBridge.context('settings').get();
```
