/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { joinClassNames } from '../../utilities';
import { BlockItemWrapperProps, ToolbarItem } from './types';
import { Toolbar } from '../BlockItemWrapper/Toolbar';

export const BlockItemWrapper = ({
    children,
    toolbarFlyoutItems,
    toolbarItems,
    shouldHideWrapper,
    shouldHideComponent,
    isDragging,
    shouldFillContainer,
    outlineOffset = 2,
    shouldBeShown = false,
}: PropsWithChildren<BlockItemWrapperProps>) => {
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(shouldBeShown);
    const [isFlyoutDisabled, setIsFlyoutDisabled] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isFlyoutOpen) {
            // This prevents automatic refocusing of the trigger element
            setIsFlyoutDisabled(true);
        }
    }, [isFlyoutOpen]);

    const handlePointerLeave = () => {
        if (wrapperRef.current?.contains(document.activeElement)) {
            (document.activeElement as HTMLElement).blur();
        }
    };
    const items = toolbarItems?.filter((item): item is ToolbarItem => item !== undefined);

    return (
        <div
            tabIndex={0}
            ref={wrapperRef}
            onFocus={() => setIsFlyoutDisabled(false)}
            onPointerEnter={() => setIsFlyoutDisabled(false)}
            onPointerLeave={handlePointerLeave}
            data-test-id="block-item-wrapper"
            style={{
                outlineOffset,
            }}
            className={joinClassNames([
                'tw-relative tw-group tw-outline-1 tw-outline-box-selected-inverse',
                shouldFillContainer && 'tw-flex-1 tw-h-full tw-w-full',
                !shouldHideWrapper && 'hover:tw-outline focus:tw-outline focus-within:tw-outline',
                (isFlyoutOpen || shouldBeShown) && 'tw-outline',
                shouldHideComponent && 'tw-opacity-0',
            ])}
        >
            <div
                style={{
                    right: -1 - outlineOffset,
                    bottom: `calc(100% - ${2 + outlineOffset}px)`,
                }}
                className={joinClassNames([
                    'tw-absolute tw-bottom-[calc(100%-4px)] tw-right-[-3px] tw-w-full tw-opacity-0 tw-z-10',
                    !shouldHideWrapper &&
                        'group-hover:tw-opacity-100 group-focus:tw-opacity-100 focus-within:tw-opacity-100',
                    (isFlyoutOpen || shouldBeShown) && 'tw-opacity-100',
                    shouldHideWrapper && 'tw-hidden',
                ])}
            >
                <Toolbar
                    isFlyoutOpen={isFlyoutOpen}
                    isFlyoutDisabled={isFlyoutDisabled}
                    setIsFlyoutOpen={setIsFlyoutOpen}
                    flyoutItems={toolbarFlyoutItems}
                    items={items}
                    isDragging={isDragging}
                />
            </div>
            {children}
        </div>
    );
};
