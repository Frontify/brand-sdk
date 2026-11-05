---
"@frontify/app-bridge": minor
---

feat(useEditorState): read the editor state from the host context

`useEditorState` now reads `appBridge.context('isEditing')`, like `useIsEditing` in `@frontify/app-bridge-theme`, instead of every hook call observing `document.body` and querying the DOM on each class change. Hosts must provide `isEditing` in the block context.
