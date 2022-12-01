/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient } from '../utilities';
import { mapColorApiToColor } from './ColorRepository';
import type {
    ColorPalette,
    ColorPaletteApi,
    ColorPaletteApiCreate,
    ColorPaletteApiPatch,
    ColorPaletteCreate,
    ColorPalettePatch,
} from '../types';

export const getColorPalettesByProjectId = async (projectId: number): Promise<ColorPalette[]> => {
    const { result } = await HttpClient.get<ColorPaletteApi[]>(`/api/project-color-palette?project_id=${projectId}`);

    if (!result.success) {
        throw new Error('Could not get color palettes');
    }

    return result.data.map(mapColorPaletteApiToColorPalette);
};

export const createColorPalette = async (colorPaletteApiCreate: ColorPaletteApiCreate): Promise<ColorPalette> => {
    const { result } = await HttpClient.post<ColorPaletteApi>('/api/project-color-palette', colorPaletteApiCreate);

    if (!result.success) {
        throw new Error('Could not create color palette');
    }

    return mapColorPaletteApiToColorPalette(result.data);
};

export const updateColorPalette = async (
    colorPaletteId: number,
    colorPaletteApiPatch: ColorPaletteApiPatch,
): Promise<ColorPalette> => {
    const { result } = await HttpClient.patch<ColorPaletteApi>(
        `/api/project-color-palette/${colorPaletteId}`,
        colorPaletteApiPatch,
    );

    if (!result.success) {
        throw new Error('Could not update color palette');
    }

    return mapColorPaletteApiToColorPalette(result.data);
};

export const deleteColorPalette = async (colorPaletteId: number): Promise<void> => {
    const { result } = await HttpClient.delete<undefined>(`/api/project-color-palette/${colorPaletteId}`);

    if (!result.success) {
        throw new Error('Could not delete color palette');
    }
};

export function mapColorPaletteApiToColorPalette(colorPaletteApi: ColorPaletteApi): ColorPalette {
    return {
        id: colorPaletteApi.id,
        name: colorPaletteApi.name,
        description: colorPaletteApi.description,
        colors: colorPaletteApi.colors?.map(mapColorApiToColor) ?? [],
    };
}

export function mapColorPaletteCreateToColorPaletteApiCreate(
    colorPalette: ColorPaletteCreate,
    projectId: number,
): ColorPaletteApiCreate {
    return {
        project_id: projectId,
        name: colorPalette.name,
        description: colorPalette.description,
    };
}

export function mapColorPalettePatchToColorPaletteApiPatch(colorPaletteApi: ColorPalettePatch): ColorPaletteApiPatch {
    return {
        name: colorPaletteApi.name,
        description: colorPaletteApi.description,
    };
}
