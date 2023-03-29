/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DropdownSize } from '@frontify/fondue';
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
     * Whether the dropdown value should be clearable or not.
     *
     * It will set the value of the setting to `null` when clicked.
     */
    clearable?: boolean;
} & (
    | {
          /**
           * The size of the dropdown.
           */
          size?: 'small' | 'large';
      }
    | {
          /**
           * The size of the dropdown.
           * @deprecated Use string values instead.
           */
          size?: DropdownSize;
      }
) &
    ChoicesType<AppBridge>;
