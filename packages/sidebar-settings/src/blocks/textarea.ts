/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Rule } from '../validation';
import type { BaseBlock } from './base';

export type TextareaBlock<AppBridge> = {
    type: 'textarea';
    placeholder?: string;
    rules?: Rule<string>[];
} & BaseBlock<AppBridge, string>;
