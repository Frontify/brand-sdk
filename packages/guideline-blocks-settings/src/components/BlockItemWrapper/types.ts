/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MenuItemStyle } from '@frontify/fondue';
import type { ReactNode } from 'react';

export type BlockItemWrapperProps = {
    children: ReactNode;
    shouldHideWrapper?: boolean;
    shouldHideComponent?: boolean;
    toolbarItems: (ToolbarItem | undefined)[];
    toolbarFlyoutItems: FlyoutToolbarItem[][];
    isDragging?: boolean;
    shouldFillContainer?: boolean;
    outlineOffset?: number;
    shouldBeShown?: boolean;
};

export type ToolbarProps = {
    items: ToolbarItem[];
    flyoutItems: FlyoutToolbarItem[][];
    isFlyoutOpen: boolean;
    setIsFlyoutOpen: (isOpen: boolean) => void;
    isDragging?: boolean;
    isFlyoutDisabled?: boolean;
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

type FlyoutToolbarItem = {
    title: string;
    onClick: () => void;
    icon: JSX.Element;
    style?: MenuItemStyle;
};
