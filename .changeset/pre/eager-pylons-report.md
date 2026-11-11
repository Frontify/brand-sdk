---
"@frontify/app-bridge": major
---

refactor(useAssetUpload): report the upload payloads instead of `MessageEvent`s

The hook used to imitate the upload worker it replaced: it wrapped every callback payload in a `MessageEvent`, and `onUploadDone` reported a snake_case `file_id` / `file_name` / `generic_url` object instead of the asset. The callbacks now receive the payloads of the `createAssets` API method directly.

| Callback | Receives |
| --- | --- |
| `onUploadProgress` | `CreateAssetsFileProgress` — `{ file, index, loaded, total }` |
| `onUploadProgressAll` | `CreateAssetsProgress` — `{ loaded, total }` |
| `onUploadDone` | `CreateAssetsFileSuccess` — `{ file, index, asset }` |
| `onUploadAssetFail` | `CreateAssetsFileFailure` — `{ file, index, message }` |

`onUploadDoneAll` and `onUploadFail` are unchanged. Read the payload directly where you used to reach for `event.data`:

```ts
const [uploadFiles] = useAssetUpload(appBridge, {
    onUploadProgress: ({ index, loaded, total }) => setProgress(index, loaded / total),
    onUploadDone: ({ asset }) => addAsset(asset),
    onUploadAssetFail: ({ file, message }) => showError(`${file.name}: ${message}`),
});
```
