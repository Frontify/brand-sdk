/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ColorPalette } from '../types/ColorPalette';

import { ColorDummy } from './ColorDummy';

export class ColorPaletteDummy {
    static with(id: number, name = 'Color Palette Name'): ColorPalette {
        return {
            id,
            name,
            description: 'Color Palette Description',
            colors: [ColorDummy.red(), ColorDummy.yellow(), ColorDummy.green()],
        };
    }
}
