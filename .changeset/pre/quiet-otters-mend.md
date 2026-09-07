---
"@frontify/app-bridge": patch
---

fix(useLinkChooser): unsubscribe from the `linkChosen` event on unmount

Previously, a component that unmounted while the link chooser was still open kept its `linkChosen` listener subscribed, leaking it. `openLinkChooser` and `closeLinkChooser` are also now stable across re-renders.
