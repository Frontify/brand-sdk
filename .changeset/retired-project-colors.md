---
"@frontify/app-bridge": patch
---

chore: retire the project-color methods of `AppBridgeBlock`

Frontify retired project colors in favor of Brand Essentials colors, so `createColorPalette`, `updateColorPalette`, `deleteColorPalette`, `createColor`, `updateColor`, `deleteColor`, `getColorsByColorPaletteId` and `downloadColorKit` have no effect anymore. The create and update methods reject, the delete methods resolve, `getColorsByColorPaletteId` resolves to an empty list and `downloadColorKit` returns an empty string. They will be removed in version 4.0.0 without a replacement.

Read colors with `getColorPalettesWithColors` or the `useColorPalettes` hook. The `useColors` hook is deprecated: it now reads its colors through `getColorPalettesWithColors`, and its `createColor`, `updateColor` and `deleteColor` have no effect anymore.

`colorHex` and `projectColorId` of `GuidelineSearchResult` are deprecated: Frontify retired color search results, so they are never set anymore.
