/* (c) Copyright Frontify Ltd., all rights reserved. */

import { setAlpha } from './setAlpha';
import { describe, expect, test } from 'vitest';

describe('setAlpha', () => {
    const data = [
        {
            color: 'rgba(255, 255, 255, 0.1)',
            alpha: 1,
            expected: 'rgb(255, 255, 255)',
        },
        {
            color: 'rgb(255, 255, 255)',
            alpha: 0.9,
            expected: 'rgba(255, 255, 255, 0.9)',
        },
        {
            color: '#00000',
            alpha: 0.9,
            expected: 'rgba(0, 0, 0, 0.9)',
        },
    ];

    test.each(data)('validates against expected values', ({ color, alpha, expected }) => {
        expect(setAlpha(alpha, color)).toBe(expected);
    });
});
