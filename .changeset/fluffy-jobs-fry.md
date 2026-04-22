---
"@frontify/frontify-cli": patch
---

fix(cli): repair content-block templates

- Replace removed `IconEnum` import with string icon name in `settings.ts`
- Pin `@udecode/plate-common` to `36.5.9` via `overrides`/`resolutions` to avoid the deprecated `42.0.0` shim that breaks Rollup builds
- Pin `zustand` to `4.5.7` so blocks don't pick up `zustand@5` (incompatible API with `@udecode/zustood` / `zustand-x`, causing `TypeError: createState is not a function` when the block loads in the web-app)
- Use arbitrary-value color classes in the Tailwind template so the example renders correctly under the Frontify Tailwind preset (which replaces the default `blue`/`green`/`red` palette)
