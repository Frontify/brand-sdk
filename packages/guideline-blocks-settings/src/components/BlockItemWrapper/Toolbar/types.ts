/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DragHandleToolbarButtonProps, FlyoutMenuItem, ToolbarButtonProps } from './ToolbarButton';

export type ToolbarProps = {
    items: ToolbarItem[];
    flyoutMenu: ToolbarFlyoutState & { items: FlyoutMenuItem[][] };
    attachments: ToolbarFlyoutState & { isEnabled: boolean };
    isDragging?: boolean;
};

export type ToolbarFlyoutState = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export type DraghandleToolbarItem = DragHandleToolbarButtonProps;

export type ButtonToolbarItem = ToolbarButtonProps;

export type FlyoutToolbarItem = FlyoutMenuItem;

export type ToolbarItem = DraghandleToolbarItem | ButtonToolbarItem;
