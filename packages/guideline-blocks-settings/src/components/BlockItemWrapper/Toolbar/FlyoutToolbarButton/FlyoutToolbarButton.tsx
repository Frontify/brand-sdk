/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type MutableRefObject, type ReactNode } from 'react';
import { useDragPreviewContext } from '../context/DragPreviewContext';
import { ToolbarButtonTooltip } from '../ToolbarButtonTooltip';
import { Flyout, FlyoutPlacement, useMemoizedId } from '@frontify/fondue';
import { BaseToolbarButton } from '../BaseToolbarButton';
import { useMultiFlyoutState } from '../hooks/useMultiFlyoutState';

export type FlyoutToolbarButtonProps = {
    content: ReactNode;
    icon: ReactNode;
    tooltip: ReactNode;
    flyoutId: string;
    flyoutFooter?: ReactNode;
    flyoutHeader?: ReactNode;
};

export const FlyoutToolbarButton = ({
    content,
    icon,
    tooltip,
    flyoutId,
    flyoutFooter,
    flyoutHeader,
}: FlyoutToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    const { isOpen, onOpenChange } = useMultiFlyoutState(id);

    const isDragPreview = useDragPreviewContext();

    return (
        <ToolbarButtonTooltip disabled={isDragPreview || isOpen} content={tooltip}>
            <div className="tw-flex tw-flex-shrink-0 tw-flex-1 tw-h-6 tw-relative">
                <Flyout
                    isOpen={isOpen && !isDragPreview}
                    legacyFooter={false}
                    fixedFooter={flyoutFooter}
                    fixedHeader={flyoutHeader}
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
                    {content}
                </Flyout>
            </div>
        </ToolbarButtonTooltip>
    );
};
