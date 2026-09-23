/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ColorPaletteDummy, getAppBridgeBlockStub } from '../tests';

import { useColorPalettes } from './useColorPalettes';

const appBridgeStub = getAppBridgeBlockStub();

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
});
