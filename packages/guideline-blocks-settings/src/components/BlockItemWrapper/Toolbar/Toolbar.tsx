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
import { forwardRef } from 'react';

const BaseToolbarButton = forwardRef(({ onClick, children, forceActiveStyle, ...props }, ref) => (
    <button
        data-test-id="block-item-wrapper-toolbar-btn"
        onClick={onClick}
        className={getToolbarButtonClassNames('pointer', forceActiveStyle)}
        {...props}
    >
        {children}
    </button>
));

const ToolbarButtonTooltip = ({ open, content, children, disabled }) => (
    <Tooltip
        withArrow
        hoverDelay={0}
        enterDelay={300}
        open={open}
        disabled={disabled}
        position={TooltipPosition.Top}
        content={<div>{content}</div>}
        triggerElement={children}
    />
);

BaseToolbarButton.displayName = 'BaseToolbarButton';

export const Toolbar = ({ items, flyoutMenu, attachments, isDragging }: ToolbarProps) => {
    return (
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
                        <ToolbarButtonTooltip
                            key={i}
                            open={isDragging}
                            content={
                                <div>
                                    {isDragging ? DEFAULT_DRAGGING_TOOLTIP : item.tooltip ?? DEFAULT_DRAG_TOOLTIP}
                                </div>
                            }
                        >
                            <BaseToolbarButton
                                ref={item.setActivatorNodeRef}
                                data-test-id="block-item-wrapper-toolbar-btn"
                                forceActiveStyle={isDragging}
                                {...item.draggableProps}
                            >
                                {item.icon}
                            </BaseToolbarButton>
                        </ToolbarButtonTooltip>
                    ) : (
                        <ToolbarButtonTooltip key={i} disabled={isDragging} content={item.tooltip ?? ''}>
                            <BaseToolbarButton data-test-id="block-item-wrapper-toolbar-btn" onClick={item.onClick}>
                                {item.icon}
                            </BaseToolbarButton>
                        </ToolbarButtonTooltip>
                    ),
                )}
                {flyoutMenu.items.length > 0 && (
                    <ToolbarButtonTooltip disabled={isDragging || flyoutMenu.isOpen} content="OPtions">
                        <div className="tw-flex tw-flex-shrink-0 tw-flex-1 tw-h-6 tw-relative">
                            <Flyout
                                isOpen={flyoutMenu.isOpen && !isDragging}
                                legacyFooter={false}
                                fitContent
                                hug={false}
                                onOpenChange={flyoutMenu.onOpenChange}
                                trigger={(triggerProps, triggerRef) => (
                                    <BaseToolbarButton
                                        data-test-id="block-item-wrapper-toolbar-flyout"
                                        forceActiveStyles={flyoutMenu.isOpen && !isDragging}
                                        {...triggerProps}
                                        ref={triggerRef}
                                    >
                                        <IconDotsHorizontal16 />
                                    </BaseToolbarButton>
                                )}
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
                    </ToolbarButtonTooltip>
                )}
            </ToolbarSegment>
        </div>
    );
};
