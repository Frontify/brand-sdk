---
"@frontify/app-bridge": minor
---

feat(BlockContext): add `projectId` and `translationLanguage`

The block context now declares the guideline's `projectId` and the `translationLanguage` the page is translated into (an empty string when it isn't a translation). `getAppBridgeBlockStub` answers both from its `projectId` and `translationLanguage` options:

```ts
const appBridge = getAppBridgeBlockStub({ projectId: 42, translationLanguage: 'de' });

appBridge.context('projectId').get(); // 42
appBridge.context('translationLanguage').get(); // 'de'
```
