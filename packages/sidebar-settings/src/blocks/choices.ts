/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { IconEnum } from '.';
import type { BaseBlock } from './base';

export type Choice = {
    label?: string | number;
    icon?: IconEnum;
    value: string | number;
};

export type ChoicesType<AppBridge> = {
    choices: Choice[];
} & BaseBlock<AppBridge, string | number>;
