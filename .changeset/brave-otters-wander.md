---
"@frontify/frontify-cli": major
---

feat(create)!: remove the Tailwind and plain CSS content block templates

`frontify-cli create` now always scaffolds a block with CSS Modules and no longer asks for a styling framework when you select "Block". Apps still offer Tailwind, CSS Modules and plain CSS. Existing blocks are not affected.
