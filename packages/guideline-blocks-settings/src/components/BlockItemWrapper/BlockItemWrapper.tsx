/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ReactElement, useEffect, useRef, useState } from 'react';
import { joinClassNames } from '../../utilities';
import { Toolbar } from './Toolbar';
import { BlockItemWrapperProps, ToolbarItem } from './types';

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
}: BlockItemWrapperProps): ReactElement => {
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(shouldBeShown);
    const [isFlyoutDisabled, setIsFlyoutDisabled] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isFlyoutOpen) {
            // This prevents automatic refocusing of the trigger element
            setIsFlyoutDisabled(true);
        }
    }, [isFlyoutOpen]);

    if (shouldHideWrapper) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
    }

    const items = toolbarItems?.filter((item): item is ToolbarItem => item !== undefined);

    return (
        <div
            ref={wrapperRef}
            onFocus={() => setIsFlyoutDisabled(false)}
            onPointerEnter={() => setIsFlyoutDisabled(false)}
            data-test-id="block-item-wrapper"
            style={{
                outlineOffset,
            }}
            className={joinClassNames([
                'tw-relative tw-group tw-outline-1 tw-outline-box-selected-inverse',
                shouldFillContainer && 'tw-flex-1 tw-h-full tw-w-full',
                'hover:tw-outline focus-within:tw-outline',
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
                    'tw-pointer-events-none tw-absolute tw-bottom-[calc(100%-4px)] tw-right-[-3px] tw-w-full tw-opacity-0 tw-z-[60]',
                    'group-hover:tw-opacity-100 group-focus:tw-opacity-100 focus-within:tw-opacity-100',
                    (isFlyoutOpen || shouldBeShown) && 'tw-opacity-100',
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
