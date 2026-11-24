---
"@frontify/guideline-blocks-settings": minor
---

feat: add `convertLegacyRichText` and `toLegacyRichText`

Convert a stored legacy rich text value (Slate JSON) to a document of the new rich text editor, and back. Each result has an outcome (`exact`, `requires-review`, `unsupported`, `invalid` or `not-reversible`) and diagnostics that hold only codes and paths.

```ts
import { convertLegacyRichText, toLegacyRichText } from '@frontify/guideline-blocks-settings';

const result = convertLegacyRichText(storedValue, { resolveMention });
if (result.outcome === 'exact') {
    const legacy = toLegacyRichText(result.document, { columns: 2 });
}
```
