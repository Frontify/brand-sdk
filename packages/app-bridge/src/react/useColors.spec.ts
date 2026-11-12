/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ColorPaletteDummy, getAppBridgeBlockStub } from '../tests';

import { useColors } from './useColors';

const COLOR_PALETTE_ID = 427;
const UNKNOWN_COLOR_PALETTE_ID = 1;

describe('useColors hook', () => {
    const loadUseColors = (colorPaletteId = COLOR_PALETTE_ID) => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useColors(appBridgeStub, colorPaletteId));

        return { result, appBridgeStub };
    };

    it('should get the colors of the palette from the color palettes with colors', async () => {
        const { result, appBridgeStub } = loadUseColors();

        await waitFor(() =>
            expect(result.current.colorsByPaletteId).toEqual(ColorPaletteDummy.with(COLOR_PALETTE_ID).colors),
        );
        expect(appBridgeStub.getColorPalettesWithColors.calledWith([COLOR_PALETTE_ID])).toBe(true);
        expect(appBridgeStub.getColorsByColorPaletteId.called).toBe(false);
    });

    it('should get no colors for a palette that does not exist', async () => {
        const { result, appBridgeStub } = loadUseColors(UNKNOWN_COLOR_PALETTE_ID);

        await waitFor(() => expect(appBridgeStub.getColorPalettesWithColors.called).toBe(true));
        expect(result.current.colorsByPaletteId).toEqual([]);
    });

    it('should not throw createColor', async () => {
        const { result } = loadUseColors();

        const createColorMock = vi.fn().mockImplementation(result.current.createColor);

        await expect(createColorMock()).resolves.not.toThrow();
    });

    it('should not throw updateColor', async () => {
        const { result } = loadUseColors();

        const updateColorMock = vi.fn().mockImplementation(result.current.updateColor);

        await expect(updateColorMock()).resolves.not.toThrow();
    });

    it('should not throw deleteColor', async () => {
        const { result } = loadUseColors();

        const deleteColorMock = vi.fn().mockImplementation(result.current.deleteColor);

        await expect(deleteColorMock()).resolves.not.toThrow();
    });
});
