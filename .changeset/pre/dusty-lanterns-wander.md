---
"@frontify/app-bridge": patch
---

perf: stop bundling `lodash-es` and React's JSX runtime into the package

Blocks that don't use `convertObjectCase` no longer ship any lodash code, which saves about 12 KB minified per block. `@frontify/app-bridge/testing` now uses your own `react/jsx-runtime` instead of a bundled copy.
