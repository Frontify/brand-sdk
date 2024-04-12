/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ColorDummy } from '@frontify/app-bridge';
import { describe, expect, it } from 'vitest';

import { mapAppBridgeColorPalettesToFonduePalettes } from './mapColorPalettes';

describe('mapAppBridgeColorPalettesToFonduePalettes', () => {
    it('should map app bridge color palette to fondue palette', () => {
        const result = mapAppBridgeColorPalettesToFonduePalettes([
            {
                id: 19,
                name: 'Awesome color palette',
                description: 'This is an awesome color palette',
                colors: [ColorDummy.green(), ColorDummy.yellow(), ColorDummy.red()],
            },
        ]);
        expect(result).toEqual([
            {
                id: 19,
                title: 'Awesome color palette',
                colors: [
                    {
                        alpha: 1,
                        blue: 0,
                        green: 255,
                        red: 0,
                        name: 'Green',
                    },
                    {
                        alpha: 1,
                        blue: 0,
                        green: 255,
                        red: 255,
                        name: 'Yellow',
                    },
                    {
                        alpha: 1,
                        blue: 0,
                        green: 0,
                        red: 255,
                        name: 'Red',
                    },
                ],
            },
        ]);
    });
});
