/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Bundle } from '../bundle';

import { type ChoicesType } from './choices';

import { type DropdownSize } from '.';

export type DropdownBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'dropdown';

    /**
     * Whether the dropdown should be disabled or not.
     */
    disabled?: boolean | ((bundle: Bundle<AppBridge>) => boolean);

    /**
     * The placeholder to be shown in the dropdown.
     */
    placeholder?: string;

    /**
     * The size of the dropdown.
     * @deprecated `size` has no effect anymore, will be removed 13.10.2024
     */
    size?: 'small' | 'large' | DropdownSize;

    /**
     * Whether the dropdown value should be clearable or not.
     *
     * It will set the value of the setting to `null` when clicked.
     */
    clearable?: boolean;
} & ChoicesType<AppBridge>;
