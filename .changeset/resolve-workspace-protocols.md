---
"@frontify/frontify-cli": patch
---

fix(cli): resolve workspace protocol specifiers during deployment

The deploy command now resolves `catalog:`, `workspace:`, `link:`, `file:`, and other protocol specifiers to their actual installed versions before uploading to the Frontify Marketplace API. Previously, these raw specifiers were sent as-is, causing deployment failures in pnpm workspace setups.

Key changes:

- Dependencies are resolved via `node_modules` lookup during `collectFiles`. Unresolvable protocol specifiers are omitted from the payload with a warning.
- The `package.json` included in `source_files` is sanitized with resolved versions before upload.
- The platform app compiler now guards against protocol specifiers being injected into compiled JavaScript output.
- A warning is emitted when potentially sensitive files (`.env`, `.npmrc`, `.netrc`) are detected in the source upload.
