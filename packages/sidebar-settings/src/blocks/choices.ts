/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { IconEnum } from '.';
import type { BaseBlock, ValueOrPromisedValue } from './base';

export type Choice = {
    label?: string | number;
    icon?: IconEnum | keyof typeof IconEnum;
    value: string | number;
};

export type ChoicesType<AppBridge> = {
    choices: ValueOrPromisedValue<AppBridge, Choice[]>;
} & BaseBlock<AppBridge, string | number>;
