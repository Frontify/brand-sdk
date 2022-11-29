/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { TextInputType as TextInputTypeFondue } from '@frontify/fondue';
import type { Rule } from '../validation';
import type { BaseBlock } from './base';
import type { IconEnum } from '.';

export type TextInputType = TextInputTypeFondue;

export type InputBlock<AppBridge> = {
    type: 'input';
    icon?: IconEnum;
    inputType?: TextInputType;
    placeholder?: string;
    clearable?: boolean;
    rules?: Rule<string>[];
} & BaseBlock<AppBridge, string>;
