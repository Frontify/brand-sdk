---
"@frontify/app-bridge": major
---

refactor: remove the `window.application` type

app-bridge no longer reads `window.application`, so it no longer declares it on `Window`.
