/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDotsHorizontal16, useMemoizedId } from '@frontify/fondue';
import { ToolbarFlyoutMenu, ToolbarFlyoutMenuItem } from '../ToolbarFlyoutMenu';
import { FlyoutToolbarButton } from './FlyoutToolbarButton';

export type MenuToolbarButtonProps = {
    items: ToolbarFlyoutMenuItem[][];
    flyoutId: string;
};

export const MenuToolbarButton = ({ items, flyoutId }: MenuToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    return (
        <FlyoutToolbarButton icon={<IconDotsHorizontal16 />} tooltip="Options" flyoutId={id}>
            <ToolbarFlyoutMenu items={items} flyoutId={id} />
        </FlyoutToolbarButton>
    );
};
