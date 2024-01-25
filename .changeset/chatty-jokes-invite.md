---
"@frontify/app-bridge": minor
---

Split the testing utilities out of the main bundle, so they don't end up in production builds.
You will need to update the import paths in your tests:

```git
- import { AssetDummy, withAppBridgeBlockStubs } from '@frontify/app-bridge';
+ import { AssetDummy, withAppBridgeBlockStubs } from '@frontify/app-bridge/testing';
```
