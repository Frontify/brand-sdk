---
"@frontify/frontify-cli": patch
---

fix(cli): repair content-block templates

- Replace removed `IconEnum` import with string icon name in `settings.ts`
- Pin `@udecode/plate-common` to `36.5.9` via `overrides`/`resolutions` to avoid the deprecated `42.0.0` shim that breaks Rollup builds
