---
"@frontify/guideline-blocks-settings": patch
---

fix: keep `@frontify/guideline-blocks-settings/styles` in webpack production builds

The package marked all of its files as free of side effects, including the stylesheet. In production mode, webpack therefore dropped `import '@frontify/guideline-blocks-settings/styles'` and the block shipped without the package's styles. CSS files are now marked as having side effects; tree-shaking of the JavaScript exports is unchanged.
