/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDotsHorizontal16, useMemoizedId } from '@frontify/fondue';
import { FlyoutMenu, FlyoutMenuItem } from './FlyoutMenu';
import { FlyoutToolbarButton } from '.';

export type MenuToolbarButtonProps = {
    items: FlyoutMenuItem[][];
    flyoutId: string;
};

export const MenuToolbarButton = ({ items, flyoutId }: MenuToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    return (
        <FlyoutToolbarButton icon={<IconDotsHorizontal16 />} tooltip="Options" flyoutId={id}>
            <FlyoutMenu items={items} flyoutId={id} />
        </FlyoutToolbarButton>
    );
};
