/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';
import { toColorObject } from './toColorObject';

describe('toColorObject', () => {
    const data = [
        { expected: { red: 255, green: 255, blue: 255, alpha: 1 }, color: '#ffffffff' },
        { expected: { red: 255, green: 221, blue: 255, alpha: 1 }, color: '#ffddffff' },
        { expected: { red: 255, green: 255, blue: 15, alpha: 0 }, color: '#ffff0f00' },
        { expected: { red: 238, green: 35, blue: 84, alpha: 0.4 }, color: '#ee235466' },
        { expected: { red: 255, green: 0, blue: 0, alpha: 1 }, color: 'rgb(255,0,0)' },
        { expected: { red: 255, green: 0, blue: 0, alpha: 0.5 }, color: 'rgba(255,0,0,0.5)' },
    ];

    test.each(data)('validates against expected values', ({ color, expected }) => {
        expect(toColorObject(color)).toEqual(expected);
    });
});
