---
"@frontify/guideline-blocks-settings": minor
---

-   Toolbar design updated
-   Add Attachments to the Toolbar component. `isFlyoutOpen`, `setIsFlyoutOpen` and `flyoutItems` props have been removed from the Toolbar and replaced
    with a `flyoutMenu` object (`{ items: FlyoutItem[]; isOpen: boolean; onOpenChange: (isOpen: boolean)=>void }`).
    `isFlyoutDisabled` prop has been removed.
    `attachments` prop has been added (`{ isEnabled: boolean; isOpen: boolean; onOpenChange: (isOpen: boolean)=>void }`).
    To enable block attachments in the Toolbar from the `BlockWrapper` component, set `showAttachments` to `true` and wrap the block in the `withAttachments` HOC or alternatively, wrap the `BlockWrapper` in an `AttachmentsProvider`.
