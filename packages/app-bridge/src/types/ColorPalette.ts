/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { ColorApi, ProjectColor } from './Color';

export type ColorPaletteApi = {
    id: number;
    name: string;
    description: string;
    colors?: Nullable<ColorApi[]>;
};

export type ColorPaletteApiCreate = {
    project_id: number;
    name: string;
    description?: string;
};

export type ColorPaletteApiPatch = Partial<Omit<ColorPaletteApi, 'id' | 'colors'> & { language: string }>;

export type ColorPalette = {
    id: number;
    name: string;
    description: string;
    colors: ProjectColor[];
};

export type ColorPaletteCreate = {
    name: string;
    description?: string;
};

export type ColorPalettePatch = Partial<Omit<ColorPalette, 'id' | 'colors'>>;
