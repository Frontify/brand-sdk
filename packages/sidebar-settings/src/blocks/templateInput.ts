/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export type TemplateInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'templateInput';

    /**
     * Whether multiple assets can be selected.
     */
    multiSelection?: boolean;
} & BaseBlock<AppBridge, number>;
