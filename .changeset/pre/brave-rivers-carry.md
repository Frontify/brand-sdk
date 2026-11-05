---
"@frontify/app-bridge": major
---

feat(useAssetUpload): upload through the host

`useAssetUpload` now uploads through `appBridge.api(createAssets(...))`. It no longer calls Frontify's upload endpoints itself, so later backend changes won't break built blocks. It takes the app bridge as its first argument, like the other hooks:

```diff
- const [uploadFile, { results, doneAll }] = useAssetUpload({ onUploadProgress });
+ const [uploadFile, { results, doneAll }] = useAssetUpload(appBridge, { onUploadProgress });
```

The callbacks, `results` and `doneAll` keep their shape. An upload still in progress is cancelled when the component unmounts.
