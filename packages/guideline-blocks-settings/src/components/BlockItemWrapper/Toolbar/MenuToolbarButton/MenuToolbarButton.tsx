/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useMemoizedId } from '@frontify/fondue';
import { Dropdown, Tooltip } from '@frontify/fondue/components';
import { IconDotsHorizontal } from '@frontify/fondue/icons';

import { BaseToolbarButton } from '../BaseToolbarButton';
import { useDragPreviewContext } from '../context';
import { useMultiFlyoutState } from '../hooks';

export const DEFAULT_MENU_BUTTON_ID = 'menu';

export type MenuToolbarButtonProps = {
    items: {
        title: string;
        onClick: () => void;
        icon: JSX.Element;
        style?: 'default' | 'danger';
    }[][];
    flyoutId?: string;
    tooltip?: string;
};

export const MenuToolbarButton = ({
    items,
    flyoutId = DEFAULT_MENU_BUTTON_ID,
    tooltip = 'Options',
}: MenuToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);
    const { isOpen, onOpenChange } = useMultiFlyoutState(id);
    const isDragPreview = useDragPreviewContext();

    return (
        <Dropdown.Root open={isOpen && !isDragPreview} onOpenChange={onOpenChange}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Dropdown.Trigger asChild>
                        <BaseToolbarButton data-test-id="block-item-wrapper-toolbar-flyout">
                            <IconDotsHorizontal size="16" />
                        </BaseToolbarButton>
                    </Dropdown.Trigger>
                </Tooltip.Trigger>
                <Dropdown.Content>
                    {items.map((block, blockIndex) => (
                        <Dropdown.Group key={blockIndex}>
                            {block.map((item, itemIndex) => (
                                <Dropdown.Item
                                    data-test-id="menu-item"
                                    onSelect={() => {
                                        onOpenChange(false);
                                        item.onClick();
                                    }}
                                    emphasis={item.style || 'default'}
                                    key={`${blockIndex}-${itemIndex}`}
                                >
                                    <div className="tw-mr-2">{item.icon}</div>
                                    <span>{item.title}</span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Group>
                    ))}
                </Dropdown.Content>
                <Tooltip.Content>{tooltip}</Tooltip.Content>
            </Tooltip.Root>
        </Dropdown.Root>
    );
};
