---
"@frontify/guideline-blocks-settings": patch
---

-   refactor (Toolbar): split Toolbar into smaller subcomponents. `ToolbarFlyoutState` type has been removed, as well as `flyoutMenu.isOpen`, `flyoutMenu.onOpenChange`, `attachments.isOpen`, `attachments.onOpenChange` props that could be passed to the `Toolbar` compnent. To control the state of open `Flyouts` the `Toolbar` must instead be wrapped in a `MultiFlyoutContextProvider`.

Migration Example:

```jsx
// Inside your component
const [flyoutIsOpen, setFlyoutIsOpen] = useState(false);
const [attachmentsIsOpen, setAttachmentsIsOpen] = useState(false);

return (
    <Toolbar
      flyoutMenu={{ isOpen: flyoutIsOpen, onOpenChange: setFlyoutIsOpen }}
      attachments={{ isOpen: attachmentsIsOpen, onOpenChange: setAttachmentsIsOpen }}
    />)
```

The above component should now be written as:

```
// Inside your component
const [openFlyoutIds, setOpenFlyoutIds] = useState([]);

return(
    <MultiFlyoutContextProvider openFlyoutIds={openFlyoutIds} setOpenFlyoutIds={setOpenFlyoutIds}>
        <Toolbar />
    <MultiFlyoutContextProvider>)
```
