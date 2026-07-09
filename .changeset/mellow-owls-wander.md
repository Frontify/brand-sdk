---
"@frontify/app-bridge": minor
---

feat: add `openPlatformAppDirect` block command to open a marketplace platform app directly, plus a `platformAppDirectOpened` event to react when it opens

```ts
import { openPlatformAppDirect } from '@frontify/app-bridge';

await appBridge.dispatch(openPlatformAppDirect({ marketplaceAppId: 'your-app-id' }));

const unsubscribe = appBridge.subscribe('platformAppDirectOpened', ({ marketplaceAppId }) => {
    console.log(`Opened ${marketplaceAppId}`);
});
```
