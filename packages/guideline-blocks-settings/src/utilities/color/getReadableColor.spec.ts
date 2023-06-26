/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readability } from '@ctrl/tinycolor';
import { describe, expect, test } from 'vitest';
import { getReadableColor } from './getReadableColor';

describe('getReadableColor', () => {
    const data = [
        {
            textColor: { r: 255, g: 255, b: 255 },
            backgroundColor: { r: 0, g: 0, b: 0 },
        },
        {
            textColor: { r: 255, g: 255, b: 255 },
            backgroundColor: { r: 255, g: 255, b: 255 },
        },
        {
            textColor: { r: 230, g: 230, b: 0 },
            backgroundColor: { r: 229, g: 229, b: 10 },
        },
        {
            textColor: { r: 120, g: 120, b: 120 },
            backgroundColor: { r: 120, g: 120, b: 120, a: 0.1 },
        },
    ];

    test.each(data)('validates against expected values', ({ textColor, backgroundColor }) => {
        const result = getReadableColor(textColor, backgroundColor);
        const colorReadability = readability(result, backgroundColor);
        expect(colorReadability).toBeGreaterThan(4.5);
    });
});
