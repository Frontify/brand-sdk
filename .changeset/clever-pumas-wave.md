---
"@frontify/frontify-cli": minor
---

feat(CLI): add `verify-manifest` command to validate the local `manifest.json` against the Frontify Marketplace before deploying

Example usage:

```bash
frontify-cli verify-manifest
frontify-cli verify-manifest --app-type content-block
frontify-cli verify-manifest --app-type content-block --instance my-instance.frontify.com --token <accessToken>
```
