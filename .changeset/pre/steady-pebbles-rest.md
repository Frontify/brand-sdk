---
"@frontify/app-bridge": patch
---

perf(useBlockSettings): copy the initial settings only once

`useBlockSettings` no longer deep-copies the block's settings on every render, only when the component mounts. Blocks with large settings re-render faster, for example while typing in the editor.
