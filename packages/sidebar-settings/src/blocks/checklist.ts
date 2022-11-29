/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock, ValueOrPromisedValue } from './base';
import type { Checkbox } from './checkbox';

export type ChecklistBlock<AppBridge> = {
    type: 'checklist';
    choices: ValueOrPromisedValue<AppBridge, Checkbox[]>;
    showClearAndSelectAllButtons?: boolean;
    columns?: 1 | 2;
} & BaseBlock<AppBridge, string[] | null>;
