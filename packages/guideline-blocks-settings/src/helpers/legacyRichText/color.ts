/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TinyColor } from '@ctrl/tinycolor';

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/;
const RGB_COLOR_PATTERN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const RGBA_COLOR_PATTERN = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*\.?\d+)\s*\)$/;
const MAX_CHANNEL = 255;
const MAX_ALPHA = 1;
const FIRST_CHANNEL_GROUP = 1;
const LAST_CHANNEL_GROUP = 3;
const ALPHA_GROUP = 4;
const SHORT_ALPHA_DECIMALS = 2;
const LONG_ALPHA_DECIMALS = 3;
const MAX_ALPHA_BYTE = 255;

const hasValidChannels = (match: RegExpExecArray): boolean => {
    for (let group = FIRST_CHANNEL_GROUP; group <= LAST_CHANNEL_GROUP; group++) {
        if (Number(match[group]) > MAX_CHANNEL) {
            return false;
        }
    }

    return true;
};

const isRgbColor = (input: string): boolean => {
    const match = RGB_COLOR_PATTERN.exec(input);

    return match !== null && hasValidChannels(match);
};

const isRgbaColor = (input: string): boolean => {
    const match = RGBA_COLOR_PATTERN.exec(input);

    return match !== null && hasValidChannels(match) && Number(match[ALPHA_GROUP]) <= MAX_ALPHA;
};

// Only these spellings are colours; the library alone also reads names, percentages, clamped values and trailing text.
const readColor = (value: unknown): TinyColor | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const input = value.trim().toLowerCase();
    if (!HEX_COLOR_PATTERN.test(input) && !isRgbColor(input) && !isRgbaColor(input)) {
        return null;
    }

    return new TinyColor(input);
};

/**
 * Reads `rgb()`, `rgba()`, `#rgb`, `#rrggbb` and `#rrggbbaa` as lowercase `#rrggbb`, or `#rrggbbaa` when translucent.
 * Returns null for anything else.
 */
export const parseLegacyColor = (value: unknown): string | null => {
    const color = readColor(value);
    if (color === null) {
        return null;
    }

    if (Math.round(color.a * MAX_ALPHA_BYTE) === MAX_ALPHA_BYTE) {
        return color.toHexString();
    }

    return color.toHex8String();
};

// Two decimals when they read back to the same alpha byte, else three, which holds for every byte.
const writeAlpha = (alpha: number): string => {
    const byte = Math.round(alpha * MAX_ALPHA_BYTE);
    const short = alpha.toFixed(SHORT_ALPHA_DECIMALS);
    if (Math.round(Number(short) * MAX_ALPHA_BYTE) === byte) {
        return short;
    }

    return alpha.toFixed(LONG_ALPHA_DECIMALS);
};

/** Writes a new-format colour as the legacy `rgba(r, g, b, a)`, or null when it is not one of the colours read above. */
export const toLegacyColor = (value: string): string | null => {
    const color = readColor(value);
    if (color === null) {
        return null;
    }

    const { r, g, b, a } = color.toRgb();

    return `rgba(${r}, ${g}, ${b}, ${writeAlpha(a)})`;
};
