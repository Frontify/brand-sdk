/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactNode } from 'react';

import { type FlyoutToolbarItem, type ToolbarItem } from './Toolbar';

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
    showAttachments: boolean;
};
