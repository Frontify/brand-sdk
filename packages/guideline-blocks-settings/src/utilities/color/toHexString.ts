/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Color } from '@frontify/fondue';
import tinycolor from '@ctrl/tinycolor';
import { toShortRgba } from './toShortRgba';

/**
 * Maps color object of rgba values to hex alpha string.
 */
export const toHexString = (color: Color): string => tinycolor(toShortRgba(color)).toHexString();
