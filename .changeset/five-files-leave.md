---
"@frontify/guideline-blocks-settings": patch
---

feat(useAttachments): create new hook without asset call

### Migration
No changes required for consumers of `useAttachments`.  

- **Keep using `useAttachments(appBridge, key)`** → works exactly as before.  
- **Optional (advanced use)**: To avoid multiple asset calls, use the new hook directly:

```ts
import { Attachments, useAttachmentOperations } from '@frontify/guideline-blocks-settings';
import { useBlockAssets } from '@frontify/app-bridge';

const blockAssetsBundle = useBlockAssets(appBridge);
const props = useAttachmentOperations("MY_ATTACHMENTS_KEY", blockAssetsBundle);

return <Attachments {...props} />
