---
"@frontify/app-bridge": patch
---

build: stop shipping unused CommonJS files

The package is ES modules only. `require()` and `import` resolve to the same files as before, and the `.cjs` files that no entry pointed to are gone.
