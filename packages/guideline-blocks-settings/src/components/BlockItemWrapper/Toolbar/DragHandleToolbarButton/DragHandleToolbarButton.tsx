/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useDndContext } from '@dnd-kit/core';
import { type ReactNode } from 'react';

import { DEFAULT_DRAGGING_TOOLTIP, DEFAULT_DRAG_TOOLTIP } from '../../constants';
import { BaseToolbarButton } from '../BaseToolbarButton';
import { useDragPreviewContext } from '../context/DragPreviewContext';
import { ToolbarButtonTooltip } from '../ToolbarButtonTooltip';

export type DragHandleToolbarButtonProps = {
    icon?: ReactNode;
    tooltip?: string;
    draggableProps: Record<string, unknown>;
    setActivatorNodeRef?: (node: HTMLElement | null) => void;
};

export const DragHandleToolbarButton = ({
    tooltip,
    icon,
    setActivatorNodeRef,
    draggableProps,
}: DragHandleToolbarButtonProps) => {
    const isDragPreview = useDragPreviewContext();
    const { activatorEvent } = useDndContext();
    const activatedByKeyboard = activatorEvent instanceof KeyboardEvent;

    return (
        <ToolbarButtonTooltip
            {...(isDragPreview && { open: activatedByKeyboard })}
            content={<div>{isDragPreview ? DEFAULT_DRAGGING_TOOLTIP : (tooltip ?? DEFAULT_DRAG_TOOLTIP)}</div>}
        >
            <BaseToolbarButton
                ref={setActivatorNodeRef}
                data-test-id="block-item-wrapper-toolbar-btn"
                forceActiveStyle={isDragPreview}
                cursor="grab"
                {...draggableProps}
            >
                {icon}
            </BaseToolbarButton>
        </ToolbarButtonTooltip>
    );
};
