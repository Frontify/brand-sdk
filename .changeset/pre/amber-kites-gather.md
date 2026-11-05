---
"@frontify/app-bridge": minor
---

feat(AppBridgeBlock): add the `createAssets` API method

Blocks can upload files through the host and get the created assets back. Nothing calls it yet: `useAssetUpload` will switch to it in a later release.

```ts
import { createAssets } from '@frontify/app-bridge';

const { assets, failures } = await appBridge.api(
    createAssets({
        files: [file],
        onProgress: ({ loaded, total }) => setProgress(loaded / total),
        onFileFail: ({ file, message }) => showError(file.name, message),
    }),
);
```

`getAppBridgeBlockStub` answers `createAssets` with one `AssetDummy` per file and calls `onProgress`, `onFileProgress` and `onFileDone` for each file.
