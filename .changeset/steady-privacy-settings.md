---
"@frontify/app-bridge": patch
---

perf(usePrivacySettings): read the privacy settings once and subscribe to changes once

`usePrivacySettings` used to ask the host for the privacy settings on every render, although only the first value was used, and it unsubscribed from and resubscribed to privacy setting changes each time they changed. It now reads them when the component mounts and keeps a single subscription until it unmounts.
