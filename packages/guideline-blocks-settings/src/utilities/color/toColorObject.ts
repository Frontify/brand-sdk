/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Color } from '@frontify/fondue';
import tinycolor from '@ctrl/tinycolor';

/**
 * Maps color strings to color objects.
 *
 * @param {String} String representing color
 * @returns {Color} Color object
 */

export const toColorObject = (colorString: string): Color => {
    const { r, g, b, a } = tinycolor(colorString);
    return { red: r, green: g, blue: b, alpha: a };
};
