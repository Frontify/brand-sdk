/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ActionMenu, MenuItemContentSize, type MenuItemStyle } from '@frontify/fondue';

import { useMultiFlyoutState } from '../hooks/useMultiFlyoutState';

export type ToolbarFlyoutMenuItem = {
    title: string;
    onClick: () => void;
    icon: JSX.Element;
    style?: MenuItemStyle;
};

export type ToolbarFlyoutMenuProps = {
    items: ToolbarFlyoutMenuItem[][];
    flyoutId: string;
};

export const ToolbarFlyoutMenu = ({ items, flyoutId }: ToolbarFlyoutMenuProps) => {
    const { onOpenChange } = useMultiFlyoutState(flyoutId);

    return (
        <ActionMenu
            menuBlocks={items.map((block, blockIndex) => ({
                id: blockIndex.toString(),
                menuItems: block.map((item, itemIndex) => ({
                    id: blockIndex.toString() + itemIndex.toString(),
                    size: MenuItemContentSize.XSmall,
                    title: item.title,
                    style: item.style,
                    onClick: () => {
                        onOpenChange(false);
                        item.onClick();
                    },
                    initialValue: true,
                    decorator: <div className="tw-mr-2">{item.icon}</div>,
                })),
            }))}
        />
    );
};
