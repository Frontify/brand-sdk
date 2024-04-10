/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TinyColor } from '@ctrl/tinycolor';
import { type Color } from '@frontify/fondue';

import { toShortRgba } from './toShortRgba';

/**
 * Maps color object of rgba values to hex alpha string.
 */
export const toHexString = (color: Color): string => new TinyColor(toShortRgba(color)).toHexString();
