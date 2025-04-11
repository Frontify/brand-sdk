/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement } from 'react';

import { type BaseBlock, type ValueOrPromisedValue } from './base';

import type * as Icons from '@frontify/fondue/icons';

type PickIconStrings<T extends string> = T extends `Icon${string}` ? T : never;
type RemoveIconPrefix<T extends string> = T extends `Icon${infer U}` ? U : T;

export type Choice = {
    /**
     * The label of the item.
     */
    label?: string | number;

    /**
     * The icon of the item.
     *
     * The full list of icons can be found here {@link https://fondue-components.frontify.com/?path=/story/icons_icons--default}
     */
    icon?: RemoveIconPrefix<PickIconStrings<keyof typeof Icons>> | ReactElement;

    /**
     * The value of the item.
     */
    value: string | number;
};

export type ChoicesType<AppBridge> = {
    /**
     * The list of available choices in the setting.
     */
    choices: ValueOrPromisedValue<AppBridge, Choice[]>;
} & BaseBlock<AppBridge, string | number>;
