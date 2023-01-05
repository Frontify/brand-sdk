/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { AppBridgeBlock } from '../AppBridgeBlock';
import { useColorPalettes } from './useColorPalettes';
import { ColorPaletteDummy, getAppBridgeBlockStub } from '../tests';

const BLOCK_ID = 352;
const SECTION_ID = 653;
const COLOR_PALETTE_ID = 500;
const COLOR_PALETTE_DOWNLOAD_LINK_PART = 'api/color/export';

describe('useColorPalettes hook', () => {
    const loadUseColorPalettes = async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useColorPalettes(appBridgeStub));

        return { result };
    };

    it('should get all the color palettes', async () => {
        const { result } = await loadUseColorPalettes();

        waitFor(() =>
            expect(result.current.colorPalettes).toEqual([
                ColorPaletteDummy.with(678, 'Palette 1'),
                ColorPaletteDummy.with(427, 'Palette 2'),
                ColorPaletteDummy.with(679, 'Palette 3'),
            ]),
        );
    });

    it('should not throw createColorPalette', async () => {
        const { result } = await loadUseColorPalettes();

        const createColorPaletteMock = vi.fn().mockImplementation(result.current.createColorPalette);

        expect(createColorPaletteMock()).resolves.not.toThrow();
    });

    it('should not throw updateColorPalette', async () => {
        const { result } = await loadUseColorPalettes();

        const updateColorPaletteMock = vi.fn().mockImplementation(result.current.updateColorPalette);

        expect(updateColorPaletteMock()).resolves.not.toThrow();
    });

    it('should not throw updateColorPalette', async () => {
        const { result } = await loadUseColorPalettes();

        const deleteColorPaletteMock = vi.fn().mockImplementation(result.current.deleteColorPalette);

        expect(deleteColorPaletteMock()).resolves.not.toThrow();
    });

    it('downloadColorKit to be successful', () => {
        const appBridge = new AppBridgeBlock(BLOCK_ID, SECTION_ID);

        const spy = vi.spyOn(appBridge, 'downloadColorKit').mockReturnValue(COLOR_PALETTE_DOWNLOAD_LINK_PART);

        expect(appBridge.downloadColorKit([COLOR_PALETTE_ID])).toBe(COLOR_PALETTE_DOWNLOAD_LINK_PART);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveReturnedWith(COLOR_PALETTE_DOWNLOAD_LINK_PART);
    });
});
