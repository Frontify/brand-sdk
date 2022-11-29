/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DropdownSize as DropdownSizeFondue } from '@frontify/fondue';
import type { ChoicesType } from './choices';

export type DropdownSize = DropdownSizeFondue;

export type DropdownBlock<AppBridge> = {
    type: 'dropdown';
    disabled?: boolean;
    placeholder?: string;
    size?: DropdownSize;
} & ChoicesType<AppBridge>;
