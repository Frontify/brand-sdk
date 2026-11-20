---
"@frontify/app-bridge": major
---

refactor: export the testing utilities only from `@frontify/app-bridge/testing`

`getAppBridgeBlockStub`, `withAppBridgeBlockStubs` and the `*Dummy` fixtures are no longer exported from `@frontify/app-bridge`. Importing anything from the main entry no longer pulls `sinon` into your production bundle.

```ts
// Before
import { AssetDummy, getAppBridgeBlockStub } from '@frontify/app-bridge';

// After
import { AssetDummy, getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
```
