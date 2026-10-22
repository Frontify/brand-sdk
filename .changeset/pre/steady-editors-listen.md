---
"@frontify/app-bridge": patch
---

perf(useEditorState): subscribe to the editor state once instead of on every render

`useEditorState` no longer unsubscribes from and resubscribes to the host's `isEditing` context each time the component renders. It subscribes when the component mounts and unsubscribes when it unmounts.
