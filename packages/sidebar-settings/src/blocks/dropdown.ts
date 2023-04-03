/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DropdownSize } from '.';
import type { ChoicesType } from './choices';

export type DropdownBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'dropdown';

    /**
     * Whether the dropdown should be disabled or not.
     */
    disabled?: boolean;

    /**
     * The placeholder to be shown in the dropdown.
     */
    placeholder?: string;

    /**
     * The size of the dropdown.
     */
    size?: 'small' | 'large' | DropdownSize;

    /**
     * Whether the dropdown value should be clearable or not.
     *
     * It will set the value of the setting to `null` when clicked.
     */
    clearable?: boolean;
} & ChoicesType<AppBridge>;
