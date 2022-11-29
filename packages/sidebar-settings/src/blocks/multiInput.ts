/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { MultiInputLayout } from '.';
import type { BaseBlock } from './base';
import type { ColorInputBlock } from './colorInput';
import type { DropdownBlock } from './dropdown';
import type { InputBlock } from './input';

export type MultiInputBlock<AppBridge> = {
    type: 'multiInput';
    layout: MultiInputLayout;
    blocks: (
        | Omit<InputBlock<AppBridge>, 'value'>
        | Omit<ColorInputBlock<AppBridge>, 'value'>
        | Omit<DropdownBlock<AppBridge>, 'value'>
    )[];
    lastItemFullWidth?: boolean;
} & BaseBlock<AppBridge>;
