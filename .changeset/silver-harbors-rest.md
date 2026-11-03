---
"@frontify/app-bridge": patch
---

refactor(AppBridgeBlock): deprecate `getProjectId` and `getTranslationLanguage`

Read the project id and the translation language from the block context instead:

```ts
const projectId = appBridge.context('projectId').get();
const translationLanguage = appBridge.context('translationLanguage').get(); // '' when the page isn't a translation
```
