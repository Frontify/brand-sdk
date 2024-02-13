/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement, useRef, useState } from 'react';

import { joinClassNames } from '../../utilities';

import { Toolbar, type ToolbarItem } from './Toolbar';
import { type BlockItemWrapperProps } from './types';

export const BlockItemWrapper = ({
    children,
    toolbarFlyoutItems,
    toolbarItems,
    shouldHideWrapper,
    shouldHideComponent = false,
    isDragging,
    shouldFillContainer,
    outlineOffset = 2,
    shouldBeShown = false,
    showAttachments = false,
}: BlockItemWrapperProps): ReactElement => {
    const [isMenuFlyoutOpen, setIsMenuFlyoutOpen] = useState(shouldBeShown);
    const [isAttachmentFlyoutOpen, setIsAttachmentFlyoutOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    if (shouldHideWrapper) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
    }

    const items = toolbarItems?.filter((item): item is ToolbarItem => item !== undefined);

    const shouldToolbarBeVisible = isMenuFlyoutOpen || isAttachmentFlyoutOpen || shouldBeShown;

    return (
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
                    'tw-flex tw-justify-end has-[.toolbar-button-active]:tw-opacity-100 has-[:active]:tw-opacity-100',
                    //shouldToolbarBeVisible && 'tw-opacity-100',
                ])}
            >
                <Toolbar
                    flyoutMenu={{
                        items: toolbarFlyoutItems,
                        isOpen: isMenuFlyoutOpen,
                        onOpenChange: setIsMenuFlyoutOpen,
                    }}
                    attachments={{
                        isEnabled: showAttachments,
                        isOpen: isAttachmentFlyoutOpen,
                        onOpenChange: setIsAttachmentFlyoutOpen,
                    }}
                    items={items}
                    isDragging={isDragging}
                />
            </div>
            {children}
        </div>
    );
};
