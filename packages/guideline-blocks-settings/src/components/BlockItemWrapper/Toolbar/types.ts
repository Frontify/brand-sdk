/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DragHandleToolbarButtonProps, type ToolbarButtonProps } from './ToolbarButton';
import { type ToolbarFlyoutMenuItem } from './MenuToolbarButton/ToolbarFlyoutMenu';

export type ToolbarProps = {
    items: ToolbarItem[];
    flyoutMenu: { items: ToolbarFlyoutMenuItem[][] };
    attachments: { isEnabled: boolean };
    isDragging?: boolean;
};

export type ToolbarFlyoutState = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export type DraghandleToolbarItem = DragHandleToolbarButtonProps;

export type ButtonToolbarItem = ToolbarButtonProps;

export type FlyoutToolbarItem = ToolbarFlyoutMenuItem;

export type ToolbarItem = DraghandleToolbarItem | ButtonToolbarItem;
