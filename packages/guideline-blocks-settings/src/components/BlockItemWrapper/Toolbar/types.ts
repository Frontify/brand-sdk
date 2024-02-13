/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ToolbarButtonProps } from './ToolbarButton';
import { type ToolbarFlyoutMenuItem } from './MenuToolbarButton/ToolbarFlyoutMenu';
import { DragHandleToolbarButtonProps } from '.';

export type ToolbarProps = {
    items: ToolbarItem[];
    flyoutMenu: { items: ToolbarFlyoutMenuItem[][] };
    attachments: { isEnabled: boolean };
};

export type DraghandleToolbarItem = DragHandleToolbarButtonProps;

export type ButtonToolbarItem = ToolbarButtonProps;

export type FlyoutToolbarItem = ToolbarFlyoutMenuItem;

export type ToolbarItem = DraghandleToolbarItem | ButtonToolbarItem;
