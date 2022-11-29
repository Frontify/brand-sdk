/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SwitchSize as SwitchSizeFondue } from '@frontify/fondue';
import type { BaseBlock } from './base';
import type { SettingBlock } from './index';

export type SwitchSize = SwitchSizeFondue;

export type SwitchBlock<AppBridge> = {
    type: 'switch';
    switchLabel?: string;
    on?: SettingBlock<AppBridge>[];
    off?: SettingBlock<AppBridge>[];
    size?: SwitchSize;
} & BaseBlock<AppBridge, boolean>;
