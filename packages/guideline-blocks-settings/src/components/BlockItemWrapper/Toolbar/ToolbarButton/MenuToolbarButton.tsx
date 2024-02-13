/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconDotsHorizontal16 } from '@frontify/fondue';
import { FlyoutMenu, FlyoutMenuItem } from './FlyoutMenu';
import { FlyoutToolbarButton } from '.';

export type MenuToolbarButtonProps = {
    items: FlyoutMenuItem[][];
};

export const MenuToolbarButton = ({ items }: MenuToolbarButtonProps) => (
    <FlyoutToolbarButton icon={<IconDotsHorizontal16 />} tooltip="Options">
        <FlyoutMenu items={items} />
    </FlyoutToolbarButton>
);
