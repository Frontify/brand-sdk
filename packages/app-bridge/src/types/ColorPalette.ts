/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Color } from './Color';

export type ColorPalette = {
    id: number;
    name: string;
    description: string;
    colors: Color[];
};

export type ColorPaletteCreate = {
    name: string;
    description?: string;
};

export type ColorPalettePatch = Partial<Omit<ColorPalette, 'id' | 'colors'>>;
