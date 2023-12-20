/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ColorInput, TinyColor, readability } from '@ctrl/tinycolor';
import { type Color } from '@frontify/sidebar-settings';

import { toShortRgba } from './toShortRgba';

/**
 * Returns darkened text color for a given background color, so that it is readable and has enough contrast (above 4.5)
 *
 * @param {Object} textColor Object of RGBA values
 * @param {Object} backgroundColor Object of RGBA values
 * @returns {string} To be used as css value
 */

const isRgbaLongFormat = (value: unknown): value is Color => {
    const requiredKeys = ['red', 'green', 'blue'];
    return typeof value === 'object' && requiredKeys.every((i) => value && i in value);
};

export const getReadableColor = (textColor: unknown, backgroundColor: unknown): string => {
    const inputTextColor = isRgbaLongFormat(textColor) ? toShortRgba(textColor) : (textColor as ColorInput);
    const inputBackgroundColor = isRgbaLongFormat(backgroundColor)
        ? toShortRgba(backgroundColor)
        : (backgroundColor as ColorInput);
    let parsedTextColor = new TinyColor(inputTextColor);
    const parsedBackgroundColor = new TinyColor(inputBackgroundColor);

    // darken the text color until readability is good
    while (readability(parsedTextColor, parsedBackgroundColor) < 4.5) {
        parsedTextColor = parsedTextColor.darken(1);
    }

    return parsedTextColor.toRgbString();
};
