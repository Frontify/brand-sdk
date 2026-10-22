---
"@frontify/app-bridge": patch
---

fix: stop `useAssetChooser` and `useTemplateChooser` from leaking subscriptions

If the chooser was dismissed without a selection and then opened again, choosing an asset or template ran your callback twice. Each open now replaces the previous subscription, and the hooks unsubscribe when the component unmounts. `openAssetChooser`, `closeAssetChooser`, `openTemplateChooser` and `closeTemplateChooser` now also keep the same identity across renders.
