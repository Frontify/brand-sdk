---
"@frontify/app-bridge": minor
---

refactor: remove the color palette API

`useColorPalettes`, `AppBridgeBlock.getColorPalettesWithColors`, the `Color`, `ColorAsset`, `ColorRevision` and `ColorPalette` types, and the `ColorDummy` and `ColorPaletteDummy` test dummies from `@frontify/app-bridge/testing` are gone. Let users pick colors through the host color chooser instead:

```ts
import { openColorChooser, closeColorChooser } from "@frontify/app-bridge";

await appBridge.dispatch(openColorChooser({ element, color, onColorSelect: (color) => setColor(color) }));
// ...
await appBridge.dispatch(closeColorChooser({ element }));
```

In a block's settings flyout, the `ColorChooser` component from `@frontify/guideline-blocks-settings` does this for you.
