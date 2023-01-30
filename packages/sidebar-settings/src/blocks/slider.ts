/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ChoicesType } from './choices';

export type SliderBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'slider';

    /**
     * The text under the slider to give more details.
     */
    helperText?: string;
} & ChoicesType<AppBridge>;
