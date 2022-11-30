/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient } from '../utilities';
import type { Color, ColorApi, ColorApiCreate, ColorApiPatch, ColorCreate, ColorPatch } from '../types';

export const getColorsByColorPaletteId = async (colorPaletteId: number): Promise<Color[]> => {
    const { result } = await HttpClient.get<ColorApi[]>(
        `/api/project-color?project_color_palette_id=${colorPaletteId}`,
    );

    if (!result.success) {
        throw new Error(`Could not get the available colors for color palette: ${colorPaletteId}`);
    }

    return result.data.map(mapColorApiToColor);
};

export const createColor = async (colorApiCreate: ColorApiCreate): Promise<Color> => {
    const { result } = await HttpClient.post<ColorApi>('/api/project-color', colorApiCreate);

    if (!result.success) {
        throw new Error('Could not create color');
    }

    return mapColorApiToColor(result.data);
};

export const updateColor = async (colorId: number, colorApiPatch: ColorApiPatch): Promise<Color> => {
    const { result } = await HttpClient.patch<ColorApi>(`/api/project-color/${colorId}`, colorApiPatch);

    if (!result.success) {
        throw new Error('Could not update color');
    }

    return mapColorApiToColor(result.data);
};

export const deleteColor = async (colorId: number): Promise<void> => {
    const { result } = await HttpClient.delete<undefined>(`/api/project-color/${colorId}`);

    if (!result.success) {
        throw new Error('Could not delete color');
    }
};

export function mapColorApiToColor(color: ColorApi): Color {
    return {
        id: color.id,
        name: color.name,
        sort: color.sort,
        nameCss: color.name_css,
        hex: color.hex,
        red: color.r,
        green: color.g,
        blue: color.b,
        alpha: color.alpha,
        hue: color.hue,
        saturation: color.saturation,
        lightness: color.lightness,
        c: color.c,
        m: color.m,
        y: color.y,
        k: color.k,
        pantone: color.pantone,
        ral: color.ral,
        oracal: color.oracal,
        pantoneCoated: color.pantone_coated,
        pantoneUncoated: color.pantone_uncoated,
        cmykCoated: color.cmyk_coated,
        cmykUncoated: color.cmyk_uncoated,
        cmykNewspaper: color.cmyk_newspaper,
        ncs: color.ncs,
        pantoneCp: color.pantone_cp,
        pantonePlastics: color.pantone_plastics,
        pantoneTextile: color.pantone_textile,
        hks: color.hks,
        threeM: color.three_m,
        lab: color.lab,
    };
}

export function mapColorCreateToColorApiCreate(color: ColorCreate): ColorApiCreate {
    return {
        project_color_palette_id: color.colorPaletteId,
        red: color.red,
        green: color.green,
        blue: color.blue,
        alpha: color.alpha,
    };
}

export function mapColorPatchToColorApiPatch(color: ColorPatch): ColorApiPatch {
    return {
        name: color.name,
        sort: color.sort,
        name_css: color.nameCss,
        red: color.red,
        green: color.green,
        blue: color.blue,
        alpha: color.alpha,
        c: color.c,
        m: color.m,
        y: color.y,
        k: color.k,
        pantone: color.pantone,
        ral: color.ral,
        oracal: color.oracal,
        pantone_coated: color.pantoneCoated,
        pantone_uncoated: color.pantoneUncoated,
        cmyk_coated: color.cmykCoated,
        cmyk_uncoated: color.cmykUncoated,
        cmyk_newspaper: color.cmykNewspaper,
        ncs: color.ncs,
        pantone_cp: color.pantoneCp,
        pantone_plastics: color.pantonePlastics,
        pantone_textile: color.pantoneTextile,
        hks: color.hks,
        three_m: color.threeM,
        lab: color.lab,
    };
}
