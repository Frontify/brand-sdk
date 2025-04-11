/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement } from 'react';

import { type Rule } from '../helpers';

import { type BaseBlock } from './base';

import type * as Icons from '@frontify/fondue/icons';

type PickIconStrings<T extends string> = T extends `Icon${string}` ? T : never;
type RemoveIconPrefix<T extends string> = T extends `Icon${infer U}` ? U : T;

export type InputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'input';

    /**
     * The icon of the input.
     *
     * The full list of icons can be found here {@link https://fondue-components.frontify.com/?path=/story/icons_icons--default}
     */
    icon?: RemoveIconPrefix<PickIconStrings<keyof typeof Icons>> | ReactElement;

    /**
     * The type of input (text, number, etc.).
     */
    inputType?: 'text' | 'password' | 'number';

    /**
     * The placeholder text for the input.
     */
    placeholder?: string;

    /**
     * Whether the input can be cleared or not.
     */
    clearable?: boolean;

    /**
     * The list of validation rules for the input.
     */
    rules?: Rule<string>[];
} & BaseBlock<AppBridge, string>;
