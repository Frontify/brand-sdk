/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement, memo, useRef, useState } from 'react';

import { joinClassNames } from '../../utilities';

import { DEFAULT_MENU_BUTTON_ID, Toolbar, type ToolbarItem } from './Toolbar';
import { DragPreviewContextProvider } from './Toolbar/context/DragPreviewContext';
import { MultiFlyoutContextProvider } from './Toolbar/context/MultiFlyoutContext';
import { type BlockItemWrapperProps } from './types';

export const BlockItemWrapper = memo(
    ({
        children,
        toolbarItems,
        shouldHideWrapper,
        shouldHideComponent = false,
        isDragging = false,
        shouldFillContainer,
        outlineOffset = 0,
        shouldBeShown = false,
        showAttachments = false,
    }: BlockItemWrapperProps): ReactElement => {
        const [openFlyoutIds, setOpenFlyoutIds] = useState<string[]>(shouldBeShown ? [DEFAULT_MENU_BUTTON_ID] : []);
        const wrapperRef = useRef<HTMLDivElement>(null);

        if (shouldHideWrapper) {
            return <>{children}</>;
        }

        const items = toolbarItems?.filter((item): item is ToolbarItem => item !== undefined);

        const shouldToolbarBeVisible = openFlyoutIds.length > 0 || shouldBeShown;

        return (
            <DragPreviewContextProvider isDragPreview={isDragging}>
                <MultiFlyoutContextProvider openFlyoutIds={openFlyoutIds} setOpenFlyoutIds={setOpenFlyoutIds}>
                    <div
                        ref={wrapperRef}
                        data-test-id="block-item-wrapper"
                        style={{
                            outlineOffset,
                        }}
                        className={joinClassNames([
                            'tw-relative tw-group tw-outline-1 tw-outline-box-selected-inverse',
                            shouldFillContainer && 'tw-flex-1 tw-h-full tw-w-full',
                            'hover:tw-outline focus-within:tw-outline',
                            shouldToolbarBeVisible && 'tw-outline',
                            shouldHideComponent && 'tw-opacity-0',
                        ])}
                    >
                        <div
                            style={{
                                right: -1 - outlineOffset,
                                bottom: `calc(100% - ${2 + outlineOffset}px)`,
                            }}
                            className={joinClassNames([
                                'tw-pointer-events-none tw-absolute tw-bottom-[calc(100%-4px)] tw-right-[-3px] tw-w-full tw-opacity-0 tw-z-[60]',
                                'group-hover:tw-opacity-100 group-focus:tw-opacity-100 focus-within:tw-opacity-100',
                                'tw-flex tw-justify-end',
                                shouldToolbarBeVisible && 'tw-opacity-100',
                            ])}
                        >
                            <Toolbar
                                attachments={{
                                    isEnabled: showAttachments,
                                }}
                                items={items}
                            />
                        </div>
                        {children}
                    </div>
                </MultiFlyoutContextProvider>
            </DragPreviewContextProvider>
        );
    },
);

BlockItemWrapper.displayName = 'BlockItemWrapper';
