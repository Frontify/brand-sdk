/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TinyColor } from '@ctrl/tinycolor';
import { type Color } from '@frontify/fondue';

import { toShortRgba } from './toShortRgba';

/**
 * Maps color object of rgba values to rgba string.
 *
 * @param {Object} Color object
 * @returns {String} To be used as css value.
 */

export const toRgbaString = (color: Color): string => new TinyColor(toShortRgba(color)).toRgbString();
