---
"@frontify/app-bridge": minor
---

feat: add `openLinkChooser`/`closeLinkChooser` block commands to open the in-sourced link chooser

Adds a `linkChosen` event and a `useLinkChooser` hook.

```ts
import { openLinkChooser, closeLinkChooser } from "@frontify/app-bridge";

await appBridge.dispatch(openLinkChooser({ selectedUrl: currentUrl }));
// ...
await appBridge.dispatch(closeLinkChooser());
```
