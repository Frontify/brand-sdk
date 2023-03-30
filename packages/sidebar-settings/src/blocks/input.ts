/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Rule } from '../helpers';
import type { BaseBlock } from './base';
import type { IconEnum, TextInputType } from '.';

export type InputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'input';

    /**
     * The icon of the input.
     *
     * The full list of icons can be found here {@link https://github.com/Frontify/fondue/blob/beta/src/foundation/Icon/IconEnum.ts}
     */
    icon?: IconEnum | keyof typeof IconEnum;

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
} & (
    | {
          /**
           * The type of input (text, number, etc.).
           */
          inputType?: 'text' | 'password' | 'number';
      }
    | {
          /**
           * The type of input (text, number, etc.).
           * @deprecated Use string values instead.
           */
          inputType?: TextInputType;
      }
) &
    BaseBlock<AppBridge, string>;
