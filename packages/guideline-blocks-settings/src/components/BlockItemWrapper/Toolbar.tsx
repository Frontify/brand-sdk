/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    ActionMenu,
    FOCUS_VISIBLE_STYLE,
    Flyout,
    IconDotsHorizontal16,
    MenuItemContentSize,
    LegacyTooltip as Tooltip,
    TooltipPosition,
} from '@frontify/fondue';
import { ReactNode } from 'react';
import { FlyoutState, ToolbarProps } from './types';
import { joinClassNames } from '../../utilities';
import { DEFAULT_DRAGGING_TOOLTIP, DEFAULT_DRAG_TOOLTIP } from './constants';
import { Attachments } from '..';
import { useAttachmentsContext } from '../../hooks/useAttachments';

export const SHARED_TOOLBAR_BUTTON_CLASSES =
    'tw-bg-base tw-relative tw-inline-flex tw-items-center tw-justify-center tw-min-w-[24px] tw-h-6 tw-rounded focus-visible:tw-z-10';

const AttachmentsToolbarTrigger = ({ children }: { children: ReactNode }) => (
    <div
        className={joinClassNames([
            'tw-flex tw-text-xs tw-font-medium tw-gap-0.5 hover:tw-bg-box-neutral-hover active:tw-bg-box-neutral-pressed tw-p-1',
            SHARED_TOOLBAR_BUTTON_CLASSES,
        ])}
    >
        {children}
    </div>
);

const ToolbarButtonSegment = ({ children }: { children: ReactNode }) => (
    <div className="tw-pointer-events-auto tw-flex tw-flex-shrink-0 tw-gap-px tw-px-px tw-h-[26px] tw-items-center tw-self-start">
        {children}
    </div>
);

const ToolbarAttachments = ({ isOpen, onOpenChange }: FlyoutState) => {
    const { appBridge, attachments, onAddAttachments, onAttachmentDelete, onAttachmentReplace, onAttachmentsSorted } =
        useAttachmentsContext();

    return (
        <Attachments
            onUpload={onAddAttachments}
            onDelete={onAttachmentDelete}
            onReplaceWithBrowse={onAttachmentReplace}
            onReplaceWithUpload={onAttachmentReplace}
            onSorted={onAttachmentsSorted}
            onBrowse={onAddAttachments}
            items={attachments}
            appBridge={appBridge}
            triggerComponent={AttachmentsToolbarTrigger}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        />
    );
};

export const Toolbar = ({ items, flyoutMenu, attachments, isDragging }: ToolbarProps) => {
    return (
        <div
            data-test-id="block-item-wrapper-toolbar"
            className="tw-rounded-md tw-border tw-border-line-strong tw-divide-x tw-divide-line-strong tw-shadow-lg tw-flex tw-flex-none tw-items-center tw-bg-base tw-text-box-neutral-strong tw-isolate"
        >
            {attachments.enabled && (
                <ToolbarButtonSegment>
                    <ToolbarAttachments
                        isOpen={attachments.isOpen && !isDragging}
                        onOpenChange={attachments.onOpenChange}
                    />
                </ToolbarButtonSegment>
            )}
            <ToolbarButtonSegment>
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
                                    className={joinClassNames([
                                        FOCUS_VISIBLE_STYLE,
                                        SHARED_TOOLBAR_BUTTON_CLASSES,
                                        'focus-visible:tw-z-10',
                                        isDragging
                                            ? 'tw-cursor-grabbing tw-bg-box-neutral-pressed'
                                            : 'tw-cursor-grab hover:tw-bg-box-neutral-hover',
                                    ])}
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
                                    className={joinClassNames([
                                        'hover:tw-bg-box-neutral-hover active:tw-bg-box-neutral-pressed tw-cursor-pointer',
                                        FOCUS_VISIBLE_STYLE,
                                        SHARED_TOOLBAR_BUTTON_CLASSES,
                                    ])}
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
                                            className={joinClassNames([
                                                'hover:tw-bg-box-neutral-hover active:tw-bg-box-neutral-pressed tw-cursor-pointer',
                                                SHARED_TOOLBAR_BUTTON_CLASSES,
                                            ])}
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
            </ToolbarButtonSegment>
        </div>
    );
};
