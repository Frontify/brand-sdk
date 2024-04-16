/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TinyColor } from '@ctrl/tinycolor';
import { type Color } from '@frontify/fondue';

/**
 * Maps color strings to color objects.
 *
 * @param {String} String representing color
 * @returns {Color} Color object
 */

export const toColorObject = (colorString: string): Color => {
    const { r, g, b, a } = new TinyColor(colorString);
    return { red: r, green: g, blue: b, alpha: a };
};
