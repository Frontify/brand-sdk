/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ChoicesType } from './choices';

export type SegmentedControlsBlock<AppBridge> = {
    /**
     * The text under the segmented control to give more details.
     */
    helperText?: string;
} & (
    | {
          /**
           * The setting type.
           */
          type: 'segmentedControls';
      }
    | {
          /**
           * The setting type.
           * @deprecated Use `type: 'segmentedControls'` instead.
           */
          type: 'slider';
      }
) &
    ChoicesType<AppBridge>;
