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
    /**
     * When set to true the BlockItemWrapper must be a child of a 'AttachmentsProvider' component,
     *  or the block must be wrapper with a 'withAttachments' HOC.
     * @default false
     */
    showAttachments?: boolean;
};
