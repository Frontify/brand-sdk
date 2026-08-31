---
"@frontify/guideline-blocks-settings": patch
---

fix: restrict the `@frontify/app-bridge` peer dependency to exclude incompatible `4.0.0` alpha builds from `alpha.68` onward

The peer range was previously `^3.0.0 || ^4.0.0-alpha.0`, which also matched later alpha builds that are not yet compatible. It is now `^3.0.0 || >=4.0.0-alpha.0 <4.0.0-alpha.68`.
