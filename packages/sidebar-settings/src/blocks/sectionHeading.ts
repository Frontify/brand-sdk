/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';
import type { SettingBlock } from './index';

export type SectionHeadingBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'sectionHeading';

    /**
     * The list of blocks that make up the section.
     */
    blocks: SettingBlock<AppBridge>[];

    /**
     * A switch which can toggle the blocks on and off.
     * @default false
     */
    hasSwitch?: boolean;
} & BaseBlock<AppBridge, boolean>;
