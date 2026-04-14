---
"@frontify/frontify-cli": patch
---

fix: add missing CSS and JS minification to platform-app compiler

- Add `cssFileName: 'style'` to the settings lib build
- Add `minify: 'terser'` for JS minification
- Set explicit `mode: 'production'` on both builds
