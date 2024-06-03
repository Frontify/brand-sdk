/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BaseBlock } from './base';

export type Color = {
    red: number;
    green: number;
    blue: number;
    alpha?: number | undefined;
    name?: string | undefined;
};
export type ColorRgb = {
    r: number;
    g: number;
    b: number;
    a?: number | undefined;
};
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
