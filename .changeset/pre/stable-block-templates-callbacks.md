---
"@frontify/app-bridge": patch
---

perf(useBlockTemplates): keep `addTemplateIdsToKey`, `deleteTemplateIdsFromKey` and `updateTemplateIdsFromKey` stable across renders

The three functions returned by `useBlockTemplates` used to be recreated every time the component rendered. Effects, `useMemo` and `useCallback` that listed them as dependencies therefore ran again on every render, and memoised children receiving them re-rendered. They now keep the same identity for as long as `appBridge` does, so you can pass them down or list them as dependencies without workarounds.
