/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Color as ColorFondue, ColorRgb as ColorRgbFondue } from '@frontify/fondue';
import type { BaseBlock } from './base';

export type Color = ColorFondue;
export type ColorRgb = ColorRgbFondue;
export type ColorFormats = Color | ColorRgb;

export type ColorInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'colorInput';

    /**
     * Whether the dropdown value should be clearable or not.
     *
     * It will set the value of the setting to `null` when clicked.
     */
    clearable?: boolean;
} & BaseBlock<AppBridge, ColorFormats>;
