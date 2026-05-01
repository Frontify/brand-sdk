---
"@frontify/frontify-cli": minor
---

feat(serve): include the block manifest in the `/_entrypoint` dev-server response

The block development server now reads `manifest.json` from the project root on each `/_entrypoint` request and returns its parsed content under a `manifest` field, so consumers can pick up live manifest changes without restarting `frontify-cli serve`. If `manifest.json` is missing or unparseable, the field is omitted and a warning is logged.

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

Internal type cleanup that landed alongside this: `AppManifest` is now a discriminated union `ContentBlockManifest | PlatformAppManifest` (the latter inferred from `platformAppManifestSchemaV1`), exported from `utils/verifyManifest`. `verifyManifestOnServer` accepts `AppManifest` directly, dropping the `as unknown as Record<string, unknown>` casts in `validateBlockManifestOnServer` and the `verify-manifest` command. The block dev server is narrowed to `ContentBlockManifest` since it never serves platform-app or theme manifests. Theme manifests still pass through the platform-app variant for now because the `appType` enum on `platformAppManifestSchemaV1` includes `'theme'`.
