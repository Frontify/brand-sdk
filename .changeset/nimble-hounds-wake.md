---
"@frontify/app-bridge": patch
---

fix: support `sinon` 22 in `@frontify/app-bridge/testing`

`sinon` 22 now satisfies the peer dependency. With `@types/sinon` 22, the stubs from `getAppBridgeBlockStub` and `withAppBridgeBlockStubs` could lose their types and become `any`; they stay typed now.
