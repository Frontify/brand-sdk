/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DropdownSize } from '.';
import type { ChoicesType } from './choices';

export type DropdownBlock<AppBridge> = {
    type: 'dropdown';
    disabled?: boolean;
    placeholder?: string;
    size?: DropdownSize;
} & ChoicesType<AppBridge>;
