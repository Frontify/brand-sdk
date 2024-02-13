/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DEFAULT_DRAGGING_TOOLTIP, DEFAULT_DRAG_TOOLTIP } from '../..';
import { useDragPreviewContext } from '../context/DragPreviewContext';
import { BaseToolbarButton } from '../BaseToolbarButton';
import { ToolbarButtonTooltip } from '../ToolbarButtonTooltip';

export type DragHandleToolbarButtonProps = {
    icon: JSX.Element;
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
