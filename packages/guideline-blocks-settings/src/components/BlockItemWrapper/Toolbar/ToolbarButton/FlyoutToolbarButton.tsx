/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MutableRefObject, ReactNode } from 'react';
import { useIsDragPreview } from '../context/DragPreviewContext';
import { ToolbarButtonTooltip } from './ToolbarButtonTooltip';
import { Flyout, FlyoutPlacement, useMemoizedId } from '@frontify/fondue';
import { BaseToolbarButton } from './BaseToolbarButton';
import { useToolbarFlyoutState } from '../hooks/useToolbarFlyoutState';

export type FlyoutToolbarButtonProps = {
    children: ReactNode;
    icon: ReactNode;
    tooltip: ReactNode;
    flyoutId: string;
};

export const FlyoutToolbarButton = ({ children, icon, tooltip, flyoutId }: FlyoutToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    const { isOpen, onOpenChange } = useToolbarFlyoutState(id);

    const isDragPreview = useIsDragPreview();

    return (
        <ToolbarButtonTooltip disabled={isDragPreview || isOpen} content={tooltip}>
            <div className="tw-flex tw-flex-shrink-0 tw-flex-1 tw-h-6 tw-relative">
                <Flyout
                    isOpen={isOpen && !isDragPreview}
                    legacyFooter={false}
                    fitContent
                    hug={false}
                    placement={FlyoutPlacement.BottomRight}
                    onOpenChange={onOpenChange}
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
    );
};
