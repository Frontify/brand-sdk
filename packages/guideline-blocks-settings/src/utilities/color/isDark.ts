/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import { toShortRgba } from './toShortRgba';
import { Color } from '@frontify/sidebar-settings';

/**
 * Calculates if text should be in a light color depending on color (e.g. background-color)
 *
 * @param {Object} value Object of RGBA values
 * @param {Number|undefined} threshold Threshold for the brightness
 * @returns {Boolean} Return if the color is dark
 */

const isRgbaLongFormat = (value: unknown): value is Color => {
    const requiredKeys = ['red', 'green', 'blue'];
    return typeof value === 'object' && requiredKeys.every((i) => value?.hasOwnProperty(i));
};

export const isDark = (color: unknown, threshold?: number): boolean => {
    const inputColor = isRgbaLongFormat(color) ? toShortRgba(color) : (color as ColorInput);
    const parsedColor = new TinyColor(inputColor);

    if (threshold) {
        return parsedColor.getBrightness() < threshold;
    }

    return parsedColor.isDark() || (parsedColor.getAlpha() > 0.25 && parsedColor.getAlpha() < 1);
};
