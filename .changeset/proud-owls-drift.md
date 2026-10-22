---
"@frontify/guideline-blocks-settings": major
---

build: publish ES modules only

The package no longer ships its UMD and CommonJS builds. `require()` now resolves to the ES module build, the same file `import` uses, so bundlers resolve the same code as before.

Neither old build worked with `require()` in Node: both used a `.js` extension in a `"type": "module"` package, so Node loaded them as ES modules.

If Jest loads the package as CommonJS, let it transform the package, the same way it already has to for `@frontify/app-bridge`:

```js
transformIgnorePatterns: ['/node_modules/(?!@frontify/)'],
```
