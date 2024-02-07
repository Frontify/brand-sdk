---
"@frontify/guideline-blocks-settings": minor
---

refactor(LinkSelector): Removed `appBridge` prop in favor of directly passing document handling functions: `getAllDocuments`, `getDocumentPagesByDocumentId`, and `getDocumentSectionsByDocumentPageId` for clearer API and enhanced modularity

Replace this:

```jsx
<LinkSelector
    url={url}
    appBridge={appBridge}
    onUrlChange={onUrlChange}
    buttonSize={buttonSize ?? ButtonSize.Medium}
/>
```

with:

```jsx
<LinkSelector
    url={url}
    onUrlChange={onUrlChange}
    buttonSize={buttonSize ?? ButtonSize.Medium}
    getAllDocuments={appBridge.getAllDocuments}
    getDocumentPagesByDocumentId={appBridge.getDocumentPagesByDocumentId}
    getDocumentSectionsByDocumentPageId={
        appBridge.getDocumentSectionsByDocumentPageId
    }
/>
```
