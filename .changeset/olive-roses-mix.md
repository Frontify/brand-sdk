---
"@frontify/guideline-blocks-settings": minor
---

-   feat(Toolbar): extend `items` to include `menu` and `flyout` type. Each `item` must now contain a `type` prop (`"dragHandle"`, `"button"`, `"flyout"`, `"menu"`). The `flyoutItems` prop has been removed as any item in the items array can now be a flyout. This change is also reflected in the `BlockItemWrapper`, where `toolbarFlyoutItems` has now been removed.

Migration Example:

```jsx
<Toolbar
    items={[
        {
            icon: <IconArrowMove16 />,
            draggableProps,
            setActivatorNodeRef,
        },
        {
            icon: <IconTrashBin16 />,
            tooltip: "Delete Item",
            onClick: onRemoveSelf,
        },
    ]}
    flyoutItems={[
        [
            {
                title: "Delete",
                icon: <IconTrashBin20 />,
                onClick,
            },
        ],
    ]}
/>
```

The above component should now be written as:

```jsx
<Toolbar
    items={[
        {
            type: "dragHandle",
            icon: <IconArrowMove16 />,
            draggableProps,
            setActivatorNodeRef,
        },
        {
            type: "button",
            icon: <IconTrashBin16 />,
            tooltip: "Delete Item",
            onClick: onRemoveSelf,
        },
        {
            type: "menu",
            items: [
                {
                    title: "Delete",
                    icon: <IconTrashBin20 />,
                    onClick,
                },
            ],
            flyoutId: "special-menu",
        },
    ]}
/>
```

Full "Flyout as a toolbar button" example:

```jsx
const FlyoutFooterWithCloseButton = ({ flyoutId }) => {
    // The flyout footer can close the flyout by accessing the flyout context
    const { onOpenChange } = useMultiFlyoutState(flyoutId);

    return <button onClick={() => onOpenChange(false)}>Cancel</button>;
};

const ExampleToolbar = () => {
    const [openFlyoutIds, setOpenFlyoutIds] = useState([]);

    return (
        <MultiFlyoutContextProvider
            openFlyoutIds={openFlyoutIds}
            setOpenFlyoutIds={setOpenFlyoutIds}
        >
            <Toolbar
                items={[
                    {
                        type: "flyout",
                        icon: <IconArrowMove16 />,
                        tooltip: "Move To",
                        content: <div>Content</div>,
                        flyoutHeader: <div>Fixed Header</div>,
                        flyoutFooter: (
                            <FlyoutFooterWithCloseButton flyoutId="move" />
                        ),
                        flyoutId: "move",
                    },
                ]}
            />
        </MultiFlyoutContextProvider>
    );
};
```
