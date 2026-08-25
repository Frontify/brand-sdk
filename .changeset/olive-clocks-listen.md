---
"@frontify/guideline-blocks-settings": patch
---

fix(Attachments): improve the accessibility of the flyout trigger

The trigger now has an accessible name that describes the action and the number of attachments (e.g. `Open attachments, 1 attachment`) instead of only exposing the bare count, and it announces `aria-haspopup="menu"` instead of `dialog`.
