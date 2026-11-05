---
"@frontify/guideline-blocks-settings": patch
---

perf: let bundlers drop the parts of the package a block doesn't use

Importing any export, such as `defineBlock` or a settings helper, no longer pulls the whole package into your block bundle. Blocks that don't use the `RichTextEditor` no longer ship it, along with its emoji data.
