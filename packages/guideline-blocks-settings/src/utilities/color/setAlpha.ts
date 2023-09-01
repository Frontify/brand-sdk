/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TinyColor } from '@ctrl/tinycolor';

/**
 * Sets alpha value and returns rgba string.
 *
 * @param {string} color Rgb or hex string.
 * @returns {String} To be used as css value.
 */

export const setAlpha = (alpha: number, color?: string): string => {
    return new TinyColor(color).setAlpha(alpha).toRgbString();
};
