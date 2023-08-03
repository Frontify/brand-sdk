/* (c) Copyright Frontify Ltd., all rights reserved. */

import { isDark } from './isDark';
import { describe, expect, test } from 'vitest';

describe('isDark', () => {
    const data = [
        { color: { red: 0, green: 0, blue: 0 }, expected: true },
        { color: { red: 255, green: 255, blue: 255 }, expected: false },
        { color: { red: 130, green: 95, blue: 255 }, expected: true },
        { color: '#000000', expected: true },
        { color: '#FFFFFF', expected: false },
        { color: 'rgb(0,0,0)', expected: true },
        { color: 'rgb(255,255,255)', expected: false },
    ];

    test.each(data)('validate values correctly', ({ color, expected }) => {
        expect(isDark(color)).toBe(expected);
    });
});

describe('isDark with custom threshold', () => {
    const data = [
        { color: { red: 0, green: 0, blue: 0 }, threshold: 150, expected: true },
        { color: { red: 255, green: 102, blue: 0 }, threshold: 150, expected: true },
        { color: { red: 255, green: 147, blue: 73 }, threshold: 171, expected: true },
        { color: { red: 255, green: 255, blue: 255 }, threshold: 150, expected: false },
    ];

    test.each(data)('validate values correctly', ({ color, threshold, expected }) => {
        expect(isDark(color, threshold)).toBe(expected);
    });
});
