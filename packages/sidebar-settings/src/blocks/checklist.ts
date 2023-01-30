/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock, ValueOrPromisedValue } from './base';
import type { Checkbox } from './checkbox';

export type ChecklistBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'checklist';

    /**
     * The list of available choices in the checklist.
     */
    choices: ValueOrPromisedValue<AppBridge, Checkbox[]>;

    /**
     * Whether to show the clear and select all buttons or not.
     */
    showClearAndSelectAllButtons?: boolean;

    /**
     * The number of columns to display the checklist in.
     */
    columns?: 1 | 2;
} & BaseBlock<AppBridge, string[] | null>;
