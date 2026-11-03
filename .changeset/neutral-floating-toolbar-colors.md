---
"@frontify/guideline-blocks-settings": patch
---

fix(RichTextEditor): keep the link and button popovers in default colors

The link and button popovers render on a fixed white surface, but inherited the guideline's body and link colors, so a light theme made the URL and icons invisible. Text and icons now use the default dark color and the URL a fixed blue, while the theme typography is kept.
