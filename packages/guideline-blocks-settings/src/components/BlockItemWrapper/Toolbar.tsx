/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    ActionMenu,
    Flyout,
    IconDotsHorizontal16,
    MenuItemContentSize,
    Tooltip,
    TooltipPosition,
} from '@frontify/fondue';
import { ToolbarProps } from './types';
import { joinClassNames } from '../../utilities';

export const Toolbar = ({
    items,
    flyoutItems,
    isFlyoutOpen,
    setIsFlyoutOpen,
    isDragging,
    isFlyoutDisabled,
}: ToolbarProps) => {
    return (
        <div data-test-id="block-item-wrapper-toolbar" className="tw-flex tw-justify-end">
            <div className="tw-bg-white tw-text-box-selected-inverse tw-flex tw-flex-shrink-0 tw-gap-[2px] tw-px-[1px] tw-spacing tw-items-center tw-h-7 tw-self-start tw-border tw-border-box-selected-inverse tw-rounded">
                {items.map((item, i) =>
                    'draggableProps' in item ? (
                        <Tooltip
                            key={i}
                            withArrow
                            hoverDelay={0}
                            enterDelay={300}
                            disabled={isDragging}
                            position={TooltipPosition.Top}
                            content={<div>{item.tooltip}</div>}
                            triggerElement={
                                <button
                                    data-test-id="block-item-wrapper-toolbar-btn"
                                    {...item.draggableProps}
                                    className={joinClassNames([
                                        'tw-bg-base tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-rounded-sm',
                                        isDragging
                                            ? 'tw-cursor-grabbing hover:tw-bg-box-selected-pressed'
                                            : 'tw-cursor-grab hover:tw-bg-box-selected-hover',
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
                            content={<div>{item.tooltip}</div>}
                            triggerElement={
                                <button
                                    data-test-id="block-item-wrapper-toolbar-btn"
                                    onClick={item.onClick}
                                    className="tw-bg-base hover:tw-bg-box-selected-hover active:tw-bg-box-selected-pressed tw-cursor-pointer tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-rounded-sm"
                                >
                                    {item.icon}
                                </button>
                            }
                        />
                    )
                )}
                {flyoutItems.length > 0 && (
                    <div className="tw-flex tw-flex-shrink-0 tw-flex-1 tw-h-6">
                        <Flyout
                            isOpen={isFlyoutOpen}
                            isTriggerDisabled={isFlyoutDisabled}
                            legacyFooter={false}
                            fitContent
                            hug={false}
                            onOpenChange={setIsFlyoutOpen}
                            trigger={
                                <Tooltip
                                    withArrow
                                    hoverDelay={0}
                                    enterDelay={300}
                                    disabled={isDragging}
                                    position={TooltipPosition.Top}
                                    content={<div>Options</div>}
                                    triggerElement={
                                        <div
                                            data-test-id="block-item-wrapper-toolbar-flyout"
                                            className="tw-bg-base hover:tw-bg-box-selected-hover active:tw-bg-box-selected-pressed tw-cursor-pointer tw-inline-flex  tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-rounded-sm"
                                        >
                                            <IconDotsHorizontal16 />
                                        </div>
                                    }
                                />
                            }
                        >
                            <ActionMenu
                                menuBlocks={flyoutItems.map((block, blockIndex) => ({
                                    id: blockIndex.toString(),
                                    menuItems: block.map((item, itemIndex) => ({
                                        id: blockIndex.toString() + itemIndex.toString(),
                                        size: MenuItemContentSize.XSmall,
                                        title: item.title,
                                        style: item.style,
                                        onClick: () => {
                                            setIsFlyoutOpen(false);
                                            item.onClick();
                                        },
                                        initialValue: true,
                                        decorator: <div className="tw-mr-2">{item.icon}</div>,
                                    })),
                                }))}
                            />
                        </Flyout>
                    </div>
                )}
            </div>
        </div>
    );
};
