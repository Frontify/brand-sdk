/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, test, vi } from 'vitest';
import {
    createColor,
    deleteColor,
    getColorsByColorPaletteId,
    mapColorApiToColor,
    mapColorCreateToColorApiCreate,
    mapColorPatchToColorApiPatch,
    updateColor,
} from './ColorRepository';
import { HttpClient } from '../utilities';
import {
    ColorApiCreateDummy,
    ColorApiDummy,
    ColorApiPatchDummy,
    ColorCreateDummy,
    ColorDummy,
    HttpUtilResponseDummy,
} from '../tests';

const COLOR_PALETTE_ID = 500;
const COLOR_ID = 231;

describe('ColorPaletteRepositoryTest', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('getColorsByColorPaletteId with success', () => {
        const apiColors = [ColorApiDummy.red()];

        const mockHttpClientGet = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(apiColors));

        HttpClient.get = mockHttpClientGet;

        const result = getColorsByColorPaletteId(COLOR_PALETTE_ID);

        expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(apiColors.map(mapColorApiToColor));
    });

    test('getColorsByColorPaletteId with error', () => {
        HttpClient.get = vi.fn().mockReturnValue(HttpUtilResponseDummy.failure());

        expect(getColorsByColorPaletteId(COLOR_PALETTE_ID)).rejects.toThrow(
            `Could not get the available colors for color palette: ${COLOR_PALETTE_ID}`,
        );
    });

    test('createColor', () => {
        const colorApi = ColorApiDummy.red();

        HttpClient.post = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(colorApi));

        expect(createColor(ColorApiCreateDummy.red())).resolves.toEqual(mapColorApiToColor(colorApi));
    });

    test('createColor with error', () => {
        HttpClient.post = vi.fn().mockImplementationOnce(() => ({ result: { success: false } }));

        expect(createColor(ColorApiCreateDummy.red())).rejects.toThrow('Could not create color');
    });

    test('updateColor', () => {
        const colorApi = ColorApiDummy.red();

        HttpClient.patch = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(colorApi));

        expect(updateColor(COLOR_ID, { name: 'Color Palette Updated Name' })).resolves.toEqual(
            mapColorApiToColor(colorApi),
        );
    });

    test('updateColor with error', () => {
        HttpClient.patch = vi.fn().mockImplementationOnce(() => ({ result: { success: false } }));

        expect(updateColor(COLOR_ID, { name: 'Color Palette Updated Name' })).rejects.toThrow('Could not update color');
    });

    test('deleteColor with success', () => {
        HttpClient.delete = vi.fn().mockReturnValue(HttpUtilResponseDummy.success());

        const result = deleteColor(COLOR_ID);

        expect(HttpClient.delete).toHaveBeenCalledTimes(1);
        expect(result).resolves.toEqual(undefined);
    });

    test('deleteColor with error', () => {
        HttpClient.delete = vi.fn().mockImplementationOnce(() => ({ result: { success: false } }));

        expect(deleteColor(COLOR_ID)).rejects.toThrow('Could not delete color');
    });

    test('should map correctly from frontify type to api type', () => {
        expect(mapColorPatchToColorApiPatch(ColorDummy.green())).toEqual(ColorApiPatchDummy.green());
    });

    test('should map correctly from frontify create type to api create type', () => {
        expect(mapColorCreateToColorApiCreate(ColorCreateDummy.red())).toEqual(ColorApiCreateDummy.red());
    });
});
