---
"@frontify/app-bridge": major
---

refactor(HttpClient): remove `HttpClient` and `HttpClientError`

Blocks shouldn't call Frontify endpoints themselves: use `appBridge.api(...)` instead. The `HttpUtilResponse` type and the `HttpUtilResponseDummy` test helper are removed as well.
