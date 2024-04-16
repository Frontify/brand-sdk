/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ColorPaletteApi, type ColorPaletteApiCreate, type ColorPaletteApiPatch } from '../types';

import { ColorApiDummy } from './ColorApiDummy';

export class ColorPaletteApiDummy {
    static with(id: number, name = 'Color Palette Name'): ColorPaletteApi {
        return {
            id,
            name,
            description: 'Color Palette Description',
            colors: [ColorApiDummy.red(), ColorApiDummy.yellow(), ColorApiDummy.green()],
        };
    }
}

export class ColorPaletteApiCreateDummy {
    static with(projectId = 322): ColorPaletteApiCreate {
        return {
            project_id: projectId,
            name: 'New Color Palette Name',
            description: 'New Color Palette Description',
        };
    }
}

export class ColorPaletteApiPatchDummy {
    static with(): ColorPaletteApiPatch {
        return {
            name: 'Updated Color Palette Name',
            description: 'Updated Color Palette Description',
        };
    }
}
