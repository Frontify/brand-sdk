---
"@frontify/frontify-cli": patch
---

fix(cli): default `appType` to `content-block` in deploy command

When neither the `--app-type` CLI option nor the `manifest.json` `appType` field is set, the deploy command now falls back to `'content-block'` instead of remaining `undefined`. This prevents deployment failures for projects that omit the `appType` from their manifest.
