---
"@frontify/guideline-blocks-settings": major
---

refactor: remove the unused `isDark` and `getReadableColor` color utilities and stop exporting `toShortRgba`

None of these were used by Frontify's own blocks. If your block still uses them, call `@ctrl/tinycolor` directly with a color string from `toRgbaString`:

```ts
import { TinyColor, readability } from '@ctrl/tinycolor';
import { toRgbaString } from '@frontify/guideline-blocks-settings';

// isDark(color)
const dark = new TinyColor(toRgbaString(color)).isDark();

// getReadableColor(textColor, backgroundColor) darkened the text color until the contrast was at least 4.5
const contrast = readability(toRgbaString(textColor), toRgbaString(backgroundColor));
```

`toShortRgba` mapped `{ red, green, blue, alpha }` to `{ r, g, b, a }`. The other color utilities still accept the long format.
