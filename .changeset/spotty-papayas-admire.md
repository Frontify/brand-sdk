---
"@frontify/guideline-blocks-settings": minor
---

feat(RTE): add custom column break plugin
Use simply as: `new BreakAfterPlugin({ columns, gap })`, and the plugin will take care of responsivity using container queries. Don't forget to also supply columns and gap to the `RichTextEditor` component.
