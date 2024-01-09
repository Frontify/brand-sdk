/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type MenuItemStyle } from '@frontify/fondue';

export type ToolbarProps = {
    items: ToolbarItem[];
    flyoutMenu: ToolbarFlyoutState & { items: FlyoutToolbarItem[][] };
    attachments: ToolbarFlyoutState & { isEnabled: boolean };
    isDragging?: boolean;
};

export type ToolbarFlyoutState = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

type BaseToolbarItem = {
    icon: JSX.Element;
    tooltip?: string;
};

type DraghandleToolbarItem = BaseToolbarItem & {
    draggableProps: Record<string, unknown>;
    setActivatorNodeRef?: (node: HTMLElement | null) => void;
};

type ButtonToolbarItem = BaseToolbarItem & {
    onClick: () => void;
};

export type ToolbarItem = DraghandleToolbarItem | ButtonToolbarItem;

export type FlyoutToolbarItem = {
    title: string;
    onClick: () => void;
    icon: JSX.Element;
    style?: MenuItemStyle;
};
