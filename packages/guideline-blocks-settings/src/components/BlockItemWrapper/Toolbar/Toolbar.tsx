/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ToolbarSegment } from './ToolbarSegment';
import { AttachmentsToolbarButton } from './AttachmentsToolbarButton';
import { type ToolbarProps } from './types';
import { ToolbarButton } from './ToolbarButton';
import { DragHandleToolbarButton } from './DragHandleToolbarButton';
import { FlyoutToolbarButton } from './FlyoutToolbarButton';
import { MenuToolbarButton } from './MenuToolbarButton';

export const Toolbar = ({ items, attachments }: ToolbarProps) => (
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
            {items.map((item) => {
                if (item.type === 'dragHandle') {
                    return <DragHandleToolbarButton key={item.tooltip + item.type} {...item} />;
                }
                if (item.type === 'menu') {
                    return <MenuToolbarButton key={item.tooltip + item.type} {...item} />;
                }
                if (item.type === 'flyout') {
                    return <FlyoutToolbarButton key={item.tooltip + item.type} {...item} />;
                }
                return <ToolbarButton key={item.tooltip + item.type} {...item} />;
            })}
        </ToolbarSegment>
    </div>
);
