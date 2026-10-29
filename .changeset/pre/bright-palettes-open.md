---
"@frontify/app-bridge": minor
---

feat: add `openColorChooser`/`closeColorChooser` block commands to render the host color chooser into an element

```ts
import { openColorChooser, closeColorChooser } from "@frontify/app-bridge";

await appBridge.dispatch(openColorChooser({ element, color, onColorSelect: (color) => setColor(color) }));
// ...
await appBridge.dispatch(closeColorChooser({ element }));
```
