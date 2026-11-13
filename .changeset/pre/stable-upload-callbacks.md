---
"@frontify/app-bridge": patch
---

perf(useAssetUpload): keep the upload function stable across renders and always call the latest callbacks

The upload function returned by `useAssetUpload` and `useFileUpload` used to be recreated every time the component rendered, so an effect that listed it as a dependency ran again on every render and could send the same files to the uploader again. It now keeps the same identity for the lifetime of the component, even when you pass new inline callbacks on every render.

Upload events also used to call the callbacks from the render in which the first upload started, so a callback that read component state saw old values. They now always call the callbacks from the latest render.
