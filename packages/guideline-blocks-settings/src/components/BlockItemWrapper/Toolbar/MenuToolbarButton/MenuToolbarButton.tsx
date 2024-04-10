/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDotsHorizontal16, useMemoizedId } from '@frontify/fondue';

import { FlyoutToolbarButton } from '../FlyoutToolbarButton/FlyoutToolbarButton';

import { ToolbarFlyoutMenu, type ToolbarFlyoutMenuItem } from './ToolbarFlyoutMenu';

export const DEFAULT_MENU_BUTTON_ID = 'menu';

export type MenuToolbarButtonProps = {
    items: ToolbarFlyoutMenuItem[][];
    flyoutId?: string;
    tooltip?: string;
};

export const MenuToolbarButton = ({
    items,
    flyoutId = DEFAULT_MENU_BUTTON_ID,
    tooltip = 'Options',
}: MenuToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    return (
        <FlyoutToolbarButton
            icon={<IconDotsHorizontal16 />}
            tooltip={tooltip}
            flyoutId={id}
            content={<ToolbarFlyoutMenu items={items} flyoutId={id} />}
        />
    );
};
