/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement } from 'react';

import { type BaseBlock, type ValueOrPromisedValue } from './base';
import { type IconEnum } from './iconEnum';

export type Choice = {
    /**
     * The text label of the item.
     */
    label?: string | number;

    /**
     * The aria label of the item.
     */
    ariaLabel?: string;

    /**
     * The icon of the item.
     *
     * The full list of icons can be found here {@link https://fondue-components.frontify.com/?path=/story/icons_icons--default}
     */
    icon?: IconEnum | keyof typeof IconEnum | ReactElement;

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
