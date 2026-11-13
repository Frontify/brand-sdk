---
"@frontify/guideline-blocks-settings": patch
---

fix: stop toolbar and rich text editor buttons from submitting a surrounding form

The block item toolbar buttons and the edit, remove and style buttons in the rich text editor's link and button popovers had no `type`, so inside a `<form>` they acted as submit buttons. They are now `type="button"`.
