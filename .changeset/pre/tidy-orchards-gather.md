---
"@frontify/app-bridge": minor
---

feat(BlockContext): add `settings`

The block context now declares the block's `settings`. `getAppBridgeBlockStub` answers `context('settings')` from its `blockSettings` option and merges `updateBlockSettings()` calls into it:

```ts
const appBridge = getAppBridgeBlockStub({ blockSettings: { color: 'red' } });

await appBridge.updateBlockSettings({ layout: 'grid' });

appBridge.context('settings').get(); // { color: 'red', layout: 'grid' }
```
