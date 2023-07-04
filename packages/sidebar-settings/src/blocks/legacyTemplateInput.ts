/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export type LegacyTemplateInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'legacyTemplateInput';
} & BaseBlock<AppBridge, number>;
