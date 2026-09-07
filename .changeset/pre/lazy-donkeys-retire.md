---
"@frontify/app-bridge": major
---

refactor: remove deprecated document methods and types from `AppBridgeBlock`

Removed the `getAllDocuments`, `getDocumentPagesByDocumentId`, and `getDocumentSectionsByDocumentPageId` methods, along with the now-unused `Document`, `DocumentPage`, `DocumentSection`, and `Targets` types and their test dummies (`TargetsDummy`, `TargetsApiDummy`, `DocumentSectionDummy`, `DocumentSectionApiDummy`). There is no replacement — Link Chooser is being in-sourced and will be opened via a command instead.
