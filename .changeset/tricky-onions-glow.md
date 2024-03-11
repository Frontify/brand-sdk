---
"@frontify/app-bridge": patch
---

fix(useBlockSettings): setBlockSettings has been wrapped in a useCallback so it can be safely used as a dependency in react hooks.
