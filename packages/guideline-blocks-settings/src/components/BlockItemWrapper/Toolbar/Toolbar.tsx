/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AttachmentsToolbarButton } from './AttachmentsToolbarButton';
import { DragHandleToolbarButton } from './DragHandleToolbarButton';
import { FlyoutToolbarButton } from './FlyoutToolbarButton';
import { MenuToolbarButton } from './MenuToolbarButton';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSegment } from './ToolbarSegment';
import { type ToolbarProps } from './types';

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
        {items.length > 0 && (
            <ToolbarSegment>
                {items.map((item) => {
                    switch (item.type) {
                        case 'dragHandle':
                            return <DragHandleToolbarButton key={item.tooltip + item.type} {...item} />;
                        case 'menu':
                            return <MenuToolbarButton key={item.tooltip + item.type} {...item} />;
                        case 'flyout':
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
                            return <FlyoutToolbarButton key={item.tooltip + item.type} {...item} />;
                        default:
                            return <ToolbarButton key={item.tooltip + item.type} {...item} />;
                    }
                })}
            </ToolbarSegment>
        )}
    </div>
);
