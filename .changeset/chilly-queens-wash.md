---
"@frontify/app-bridge": patch
---

### Breaking changes:

-   Split the `useDocumentPages` hook into `useCategorizedDocumentPages` and `useUncategorizedDocumentPages`

#### Usage:

##### Before

`const { getCategorizedPages, getUncategorizedPages } = useDocumentPages(appBridge)`

##### After

`const { documentPages } = useCategorizedDocumentPages(appBridge, <DOCUMENT_CATEGORY_ID>)`

`const { documentPages } = useUncategorizedDocumentPages(appBridge, <DOCUMENT_ID>)`

-   Refactor `useDocumentCategories`:
-   Removed `getSortedCategories` (documentCategories is now sorted)
-   Removed `documentPages` from `DocumentCategory`
-   Replaced `moveDocumentPageBetweenDocuments` by `moveDocumentPage`

-   Rename event handler to remove :${number} where it was set

-   Rename useGuidelineActions return functions:
    | Old Name | New Name |
    | -------------- | ---------------------- |
    | createPage | createDocumentPage |
    | updatePage | updateDocumentPage |
    | deletePage | deleteDocumentPage |
    | duplicatePage | duplicateDocumentPage |
    | createCategory | createDocumentCategory |
    | updateCategory | updateDocumentCategory |
    | deleteCategory | deleteDocumentCategory |

-   Renamed App Bridge Block and Theme `getUncategorizedPagesByDocumentId` to `getUncategorizedDocumentPagesByDocumentId`

##### Other:

-   Add return type to `moveDocumentPage` and `moveDocumentPageBetweenDocuments`

-   Test coverage for `useDocumentCategories`, `useCategorizedDocumentPages` and `useUncategorizedDocumentPages`
