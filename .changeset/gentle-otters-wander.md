---
"@frontify/frontify-cli": patch
---

fix(templates): keep the rich text editor working in newly created blocks

Blocks created with `frontify-cli create` crashed with `Cannot read properties of undefined (reading 'slice')` as soon as a rich text editor was switched to edit mode. The block templates now pin the Slate packages that Fondue's rich text editor expects, so new blocks render and edit rich text again. They also ship with `@frontify/app-bridge` `^3.12.10` and `@frontify/guideline-blocks-settings` `^3.0.7` (previously `3.12.9` and `2.1.11`) and current tooling. Installing with npm no longer warns about unapproved install scripts, and installing with pnpm no longer fails on them.
