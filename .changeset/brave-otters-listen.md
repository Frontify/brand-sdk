---
"@frontify/guideline-blocks-settings": patch
---

fix(Attachments): announce the attachment name on the download button

The download button carried an `aria-label` that overrode its visible label, so screen readers announced "Download attachment" without saying which attachment. The action is now conveyed by screen-reader-only text in front of the attachment title, making both the action and its target audible.
