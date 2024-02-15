/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ReactNode } from 'react';
import { DEFAULT_DRAGGING_TOOLTIP, DEFAULT_DRAG_TOOLTIP } from '../../constants';
import { useDragPreviewContext } from '../context/DragPreviewContext';
import { BaseToolbarButton } from '../BaseToolbarButton';
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

    return (
        <ToolbarButtonTooltip
            open={isDragPreview}
            content={<div>{isDragPreview ? DEFAULT_DRAGGING_TOOLTIP : tooltip ?? DEFAULT_DRAG_TOOLTIP}</div>}
        >
            <BaseToolbarButton
                ref={setActivatorNodeRef}
                data-test-id="drag-handle-toolbar-button"
                forceActiveStyle={isDragPreview}
                cursor="grab"
                {...draggableProps}
            >
                {icon}
            </BaseToolbarButton>
        </ToolbarButtonTooltip>
    );
};
