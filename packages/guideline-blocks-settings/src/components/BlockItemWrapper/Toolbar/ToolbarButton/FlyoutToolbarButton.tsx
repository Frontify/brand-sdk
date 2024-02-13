/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MutableRefObject, ReactNode, useState } from 'react';
import { useIsDragPreview } from '../context/DragPreviewContext';
import { FlyoutCloseContext } from '../context/FlyoutCloseContext';
import { ToolbarButtonTooltip } from './ToolbarButtonTooltip';
import { Flyout, FlyoutPlacement } from '@frontify/fondue';
import { BaseToolbarButton } from './BaseToolbarButton';

export type FlyoutToolbarButtonProps = {
    children: ReactNode;
    icon: ReactNode;
    tooltip: ReactNode;
};

export const FlyoutToolbarButton = ({ children, icon, tooltip }: FlyoutToolbarButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const isDragPreview = useIsDragPreview();

    return (
        <FlyoutCloseContext.Provider value={() => setIsOpen(false)}>
            <ToolbarButtonTooltip disabled={isDragPreview || isOpen} content={tooltip}>
                <div className="tw-flex tw-flex-shrink-0 tw-flex-1 tw-h-6 tw-relative">
                    <Flyout
                        isOpen={isOpen && !isDragPreview}
                        legacyFooter={false}
                        fitContent
                        hug={false}
                        placement={FlyoutPlacement.BottomRight}
                        onOpenChange={setIsOpen}
                        trigger={(triggerProps, triggerRef) => (
                            <BaseToolbarButton
                                data-test-id="block-item-wrapper-toolbar-flyout"
                                forceActiveStyle={isOpen && !isDragPreview}
                                {...triggerProps}
                                ref={triggerRef as MutableRefObject<HTMLButtonElement>}
                            >
                                {icon}
                            </BaseToolbarButton>
                        )}
                    >
                        {children}
                    </Flyout>
                </div>
            </ToolbarButtonTooltip>
        </FlyoutCloseContext.Provider>
    );
};
