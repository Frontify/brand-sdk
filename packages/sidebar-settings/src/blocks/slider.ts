/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ChoicesType } from './choices';

export type SliderBlock<AppBridge> = {
    type: 'slider';
    helperText?: string;
} & ChoicesType<AppBridge>;
