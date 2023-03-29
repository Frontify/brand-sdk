/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';
import type { SettingBlock } from './index';

/**
 * @deprecated
 */
enum SwitchSize {
    Small = 'Small',
    Medium = 'Medium',
}

export type SwitchBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'switch';

    /**
     * The label of the switch.
     */
    switchLabel?: string;

    /**
     * The list of blocks to show when the switch is active.
     */
    on?: SettingBlock<AppBridge>[];

    /**
     * The list of blocks to show when the switch is inactive.
     */
    off?: SettingBlock<AppBridge>[];
} & (
    | {
          /**
           * The size of the switch.
           */
          size?: 'small' | 'medium';
      }
    | {
          /**
           * The size of the switch.
           * @deprecated Use string values instead.
           */
          size?: SwitchSize;
      }
) &
    BaseBlock<AppBridge, boolean>;
