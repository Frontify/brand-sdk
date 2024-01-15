/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type AttachmentsProvider, type withAttachmentsProvider } from '../../hooks/useAttachments';
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
     * When set to true the BlockItemWrapper must be a child of a {@link AttachmentsProvider} component,
     *  or the block must be wrapped with a {@link withAttachmentsProvider} HOC.
     * @default false
     */
    showAttachments?: boolean;
};
