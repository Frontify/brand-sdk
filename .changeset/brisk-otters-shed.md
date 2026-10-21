---
"@frontify/app-bridge": major
---

perf: stop enabling Immer's `MapSet` plugin on import

`@frontify/app-bridge` no longer depends on `immer` and no longer calls `enableMapSet()` when it's imported. Blocks that don't use Immer themselves no longer ship it, which saves about 11 KB minified.

If your code uses Immer with `Map` or `Set`, enable the plugin yourself:

```ts
import { enableMapSet } from 'immer';

enableMapSet();
```
