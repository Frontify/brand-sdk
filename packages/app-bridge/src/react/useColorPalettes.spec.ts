/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { useColorPalettes } from './useColorPalettes';
import { ColorPaletteDummy, getAppBridgeBlockStub } from '../tests';

const COLOR_PALETTE_ID = 500;
const appBridgeStub = getAppBridgeBlockStub();
const COLOR_PALETTE_DOWNLOAD_LINK_PART = `/api/color/export/${appBridgeStub.getProjectId()}/zip/500`;

describe('useColorPalettes hook', () => {
    const loadUseColorPalettes = () => {
        const { result } = renderHook(() => useColorPalettes(appBridgeStub));
        return { result };
    };

    it('should get all the color palettes', async () => {
        const { result } = loadUseColorPalettes();

        await waitFor(() =>
            expect(result.current.colorPalettes).toEqual([
                ColorPaletteDummy.with(678, 'Palette 1'),
                ColorPaletteDummy.with(427, 'Palette 2'),
                ColorPaletteDummy.with(679, 'Palette 3'),
            ]),
        );
    });

    it('return the download link', async () => {
        const { result } = loadUseColorPalettes();

        await waitFor(() => {
            expect(result.current.downloadColorKit([COLOR_PALETTE_ID])).toEqual(COLOR_PALETTE_DOWNLOAD_LINK_PART);
        });
    });
});
