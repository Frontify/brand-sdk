---
"@frontify/frontify-cli": minor
---

feat(serve): include the block manifest in the `/_entrypoint` dev-server response

The block development server now reads `manifest.json` from the project root on each `/_entrypoint` request and returns its parsed content under a `manifest` field, so the host can pick up live manifest changes without restarting `frontify-cli serve`. If `manifest.json` is missing or unparseable, the field is omitted and a warning is logged.

```json
GET http://localhost:5600/_entrypoint
{
    "url": "http://localhost:5600/src/index.ts",
    "entryFilePath": "src/index.ts",
    "port": 5600,
    "version": "6.1.0",
    "dependencies": { "@frontify/app-bridge": "^4.0.0", "react": "^18.3.1" },
    "manifest": { "appId": "abc123…" }
}
```
