---
"@frontify/guideline-blocks-settings": patch
---

fix(RichTextEditor): assert `zIndex: 'auto'` on the floating link and button portals

These modals are portaled to `document.body` and rely on DOM order so that a dialog
opened from them -- notably the guideline LinkChooser -- renders on top. Guideline
portals can carry custom CSS that sets a `z-index` on body children, which lifted the
modal above that dialog and left the chooser unreachable behind it. Asserting the value
inline wins over those rules.
