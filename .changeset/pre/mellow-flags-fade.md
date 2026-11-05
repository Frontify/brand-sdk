---
"@frontify/app-bridge": patch
---

refactor(AppBridgeBlock): deprecate `getEditorState`

Read the editor state from the block context instead, or use the `useEditorState` hook to re-render when it changes:

```ts
const isEditing = appBridge.context('isEditing').get();
```
