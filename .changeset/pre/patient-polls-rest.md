---
"@frontify/app-bridge": patch
---

fix(useAssetBulkDownload): stop polling after unmount or when a new download starts

`useAssetBulkDownload` no longer keeps checking whether a bulk download is ready after the component unmounts. Starting a new download now stops the checks for the previous one, which kept running forever before. Each check also waits for the previous one to finish, so slow responses no longer lead to overlapping requests.
