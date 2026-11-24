/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { parseLegacyColor } from './color';

describe('parseLegacyColor', () => {
    it.each([
        { input: 'rgb(255, 0, 0)', expected: '#ff0000' },
        { input: 'rgba(255, 0, 0, 1)', expected: '#ff0000' },
        { input: 'rgba(255, 0, 0, 0.5)', expected: '#ff000080' },
        { input: '#F00', expected: '#ff0000' },
        { input: '#FF0000', expected: '#ff0000' },
        { input: '#FF000080', expected: '#ff000080' },
        { input: '#ff0000ff', expected: '#ff0000' },
    ])('should read $input as $expected (MIG-23)', ({ input, expected }) => {
        expect(parseLegacyColor(input)).toBe(expected);
    });

    it.each([
        'red',
        'hsl(0, 100%, 50%)',
        '#f008',
        '#ff00',
        'rgb(100%, 0%, 0%)',
        'rgb 0 0 0',
        'rgb(0, 0, 0',
        'transparent',
        '',
        '#',
        'rgb(',
    ])('should reject the colour %j (MIG-23)', (input) => {
        expect(parseLegacyColor(input)).toBeNull();
    });

    it.each([undefined, null, 255, true, { r: 255 }, ['#ff0000']])(
        'should reject the value %j that is not a string (MIG-23)',
        (input) => {
            expect(parseLegacyColor(input)).toBeNull();
        },
    );
});
