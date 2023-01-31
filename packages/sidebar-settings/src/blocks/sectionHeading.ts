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
     * The label of the section.
     */
    label?: string;
} & BaseBlock<AppBridge>;
