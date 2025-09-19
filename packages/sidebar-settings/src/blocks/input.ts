/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement } from 'react';

import { type Rule } from '../helpers';

import { type BaseBlock } from './base';
import { type IconEnum } from './iconEnum';

import { type TextInputType } from '.';

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
    icon?: IconEnum | keyof typeof IconEnum | ReactElement;

    /**
     * The type of input (text, number, etc.).
     */
    inputType?: 'text' | 'password' | 'number' | TextInputType;

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
