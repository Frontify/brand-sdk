---
"@frontify/guideline-blocks-settings": patch
---

-   refactor (Toolbar): split Toolbar into smaller subcomponents. `ToolbarFlyoutState` type has been removed, as well as `flyoutMenu.isOpen`, `flyoutMenu.onOpenChange`, `attachments.isOpen`, `attachments.onOpenChange` props that could be passed to the `Toolbar` compnent. To control the state of open `Flyouts` the `Toolbar` must instead be wrapped in a `MultiFlyoutContext.Provider`.
