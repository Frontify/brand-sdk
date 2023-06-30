/* (c) Copyright Frontify Ltd., all rights reserved. */

import { toShortRgba } from './toShortRgba';
import { describe, expect, test } from 'vitest';

describe('toShortRgba', () => {
    const data = [
        { color: { red: 50, green: 100, blue: 150 }, expected: { r: 50, g: 100, b: 150, a: 1 } },
        { color: { red: 50, green: 100, blue: 150, alpha: 0.5 }, expected: { r: 50, g: 100, b: 150, a: 0.5 } },
        { color: { r: 50, g: 100, b: 150, a: 0.5 }, expected: { r: 50, g: 100, b: 150, a: 0.5 } },
    ];

    test.each(data)('validates against expected values', ({ color, expected }) => {
        expect(toShortRgba(color)).toStrictEqual(expected);
    });
});
