/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, test, vi } from 'vitest';
import {
    createColorPalette,
    deleteColorPalette,
    getColorPalettesByProjectId,
    mapColorPaletteApiToColorPalette,
    mapColorPaletteCreateToColorPaletteApiCreate,
    mapColorPalettePatchToColorPaletteApiPatch,
    updateColorPalette,
} from './ColorPaletteRepository';
import { HttpClient } from '../utilities';
import {
    ColorPaletteApiCreateDummy,
    ColorPaletteApiDummy,
    ColorPaletteApiPatchDummy,
    ColorPaletteCreateDummy,
    ColorPaletteDummy,
    ColorPalettePatchDummy,
    HttpUtilResponseDummy,
} from '../tests';

const PROJECT_ID = 453;
const COLOR_PALETTE_ID = 1;

describe('ColorPaletteRepositoryTest', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('getColorPalettesByProjectId with success', () => {
        const apiColorPalettes = [ColorPaletteApiDummy.with(COLOR_PALETTE_ID)];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(apiColorPalettes));

        HttpClient.get = mockHttpClientGet;

        const result = getColorPalettesByProjectId(PROJECT_ID);

        expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(apiColorPalettes.map(mapColorPaletteApiToColorPalette));
    });

    test('getColorPalettesByProjectId with error', () => {
        HttpClient.get = vi.fn().mockReturnValue(HttpUtilResponseDummy.failure());

        expect(getColorPalettesByProjectId(PROJECT_ID)).rejects.toThrow('Could not get color palettes');
    });

    test('createColorPalette', () => {
        const colorPaletteApi = ColorPaletteApiDummy.with(COLOR_PALETTE_ID);

        HttpClient.post = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(colorPaletteApi));

        expect(createColorPalette(ColorPaletteApiCreateDummy.with())).resolves.toEqual(
            mapColorPaletteApiToColorPalette(colorPaletteApi),
        );
    });

    test('createColorPalette with error', () => {
        HttpClient.post = vi.fn().mockReturnValue(HttpUtilResponseDummy.failure());

        expect(createColorPalette(ColorPaletteApiCreateDummy.with())).rejects.toThrow('Could not create color palette');
    });

    test('updateColorPalette', () => {
        const colorPaletteApi = ColorPaletteApiDummy.with(COLOR_PALETTE_ID);
        HttpClient.patch = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(colorPaletteApi));

        expect(updateColorPalette(COLOR_PALETTE_ID, { name: 'Color Palette Updated Name' })).resolves.toEqual(
            mapColorPaletteApiToColorPalette(colorPaletteApi),
        );
    });

    test('updateColorPalette with error', () => {
        HttpClient.patch = vi.fn().mockImplementationOnce(() => ({ result: { success: false } }));

        expect(updateColorPalette(COLOR_PALETTE_ID, { name: 'Color Palette Updated Name' })).rejects.toThrow(
            'Could not update color palette',
        );
    });

    test('deleteColorPalette with success', () => {
        const mockHttpClientDelete = vi.fn().mockReturnValue(HttpUtilResponseDummy.success());

        HttpClient.delete = mockHttpClientDelete;

        const result = deleteColorPalette(COLOR_PALETTE_ID);

        expect(mockHttpClientDelete).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(undefined);
    });

    test('deleteColorPalette with error', () => {
        HttpClient.delete = vi.fn().mockImplementationOnce(() => ({ result: { success: false } }));

        expect(deleteColorPalette(COLOR_PALETTE_ID)).rejects.toThrow('Could not delete color palette');
    });

    test('should map create color palette from frontify to api correctly', () => {
        expect(mapColorPaletteCreateToColorPaletteApiCreate(ColorPaletteCreateDummy.with(), PROJECT_ID)).toEqual(
            ColorPaletteApiCreateDummy.with(PROJECT_ID),
        );
    });

    test('should map patch type correctly from frontify type to api type', () => {
        expect(mapColorPalettePatchToColorPaletteApiPatch(ColorPalettePatchDummy.with())).toEqual(
            ColorPaletteApiPatchDummy.with(),
        );
    });

    test('should map correctly from api type to frontify type with colors', () => {
        expect(mapColorPaletteApiToColorPalette(ColorPaletteApiDummy.with(COLOR_PALETTE_ID))).toEqual(
            ColorPaletteDummy.with(COLOR_PALETTE_ID),
        );
    });

    test('should map correctly from api type to frontify type without colors', () => {
        const colorPalette = ColorPaletteDummy.with(COLOR_PALETTE_ID);
        colorPalette.colors = [];

        const colorPaletteApi = ColorPaletteApiDummy.with(COLOR_PALETTE_ID);
        delete colorPaletteApi.colors;

        expect(mapColorPaletteApiToColorPalette(colorPaletteApi)).toEqual(colorPalette);
    });
});
