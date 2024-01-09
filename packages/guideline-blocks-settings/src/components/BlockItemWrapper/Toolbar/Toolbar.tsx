/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    ActionMenu,
    Flyout,
    IconDotsHorizontal16,
    MenuItemContentSize,
    LegacyTooltip as Tooltip,
    TooltipPosition,
} from '@frontify/fondue';

import { DEFAULT_DRAGGING_TOOLTIP, DEFAULT_DRAG_TOOLTIP } from '../constants';

import { ToolbarSegment } from './ToolbarSegment';
import { ToolbarAttachments } from './ToolbarAttachments';
import { getToolbarButtonClassNames } from './helpers';
import { type ToolbarProps } from './types';

export const Toolbar = ({ items, flyoutMenu, attachments, isDragging }: ToolbarProps) => {
    return (
        <div
            data-test-id="block-item-wrapper-toolbar"
            className="tw-rounded-md tw-border tw-border-line-strong tw-divide-x tw-divide-line-strong tw-shadow-lg tw-flex tw-flex-none tw-items-center tw-bg-base tw-isolate"
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
                        <Tooltip
                            key={i}
                            withArrow
                            hoverDelay={0}
                            enterDelay={300}
                            open={isDragging}
                            position={TooltipPosition.Top}
                            content={
                                <div>
                                    {isDragging ? DEFAULT_DRAGGING_TOOLTIP : item.tooltip ?? DEFAULT_DRAG_TOOLTIP}
                                </div>
                            }
                            triggerElement={
                                <button
                                    ref={item.setActivatorNodeRef}
                                    data-test-id="block-item-wrapper-toolbar-btn"
                                    {...item.draggableProps}
                                    className={getToolbarButtonClassNames('grab', isDragging)}
                                >
                                    {item.icon}
                                </button>
                            }
                        />
                    ) : (
                        <Tooltip
                            key={i}
                            withArrow
                            enterDelay={300}
                            hoverDelay={0}
                            disabled={isDragging}
                            position={TooltipPosition.Top}
                            content={<div>{item.tooltip ?? ''}</div>}
                            triggerElement={
                                <button
                                    data-test-id="block-item-wrapper-toolbar-btn"
                                    onClick={item.onClick}
                                    className={getToolbarButtonClassNames('pointer')}
                                >
                                    {item.icon}
                                </button>
                            }
                        />
                    ),
                )}
                {flyoutMenu.items.length > 0 && (
                    <Tooltip
                        withArrow
                        hoverDelay={0}
                        enterDelay={300}
                        disabled={isDragging || flyoutMenu.isOpen}
                        position={TooltipPosition.Top}
                        content={<div>Options</div>}
                        triggerElement={
                            <div className="tw-flex tw-flex-shrink-0 tw-flex-1 tw-h-6 tw-relative">
                                <Flyout
                                    isOpen={flyoutMenu.isOpen && !isDragging}
                                    legacyFooter={false}
                                    fitContent
                                    hug={false}
                                    onOpenChange={flyoutMenu.onOpenChange}
                                    trigger={
                                        <div
                                            data-test-id="block-item-wrapper-toolbar-flyout"
                                            className={getToolbarButtonClassNames('pointer', flyoutMenu.isOpen)}
                                        >
                                            <IconDotsHorizontal16 />
                                        </div>
                                    }
                                >
                                    <ActionMenu
                                        menuBlocks={flyoutMenu.items.map((block, blockIndex) => ({
                                            id: blockIndex.toString(),
                                            menuItems: block.map((item, itemIndex) => ({
                                                id: blockIndex.toString() + itemIndex.toString(),
                                                size: MenuItemContentSize.XSmall,
                                                title: item.title,
                                                style: item.style,
                                                onClick: () => {
                                                    flyoutMenu.onOpenChange(false);
                                                    item.onClick();
                                                },
                                                initialValue: true,
                                                decorator: <div className="tw-mr-2">{item.icon}</div>,
                                            })),
                                        }))}
                                    />
                                </Flyout>
                            </div>
                        }
                    />
                )}
            </ToolbarSegment>
        </div>
    );
};
