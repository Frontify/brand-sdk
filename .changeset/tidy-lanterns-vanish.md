---
"@frontify/app-bridge": major
---

refactor: remove the unused types, hooks and test dummies

Nothing in the package, in Frontify, or in the guideline blocks referenced these, and they have no replacement:

- The `useAfterInsertion` and `useTemplateChooser` hooks. Dispatch `openTemplateChooser` and `closeTemplateChooser` directly for the chooser.
- The `DispatchPayload` and `DispatchHandler` types, a stale copy of the command registry, and the `Subscription` and `SubscriptionCallback` types, a stale copy of the event registry.
- The `TerrificComponent`, `AssetChooserAssetChosenCallback` and `TemplateChooserTemplateChosenCallback` types.
- The `UseFileInputInterface` and `UseFileInputReturnTypes` types. `useFileInput` itself is unchanged.
- The `compareObjects` helper, and `isObject`, which is now internal.
- The `AssetChooserOptionsDummy` and `AssetChooserResultDummy` dummies from `@frontify/app-bridge/testing`.
