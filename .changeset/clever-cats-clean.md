---
"@frontify/frontify-cli": patch
---

fix: CLI bug fixes and cleanup

- Fix typo `sucess` → `success` in HTTP error response type
- Fix hardcoded port in OAuth redirect URI (now uses the configured `--port` value)
- Fix missing `/` separator in deploy build file ignore glob pattern
- Remove `node-fetch` dependency in favor of native `fetch` (Node >=22)
- Handle full 2xx status range in HTTP client instead of only `200`
- Eliminate duplicated deploy command branches in CLI entry point
- Reduce cognitive complexity in deploy command by extracting helper functions
