---
"@frontify/guideline-blocks-settings": patch
---

fix(Attachments): upload attachments through the host

`Attachments` passes its app bridge to `useAssetUpload`, which now uploads through the host.
