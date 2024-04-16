/* (c) Copyright Frontify Ltd., all rights reserved. */

import { LegacyTooltip as Tooltip, TooltipPosition } from '@frontify/fondue';
import { type ReactElement, type ReactNode } from 'react';

type ToolbarButtonTooltipProps = {
    content: ReactNode;
    children: ReactElement;
    open?: boolean;
    disabled?: boolean;
};

export const ToolbarButtonTooltip = ({ open, content, children, disabled }: ToolbarButtonTooltipProps) => (
    <Tooltip
        withArrow
        hoverDelay={0}
        enterDelay={300}
        open={open}
        disabled={disabled}
        position={TooltipPosition.Top}
        content={<div>{content}</div>}
        triggerElement={children}
        data-test-id="toolbar-button-tooltip"
    />
);
