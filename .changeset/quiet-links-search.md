---
"@frontify/app-bridge": minor
---

feat(app-bridge): add the `getLinkDestinations` API method

Find the documents, library documents, pages and page headings of the guideline whose title matches a query, for example to search link targets in a rich text editor.

```ts
const destinations = await appBridge.api({ name: 'getLinkDestinations', payload: { query: 'brand' } });
```

The host must implement the handler before blocks get results.
