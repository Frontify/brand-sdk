---
"@frontify/guideline-blocks-settings": patch
---

refactor: remove redundant `useMemoizedId` wrapping around `flyoutId` in `AttachmentsToolbarButton`, `FlyoutToolbarButton`, and `MenuToolbarButton`. Each component already supplies a default `flyoutId`, so the memoized id was a pass-through. Drops the `@frontify/fondue` `useMemoizedId` import from these files.
