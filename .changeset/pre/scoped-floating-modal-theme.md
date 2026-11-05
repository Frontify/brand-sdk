---
"@frontify/guideline-blocks-settings": patch
---

fix(RichTextEditor): show the section's color scheme in the button and link modals

The insert/edit modals of the button and link plugins are portaled to `document.body`, so their style previews resolved the default color scheme's theme variables instead of those scoped to the editor's section. The modals now copy the theme variables that the scope around the editor declares onto their portaled wrapper.
