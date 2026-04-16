---
"@frontify/frontify-cli": patch
---

fix(cli): resolve dependency versions from node_modules instead of package.json specifiers

The development server and platform app compiler were reading React and App Bridge versions directly from the consumer's `package.json` `dependencies` field. This broke when using pnpm workspaces with the `catalog:` or `workspace:*` protocols, since those specifiers were passed as-is to the bundler instead of actual version numbers.

Version resolution now uses Node's built-in `findPackageJSON` (available since Node 22.14.0, matching the CLI's `>=22` engine requirement) to directly locate each package's `package.json` in `node_modules`. A fallback to the consumer's `package.json` is preserved for environments where `node_modules` is not yet populated, and checks `devDependencies` and `peerDependencies` in addition to `dependencies`.
