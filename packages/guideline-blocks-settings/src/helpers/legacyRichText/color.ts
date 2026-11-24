/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TinyColor } from '@ctrl/tinycolor';

const HEX_PREFIX = '#';
const RGB_PREFIX = 'rgb';
const RGB_SUFFIX = ')';
const HEX_LENGTHS_WITH_PREFIX = [4, 7, 9];
const MAX_ALPHA_BYTE = 255;

/**
 * Reads `rgb()`, `rgba()`, `#rgb`, `#rrggbb` and `#rrggbbaa` as lowercase `#rrggbb`, or `#rrggbbaa` when translucent.
 * Returns null for anything else.
 */
export const parseLegacyColor = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const input = value.trim().toLowerCase();
    const color = new TinyColor(input);
    if (!color.isValid) {
        return null;
    }

    const isHex = input.startsWith(HEX_PREFIX) && HEX_LENGTHS_WITH_PREFIX.includes(input.length);
    const isRgb = input.startsWith(RGB_PREFIX) && input.endsWith(RGB_SUFFIX) && color.format === 'rgb';
    if (!isHex && !isRgb) {
        return null;
    }

    if (Math.round(color.a * MAX_ALPHA_BYTE) === MAX_ALPHA_BYTE) {
        return color.toHexString();
    }

    return color.toHex8String();
};
