/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ColorDummy, getAppBridgeBlockStub } from '../tests';

import { useColors } from './useColors';

const COLOR_PALETTE_ID = 1;

describe('useColors hook', () => {
    const loadUseColors = () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useColors(appBridgeStub, COLOR_PALETTE_ID));

        return { result };
    };

    it('should get all the colors of a palette', async () => {
        const { result } = await loadUseColors();

        waitFor(() =>
            expect(result.current.colorsByPaletteId).toEqual([
                ColorDummy.red(9834),
                ColorDummy.yellow(9314),
                ColorDummy.green(342),
            ]),
        );
    });

    it('should not throw createColor', async () => {
        const { result } = await loadUseColors();

        const createColorMock = vi.fn().mockImplementation(result.current.createColor);

        await expect(createColorMock()).resolves.not.toThrow();
    });

    it('should not throw updateColor', async () => {
        const { result } = await loadUseColors();

        const updateColorMock = vi.fn().mockImplementation(result.current.updateColor);

        await expect(updateColorMock()).resolves.not.toThrow();
    });

    it('should not throw deleteColor', async () => {
        const { result } = await loadUseColors();

        const deleteColorMock = vi.fn().mockImplementation(result.current.deleteColor);

        await expect(deleteColorMock()).resolves.not.toThrow();
    });
});
