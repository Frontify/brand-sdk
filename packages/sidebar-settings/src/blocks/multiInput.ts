/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { MultiInputLayout } from '.';
import type { BaseBlock } from './base';
import type { ColorInputBlock } from './colorInput';
import type { DropdownBlock } from './dropdown';
import type { InputBlock } from './input';

export type MultiInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'multiInput';

    /**
     * The layout of the multi input.
     * @default 'columns'
     */
    layout?: 'columns' | 'spider' | MultiInputLayout;

    /**
     * The list of blocks that make up the multi-input.
     *
     * The currently supported blocks are `input`, `colorInput` or `dropdown`.
     */
    blocks: (
        | Omit<InputBlock<AppBridge>, 'value'>
        | Omit<ColorInputBlock<AppBridge>, 'value'>
        | Omit<DropdownBlock<AppBridge>, 'value'>
    )[];

    /**
     * Whether the last item should expand to full width or not.
     */
    lastItemFullWidth?: boolean;
} & BaseBlock<AppBridge>;
