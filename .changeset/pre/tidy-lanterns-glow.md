---
"@frontify/guideline-blocks-settings": patch
---

fix: show missing borders, hover backgrounds and error colors

Several components used old palette classes that the package's stylesheet doesn't generate, so those styles didn't render. They now use the current fondue tokens:

- `BlockInjectButton`: the red border and text when an invalid file is dropped
- Rich text editor link and button popovers: the hover background of the edit and remove icons, and the divider above the Cancel and Save buttons in the link dialog
- Rich text editor button dialog: the outline around the selected button style
- `Attachments`: the divider below the attachment list

The block item toolbar now uses fondue's radius and shadow tokens as well: its corners are slightly tighter (4px instead of 6px) and its shadow matches fondue's flyouts.
