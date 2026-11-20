---
"@frontify/app-bridge": major
---

refactor(useReadyForPrint): remove the `useReadyForPrint` hook

It had no effect: printing a guideline didn't wait for the readiness it reported. There is no replacement, remove the hook from your block.
