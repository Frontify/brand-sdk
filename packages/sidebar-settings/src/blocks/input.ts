/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Rule } from '../rules/Rule';
import type { BaseBlock } from './base';
import type { IconEnum, TextInputType } from '.';

export type InputBlock<AppBridge> = {
    type: 'input';
    icon?: IconEnum;
    inputType?: TextInputType;
    placeholder?: string;
    clearable?: boolean;
    rules?: Rule<string>[];
} & BaseBlock<AppBridge, string>;
