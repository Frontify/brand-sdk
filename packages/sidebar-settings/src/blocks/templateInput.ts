/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export type TemplateInputBlock<AppBridge> = {
    type: 'templateInput';
    multiSelection?: boolean;
} & BaseBlock<AppBridge, number>;
