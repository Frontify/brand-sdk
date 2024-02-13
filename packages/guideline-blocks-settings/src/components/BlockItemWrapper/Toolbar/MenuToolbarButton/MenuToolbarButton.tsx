/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDotsHorizontal16, useMemoizedId } from '@frontify/fondue';
import { ToolbarFlyoutMenu, ToolbarFlyoutMenuItem } from './ToolbarFlyoutMenu';
import { FlyoutToolbarButton } from '../FlyoutToolbarButton/FlyoutToolbarButton';

export const DEFAULT_MENU_BUTTON_ID = 'menu';

export type MenuToolbarButtonProps = {
    items: ToolbarFlyoutMenuItem[][];
    flyoutId?: string;
};

export const MenuToolbarButton = ({ items, flyoutId = DEFAULT_MENU_BUTTON_ID }: MenuToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    return (
        <FlyoutToolbarButton icon={<IconDotsHorizontal16 />} tooltip="Options" flyoutId={id}>
            <ToolbarFlyoutMenu items={items} flyoutId={id} />
        </FlyoutToolbarButton>
    );
};
