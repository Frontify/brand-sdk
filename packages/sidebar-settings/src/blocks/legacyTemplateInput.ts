/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export type LegacyTemplateInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'legacyTemplateInput';

    /**
     * Whether multiple assets can be selected.
     */
    multiSelection?: boolean;
} & BaseBlock<AppBridge, number>;
