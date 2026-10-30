---
"@frontify/guideline-blocks-settings": minor
---

feat: add `useBlockPrivacySettings` and `getSecurityAssetViewerSetting` so blocks can override the global privacy settings without resolving them by hand

`useBlockPrivacySettings` returns the global privacy settings, or the block's own overrides when its security is set to custom. A privacy setting the block offers no override switch for stays global.

```ts
// settings.ts
import {
    defineSettings,
    getSecurityAssetViewerSetting,
    getSecurityDownloadableSetting,
    getSecurityGlobalControlSetting,
} from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    security: [...getSecurityGlobalControlSetting(), getSecurityAssetViewerSetting(), getSecurityDownloadableSetting()],
});

// Block.tsx
import { useBlockPrivacySettings } from '@frontify/guideline-blocks-settings';

const { assetViewerEnabled, assetDownloadEnabled } = useBlockPrivacySettings(appBridge, {
    assetViewerId: 'assetViewerEnabled',
    downloadableId: 'downloadable',
});
```
