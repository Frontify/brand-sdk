/* (c) Copyright Frontify Ltd., all rights reserved. */

import { toHexString } from './toHexString';
import { describe, expect, test } from 'vitest';

describe('toHexString', () => {
    const data = [
        { color: { red: 255, green: 255, blue: 255 }, expected: '#ffffff' },
        { color: { red: 255, green: 221, blue: 255 }, expected: '#ffddff' },
        { color: { red: 255, green: 255, blue: 15 }, expected: '#ffff0f' },
        { color: { red: 238, green: 35, blue: 84 }, expected: '#ee2354' },
    ];

    test.each(data)('validates against expected values', ({ color, expected }) => {
        expect(toHexString(color)).toBe(expected);
    });
});
