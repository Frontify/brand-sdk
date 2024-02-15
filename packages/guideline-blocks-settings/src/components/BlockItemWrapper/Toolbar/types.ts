/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ToolbarButtonProps } from './ToolbarButton';
import { type DragHandleToolbarButtonProps } from './DragHandleToolbarButton';
import { type FlyoutToolbarButtonProps } from './FlyoutToolbarButton';
import { type MenuToolbarButtonProps } from './MenuToolbarButton';

export type ToolbarProps = {
    items: ToolbarItem[];
    attachments: { isEnabled: boolean };
};

export type DragHandleToolbarItem = { type: 'dragHandle' } & DragHandleToolbarButtonProps;
export type ButtonToolbarItem = { type: 'button' } & ToolbarButtonProps;
export type FlyoutToolbarItem = { type: 'flyout' } & FlyoutToolbarButtonProps;
export type MenuToolbarItem = { type: 'menu' } & MenuToolbarButtonProps;

export type ToolbarItem = DragHandleToolbarItem | ButtonToolbarItem | FlyoutToolbarItem | MenuToolbarItem;
