/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Rule } from '../helpers';
import type { BaseBlock } from './base';

export type TextareaBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'textarea';

    /**
     * The placeholder text for the input.
     */
    placeholder?: string;

    /**
     * The list of validation rules for the input.
     */
    rules?: Rule<string>[];
} & BaseBlock<AppBridge, string>;
