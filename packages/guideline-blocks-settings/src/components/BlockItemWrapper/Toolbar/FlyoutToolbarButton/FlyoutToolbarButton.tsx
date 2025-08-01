/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useMemoizedId } from '@frontify/fondue';
import { Flyout } from '@frontify/fondue/components';
import { type ReactNode } from 'react';

import { BaseToolbarButton } from '../BaseToolbarButton';
import { ToolbarButtonTooltip } from '../ToolbarButtonTooltip';
import { useDragPreviewContext } from '../context/DragPreviewContext';
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
                <Flyout.Root open={isOpen && !isDragPreview} onOpenChange={onOpenChange}>
                    <Flyout.Trigger>
                        <BaseToolbarButton
                            data-test-id="block-item-wrapper-toolbar-flyout"
                            forceActiveStyle={isOpen && !isDragPreview}
                        >
                            {icon}
                        </BaseToolbarButton>
                    </Flyout.Trigger>
                    <Flyout.Content side="bottom" align="end">
                        {flyoutHeader && <Flyout.Header>{flyoutHeader}</Flyout.Header>}
                        {content}
                        {flyoutFooter && <Flyout.Footer>{flyoutFooter}</Flyout.Footer>}
                    </Flyout.Content>
                </Flyout.Root>
            </div>
        </ToolbarButtonTooltip>
    );
};
