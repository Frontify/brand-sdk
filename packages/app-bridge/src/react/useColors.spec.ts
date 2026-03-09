/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
});
