/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';
import type { SettingBlock } from './index';

export type SectionHeadingBlock<AppBridge> = {
    type: 'sectionHeading';
    blocks: SettingBlock<AppBridge>[];
    label: string;
} & BaseBlock<AppBridge>;
