/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Color } from '@frontify/fondue';

type ShortNotationColor = {
    r: number;
    g: number;
    b: number;
    a?: number;
};

/**
 * Maps color object from long to short rgba notation.
 *
 * @param {Object} Color object
 * @returns {Object} ShortNotationColor object
 */

export const toShortRgba = (color: unknown): ShortNotationColor => {
    const isRgbaLongFormat = (value: Color) => {
        const requiredKeys = ['red', 'green', 'blue'];
        return typeof value === 'object' && requiredKeys.every((i) => value.hasOwnProperty(i));
    };

    const mapToShortFormat = (value: Color): ShortNotationColor => {
        const alpha = typeof value.alpha === 'number' ? value.alpha : 1;
        return { r: value.red, g: value.green, b: value.blue, a: alpha };
    };

    if (isRgbaLongFormat(color as Color)) {
        return mapToShortFormat(color as Color);
    }

    return color as ShortNotationColor;
};
