---
"@frontify/frontify-cli": major
---

feat: build blocks / themes as ESM packages

Custom blocks and themes are now compiled and output as ECMAScript Modules (ESM) instead of relying on global window variables.
ESM is the modern standard for JavaScript, offering better interoperability, tree-shaking and compatibility with modern bundlers.
Consumers don't need to do anything to migrate to ESM, but they should be aware of the changes.
