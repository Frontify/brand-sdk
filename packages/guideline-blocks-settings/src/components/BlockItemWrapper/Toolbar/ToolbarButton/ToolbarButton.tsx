/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useDragPreviewContext } from '../context/DragPreviewContext';
import { BaseToolbarButton } from '../BaseToolbarButton';
import { ToolbarButtonTooltip } from '../ToolbarButtonTooltip';

export type ToolbarButtonProps = { icon: JSX.Element; tooltip?: string; onClick: () => void };

export const ToolbarButton = ({ tooltip, icon, onClick }: ToolbarButtonProps) => {
    const isDragPreview = useDragPreviewContext();

    return (
        <ToolbarButtonTooltip disabled={isDragPreview} content={tooltip ?? ''}>
            <BaseToolbarButton data-test-id="block-item-wrapper-toolbar-btn" onClick={onClick}>
                {icon}
            </BaseToolbarButton>
        </ToolbarButtonTooltip>
    );
};
