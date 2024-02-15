/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ToolbarButtonProps } from './ToolbarButton';
import { type DragHandleToolbarButtonProps } from './DragHandleToolbarButton';
import { type FlyoutToolbarButtonProps } from './FlyoutToolbarButton';
import { type MenuToolbarButtonProps } from './MenuToolbarButton';

export type ToolbarProps = {
    items: ToolbarItem[];
    attachments: { isEnabled: boolean };
};

export type ToolbarItem =
    | ({ type: 'dragHandle' } & DragHandleToolbarButtonProps)
    | ({ type: 'button' } & ToolbarButtonProps)
    | ({ type: 'flyout' } & FlyoutToolbarButtonProps)
    | ({ type: 'menu' } & MenuToolbarButtonProps);
