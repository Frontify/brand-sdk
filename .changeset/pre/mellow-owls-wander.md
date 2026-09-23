---
"@frontify/app-bridge": minor
---

feat: add `openPlatformAppDirect` block command to open a marketplace platform app directly

```ts
import { openPlatformAppDirect } from '@frontify/app-bridge';

await appBridge.dispatch(openPlatformAppDirect({ marketplaceAppId: 'your-app-id' }));
```
