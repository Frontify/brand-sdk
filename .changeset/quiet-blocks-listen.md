---
"@frontify/app-bridge": minor
---

feat(useEditorState): read the editor state from the host context

`useEditorState` now reads `appBridge.context('isEditing')` when the host publishes it, instead of every hook call observing `document.body` and querying the DOM on each class change. Hosts that don't publish it keep the previous `MutationObserver` behaviour.
