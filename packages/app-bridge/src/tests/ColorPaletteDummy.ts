/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorPalette, ColorPaletteCreate, ColorPalettePatch } from '../types/ColorPalette';
import { ProjectColorDummy } from './ProjectColorDummy';

export class ColorPaletteDummy {
    static with(id: number, name = 'Color Palette Name'): ColorPalette {
        return {
            id,
            name,
            description: 'Color Palette Description',
            colors: [ProjectColorDummy.red(), ProjectColorDummy.yellow(), ProjectColorDummy.green()],
        };
    }
}

export class ColorPaletteCreateDummy {
    static with(name = 'New Color Palette Name', description = 'New Color Palette Description'): ColorPaletteCreate {
        return {
            name,
            description,
        };
    }
}

export class ColorPalettePatchDummy {
    static with(): ColorPalettePatch {
        return {
            name: 'Updated Color Palette Name',
            description: 'Updated Color Palette Description',
        };
    }
}
