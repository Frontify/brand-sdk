---
"@frontify/frontify-cli": patch
---

fix: fall back to the esbuild CSS minifier when lightningcss rejects a block's stylesheet, so blocks that ship Fondue v12 CSS compile successfully
