/* (c) Copyright Frontify Ltd., all rights reserved. */

import { toHex8String } from './toHex8String';
import { describe, expect, test } from 'vitest';

describe('toHex8String', () => {
    const data = [
        { color: { red: 255, green: 255, blue: 255 }, expected: '#ffffffff' },
        { color: { red: 255, green: 221, blue: 255, alpha: 1 }, expected: '#ffddffff' },
        { color: { red: 255, green: 255, blue: 15, alpha: 0 }, expected: '#ffff0f00' },
        { color: { red: 238, green: 35, blue: 84, alpha: 0.4 }, expected: '#ee235466' },
    ];

    test.each(data)('validates against expected values', ({ color, expected }) => {
        expect(toHex8String(color)).toBe(expected);
    });
});
