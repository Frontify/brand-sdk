---
"@frontify/app-bridge": patch
---

chore: deprecate the `useReadyForPrint` hook

It has no effect: printing a guideline doesn't wait for the readiness it reports. It will be removed in version 4.0.0 without a replacement, so you can drop it from your block.
