/* (c) Copyright Frontify Ltd., all rights reserved. */

import { toRgbaString } from './toRgbaString';
import { describe, expect, test } from 'vitest';

describe('toRgbaString', () => {
    const data = [{ color: { red: 1, green: 2, blue: 3, alpha: 0.5 }, expected: 'rgba(1, 2, 3, 0.5)' }];

    test.each(data)('validates against expected values', ({ color, expected }) => {
        expect(toRgbaString(color)).toBe(expected);
    });
});
