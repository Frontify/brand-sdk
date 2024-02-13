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
import {
    BaseToolbarButtonProps,
    ButtonToolbarItem,
    DraghandleToolbarItem,
    type ToolbarButtonTooltipProps,
    type ToolbarProps,
} from './types';
import { MutableRefObject, createContext, forwardRef, useContext } from 'react';

const BaseToolbarButton = forwardRef<HTMLButtonElement, BaseToolbarButtonProps>(
    ({ onClick, children, forceActiveStyle, ...props }, ref) => (
        <button
            data-test-id="block-item-wrapper-toolbar-btn"
            onClick={onClick}
            className={getToolbarButtonClassNames('pointer', forceActiveStyle)}
            {...props}
            ref={ref}
        >
            {children}
        </button>
    ),
);

const ToolbarButtonTooltip = ({ open, content, children, disabled }: ToolbarButtonTooltipProps) => (
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

const DraggableToolbarButton = ({ tooltip, icon, setActivatorNodeRef, draggableProps }: DraghandleToolbarItem) => {
    const isDragPreview = useIsDragPreview();

    return (
        <ToolbarButtonTooltip
            open={isDragPreview}
            content={<div>{isDragPreview ? DEFAULT_DRAGGING_TOOLTIP : tooltip ?? DEFAULT_DRAG_TOOLTIP}</div>}
        >
            <BaseToolbarButton
                ref={setActivatorNodeRef}
                data-test-id="block-item-wrapper-toolbar-btn"
                forceActiveStyle={isDragPreview}
                {...draggableProps}
            >
                {icon}
            </BaseToolbarButton>
        </ToolbarButtonTooltip>
    );
};
const ToolbarButton = ({ tooltip, icon, onClick }: ButtonToolbarItem) => {
    const isDragPreview = useIsDragPreview();

    return (
        <ToolbarButtonTooltip disabled={isDragPreview} content={tooltip ?? ''}>
            <BaseToolbarButton data-test-id="block-item-wrapper-toolbar-btn" onClick={onClick}>
                {icon}
            </BaseToolbarButton>
        </ToolbarButtonTooltip>
    );
};

BaseToolbarButton.displayName = 'BaseToolbarButton';

const DragPreviewContext = createContext(false);

const useIsDragPreview = () => useContext(DragPreviewContext);

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
                        <DraggableToolbarButton key={i} {...item} />
                    ) : (
                        <ToolbarButton key={i} {...item} />
                    ),
                )}
                {flyoutMenu.items.length > 0 && (
                    <ToolbarButtonTooltip disabled={isDragging || flyoutMenu.isOpen} content="Options">
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
                                        forceActiveStyle={flyoutMenu.isOpen && !isDragging}
                                        {...triggerProps}
                                        ref={triggerRef as MutableRefObject<HTMLButtonElement>}
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
    </DragPreviewContext.Provider>
);
