/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ToolbarSegment } from './ToolbarSegment';
import { AttachmentsToolbarButton } from './AttachmentsToolbarButton';
import { type ToolbarProps } from './types';
import { ToolbarButton } from './ToolbarButton';
import { DragHandleToolbarButton } from './DragHandleToolbarButton';
import { MenuToolbarButton } from './MenuToolbarButton';

export const Toolbar = ({ items, flyoutMenu, attachments }: ToolbarProps) => (
    <div
        data-test-id="block-item-wrapper-toolbar"
        className="tw-rounded-md tw-bg-base tw-border tw-border-line-strong tw-divide-x tw-divide-line-strong tw-shadow-lg tw-flex tw-flex-none tw-items-center tw-isolate"
    >
        {attachments.isEnabled && (
            <ToolbarSegment>
                <AttachmentsToolbarButton />
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
);
