/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ToolbarSegment } from './ToolbarSegment';
import { ToolbarAttachments } from './ToolbarAttachments';
import { type ToolbarProps } from './types';
import { DragPreviewContext } from './context/DragPreviewContext';
import { DragHandleToolbarButton, MenuToolbarButton, ToolbarButton } from './ToolbarButton';

export const Toolbar = ({ items, flyoutMenu, attachments, isDragging = false }: ToolbarProps) => (
    <DragPreviewContext.Provider value={isDragging}>
        <div
            data-test-id="block-item-wrapper-toolbar"
            className="tw-rounded-md tw-bg-base tw-border tw-border-line-strong tw-divide-x tw-divide-line-strong tw-shadow-lg tw-flex tw-flex-none tw-items-center tw-isolate"
        >
            {attachments.isEnabled && (
                <ToolbarSegment>
                    <ToolbarAttachments
                        isOpen={attachments.isOpen && !isDragging}
                        onOpenChange={attachments.onOpenChange}
                    />
                </ToolbarSegment>
            )}
            <ToolbarSegment>
                {items.map((item, i) =>
                    'draggableProps' in item ? (
                        <DragHandleToolbarButton key={i} {...item} />
                    ) : (
                        <ToolbarButton key={i} {...item} />
                    ),
                )}
                {flyoutMenu.items.length > 0 && <MenuToolbarButton {...flyoutMenu} />}
            </ToolbarSegment>
        </div>
    </DragPreviewContext.Provider>
);
