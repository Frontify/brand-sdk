---
"@frontify/guideline-blocks-settings": minor
---

feat: add `convertLegacyRichText`, `toLegacyRichText` and `toLegacyPlainText`

Convert a stored legacy rich text value (Slate JSON) to a document of the new rich text editor, and back. Each conversion result has an outcome (`exact`, `requires-review`, `unsupported`, `invalid` or `not-reversible`) and diagnostics that hold only codes and paths.

`toLegacyPlainText` reads a stored legacy value as plain text, one line per block, at any size. The caller gives the text of each mention with `mentionText`. It returns a `status` of `text` or `no-legacy-tree`.

```ts
import { convertLegacyRichText, toLegacyPlainText, toLegacyRichText } from '@frontify/guideline-blocks-settings';

const result = convertLegacyRichText(storedValue, { resolveMention });
if (result.outcome === 'exact') {
    const legacy = toLegacyRichText(result.document, { columns: 2 });
}

const plain = toLegacyPlainText(storedValue, { mentionText: (kind, id) => `@${id}` });
```
