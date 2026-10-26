---
"@frontify/frontify-cli": patch
---

fix(deps): require patched `vite` (^8.3.5) to resolve GHSA-rq7h-c2jc-7f22, GHSA-vfpm-58rq-9qcg, GHSA-9jrq-w75r-8gcw, GHSA-587h-7wmj-h5pm, GHSA-r825-w8mm-5pxw and GHSA-698v-4r3x-3vcv

The previous range still allowed vite 8.3.0–8.3.2, whose dev server, used by `frontify-cli serve`, could expose files outside `server.fs.allow`.
