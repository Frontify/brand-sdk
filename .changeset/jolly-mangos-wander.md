---
"@frontify/guideline-blocks-settings": major
---

feat(RichTextEditor)!: open the in-sourced link chooser from the app bridge

The rich text editor's "Internal link" button now dispatches the app bridge `openLinkChooser` command instead of rendering its own document browser, so link selection reuses the in-sourced chooser provided by the host. The hosting app must handle the `openLinkChooser`/`closeLinkChooser` commands and emit the `linkChosen` event. Applies to both the Link and Button plugins; the URL field and "Open in new tab" toggle are unchanged.

BREAKING CHANGE: the `@frontify/app-bridge` peer dependency is now `^4.0.0-alpha.0` (previously `^3.0.0 || ^4.0.0-alpha.0`), since `useLinkChooser` is only available in app-bridge v4.
