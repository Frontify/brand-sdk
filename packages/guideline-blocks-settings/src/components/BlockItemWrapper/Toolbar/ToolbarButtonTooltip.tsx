/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Tooltip } from '@frontify/fondue/components';
import { type ReactElement, type ReactNode } from 'react';

type ToolbarButtonTooltipProps = {
    content: ReactNode;
    children: ReactElement;
    open?: boolean;
    disabled?: boolean;
};

export const ToolbarButtonTooltip = ({ content, children, open, disabled }: ToolbarButtonTooltipProps) => {
    return disabled ? (
        children
    ) : (
        <Tooltip.Root enterDelay={300} open={open}>
            <Tooltip.Trigger>{children}</Tooltip.Trigger>
            <Tooltip.Content side="top">
                <div>{content}</div>
            </Tooltip.Content>
        </Tooltip.Root>
    );
};
