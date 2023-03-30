/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ChoicesType } from './choices';

/**
 * @deprecated Use `type: 'segmentedControls'` instead.
 */
type DeprecatedSliderType = 'slider';

export type SegmentedControlsBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'segmentedControls' | DeprecatedSliderType;

    /**
     * The text under the segmented control to give more details.
     */
    helperText?: string;
} & ChoicesType<AppBridge>;
