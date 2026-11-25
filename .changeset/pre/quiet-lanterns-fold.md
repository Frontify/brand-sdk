---
"@frontify/app-bridge": major
---

refactor(AppBridgeBlock): remove `getProjectId` and `getTranslationLanguage`

Read the project id and the translation language from the block context instead:

```ts
const projectId = appBridge.context('projectId').get();
const translationLanguage = appBridge.context('translationLanguage').get(); // '' when the page isn't a translation
```

`getAppBridgeBlockStub` no longer takes a `language` option. Pass `translationLanguage` instead.
